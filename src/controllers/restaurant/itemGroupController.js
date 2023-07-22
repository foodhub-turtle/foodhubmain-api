import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findAllPending,findAllActive, findOrCreate, create, findByPk, update, deleteByPk, findOneById } from "../../services/itemGroupService.js";
import { deleteByItemGroup } from "../../services/ingredientMappingService";
import catchAsync from "../../libs/catchAsync.js";
const { findAllItemGroups } = require("../../services/itemGroupService.js");
const { findByItemGroupId } = require("../../services/ingredientMappingService");
const { findIngredientByPk } = require("../../services/ingredientService");

const { item_group, ingredient_mapping, ingredient } = Model;

export const getAllItemGroups = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;
  let itemGroups = await findAllActive(item_group, {status: 1, branch_id: branch_id});
  for (let groupIndex = 0; groupIndex < itemGroups.length; groupIndex++) {
    let elementGroup = itemGroups[groupIndex];
    
    let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: elementGroup.id}); 
    for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
      let elementIngredient = ingredients_mappings[ingredientIndex];
      let ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
      elementIngredient.name = ingredientObj.name;
    }
    elementGroup.ingredients = ingredients_mappings;
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: itemGroups
  });
});
export const getAllPendingItemGroups = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const itemGroups = await findAllPending(item_group, {status: 0, branch_id: id});


  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: itemGroups
  });
});

export const getItemGroupById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findOneById(item_group, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item Group not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createItemGroup = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;
  const itemGroup = await create(item_group, {
    name: req.body.name,
    ingredient_type: req.body.ingredient_type,
    minimum_ingredients: req.body.minimum_ingredients,
    maximum_ingredients: req.body.maximum_ingredients,
    created_by: req.body.created_by,
    branch_id: branch_id,
    status: 0
  });
  // if (!created) {
  //   return res.status(400).json({
  //     status: "fail",
  //     statusCode: 400,
  //     message: "Item group already exist"
  //   });
  // }
  
  const ingredients = req.body.ingredients;
  const result = _.omit(itemGroup.toJSON(), ["updatedAt", "createdAt"]);
  
  ingredients.forEach(async (value, index) => {
    if (value.ingredient_id == 0) {
      let name = value.ingredient_name.toLowerCase().charAt(0).toUpperCase() + value.ingredient_name.slice(1);
      const [ingredientObj, created] = await findOrCreate(ingredient, {
        ...req.body,
        name
      });
      let ingredients_mapping = {
        item_group_id: result.id,
        ingredient_id: ingredientObj.id,
        ingredient_price: value.price,
        ingredient_price_before_discount: 0.00
      };
  
      const itemMapping = await create(ingredient_mapping, {
        ...ingredients_mapping
      });
    }else{
      let ingredients_mapping = {
        item_group_id: result.id,
        ingredient_id: value.ingredient_id,
        ingredient_price: value.price,
        ingredient_price_before_discount: 0.00
      };
  
      const itemMapping = await create(ingredient_mapping, {
        ...ingredients_mapping
      });
    }

  });
  const resultItemGroup = await findByPk(item_group, result.id);

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Item Group with ingredients created successfully",
    payload: resultItemGroup
  });
});

export const updateItemGroup = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  let removeIngredients = await deleteByItemGroup(ingredient_mapping, id);
  console.log(removeIngredients);

  const result = await update(item_group, {
      name: req.body.name,
      ingredient_type: req.body.ingredient_type,
      minimum_ingredients: req.body.minimum_ingredients,
      maximum_ingredients: req.body.maximum_ingredients,
      created_by: req.body.created_by,
      id,
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Item group didn't updated"
    });
  }

  
  const ingredients = req.body.ingredients;
  
  ingredients.forEach(async (value, index) => {

    let ingredients_mapping = {
      item_group_id: result.id,
      ingredient_id: value.ingredient_id,
      ingredient_price: value.price,
      ingredient_price_before_discount: 0.00
    };

    const itemMapping = await create(ingredient_mapping, {
      ...ingredients_mapping
    });
  });
  const resultData = await findByPk(item_group, id);

  return res.status(201).json({
    status: "success",
    message: "Item group updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const deleteItemGroupById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(item_group, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item group not found"
    });
  }
  const item_groups = await findAll(item_group);

  const results = _.map(item_groups, itemgroupObj => _.omit(itemgroupObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Item group deleted successfully",
    payload: results
  });
});

export const updateItemGroupStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(item_group, {
      ...req.body,
      id
  });
  if (!result) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item group not found"
      });
  }
  const resultData = await findByPk(item_group, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Item group status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});