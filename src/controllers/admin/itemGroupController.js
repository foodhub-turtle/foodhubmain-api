import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, create, findByPk, update, deleteByPk, findOneById, findAllItemGroup, findItemGroups } from "../../services/itemGroupService.js";
import { deleteByItemGroup, findOrCreateIngredientMapping, updateIngredintMapping } from "../../services/ingredientMappingService";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
import { findByItemGroupId } from "../../services/ingredientMappingService.js";
import { findIngredientByPk } from "../../services/ingredientService.js";

const { item_group, ingredient_mapping, ingredient } = Model;

export const getAllItemGroups = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.name) {
    andAttributes.push({name: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.name+"%"}, {[Op.like]: "%"+searchTerm.name.toLowerCase()+"%"}]
    }});
  }
  if (searchTerm.status) {
    andAttributes.push({status: parseInt(searchTerm.status)});
  }else{
    orAttributes.push({status: {[Op.in]: [0, 1]}});
  }
  if (searchTerm.ingredient_type) {
    andAttributes.push({ingredient_type: parseInt(searchTerm.ingredient_type)});
  }
  
  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let itemGroups = await findAllItemGroup(item_group, where, limit, offset);
  for (let index = 0; index < itemGroups.rows.length; index++) {
    const element = itemGroups.rows[index];
    let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: element.id}); 
    for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
      let elementIngredient = ingredients_mappings[ingredientIndex];
      var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
      elementIngredient.name = ingredientObj.name;
    }
    itemGroups.rows[index].ingredients = ingredients_mappings;
  }
  itemGroups = getPaginationData(itemGroups, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: itemGroups
  });
});

export const getItemGroupById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  let result = await findOneById(item_group, id);
  let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: result.id, status: 1}); 
  for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
    let elementIngredient = ingredients_mappings[ingredientIndex];
    var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
    elementIngredient.name = ingredientObj.name;
  }
  result.ingredients = ingredients_mappings;
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
    payload: result
  });
});
export const getItemGroupByIds = catchAsync(async (req, res, next) => {
  const ids = [];
  req.query.ids.split(',').forEach(group => {
    ids.push(parseInt(group));
  });

  const results = await findItemGroups(item_group, {id: {[Op.in]: ids}});

  for (let index = 0; index < results.length; index++) {
    const element = results[index];
    let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: element.id}); 
    for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
      let elementIngredient = ingredients_mappings[ingredientIndex];
      var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
      elementIngredient.name = ingredientObj.name;
    }
    results[index].ingredients = ingredients_mappings;
  }

  if (results.length === 0) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item Group not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const createItemGroup = catchAsync(async (req, res, next) => {

  const itemGroup = await create(item_group, {
    name: req.body.name,
    ingredient_type: req.body.ingredient_type,
    minimum_ingredients: req.body.minimum_ingredients,
    maximum_ingredients: req.body.maximum_ingredients,
    created_by: req.body.created_by
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
  // let removeIngredients = await deleteByItemGroup(ingredient_mapping, id);

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
      item_group_id: id,
      ingredient_id: value.ingredient_id,
      ingredient_price: value.price,
      ingredient_price_before_discount: 0.00,
      status: 1
    };

    const itemMapping = await findOrCreateIngredientMapping(ingredient_mapping, {
      ...ingredients_mapping
    });
  });
  const ingredientArray = ingredients.map(ingredientobj => {
    return parseInt(ingredientobj.ingredient_id);
  });
  let ingredients_mapping = await findAll(ingredient_mapping, {item_group_id: id});
  let existingIngredientMapping = ingredients_mapping.map(ingredient_mapping => {
    return { ingredient_id: ingredient_mapping.ingredient_id, item_group_id: ingredient_mapping.item_group_id, ingredient_mapping_id: ingredient_mapping.id};
  });
  for (let index = 0; index < existingIngredientMapping.length; index++) {
    const element = existingIngredientMapping[index];
    console.log('outside-id',element.ingredient_id, ingredients, ingredientArray);
    if (!_.includes(ingredientArray, element.ingredient_id)) {
      let filteredObj = _.find(ingredients, { ingredient_id: element.ingredient_id});
      let updatePayload = {
        item_group_id: element.item_group_id,
        created_by: req.body.created_by,
        status: 0
      }
      const result = await updateIngredintMapping(ingredient_mapping, {...updatePayload}, element.ingredient_mapping_id);
    }else if(_.includes(ingredientArray, element.ingredient_id)){
      let filteredObj = _.find(ingredients, { ingredient_id: element.ingredient_id});
      let updatePayload = {
        item_group_id: element.item_group_id,
        ingredient_price: filteredObj.price,
        created_by: req.body.created_by,
        status: 1
      }
      const result = await updateIngredintMapping(ingredient_mapping, {...updatePayload}, element.ingredient_mapping_id);
    }
  }
  
  const resultData = await findByPk(item_group, id);

  return res.status(200).json({
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