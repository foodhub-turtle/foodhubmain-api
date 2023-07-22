import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findAllFilter, findOrCreate, findByPk, update, deleteByPk, findByBranchId, createOpening, deleteOpeningByBranch } from "../../services/branchService.js";
import { findAllCuisine } from "../../services/cuisineService.js";
import { findById } from "../../services/categoryService.js";
import catchAsync from "../../libs/catchAsync.js";
import { findByFilter } from "../../services/restaurantDiscountService.js";
import { findAllDefault } from "../../services/index.js";
const cuisineService = require("../../services/cuisineService.js");
import { findAllByCategoryId,findOneMapping, findAllPopular, findBranchItemFilter, findAllItemVariants, findAllItemGroupMappingByItemMapId, findOneItem } from "../../services/itemService.js";
import { findGroups, findAllItemGroups, findItemGroupByPk} from "../../services/itemGroupService.js";
const { findItemMapByItemId, findItemMapByCategory } = require("../../services/itemMappingService.js");
const { findIngredientByPk } = require("../../services/ingredientService");
import { findByItemGroup, findByItemGroupId} from "../../services/ingredientMappingService";
import { Op } from 'sequelize';
const fs = require("fs");

const { branch, cuisine, order, item_category, restaurant_discount, item, item_group, ingredient_mapping, opening_hour, item_variant, item_mapping, item_group_mapping, ingredient } = Model;

export const getAllBranchs = catchAsync(async (req, res, next) => {
  
  const branchs = await findAll(branch);

  const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const getAllCuisines = catchAsync(async (req, res, next) => {
  const cuisines = await findAllCuisine(cuisine);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const getAllYourBranchs = catchAsync(async (req, res, next) => {
  
  const filters = req.query;
  let where = {};
  let orAttributes = [];


  if (filters.order_type) {
    orAttributes.push({order_type: filters.order_type});
  }

  where = {
    [Op.or]: orAttributes
  };

  const branchs = await findAllFilter(branch, where);

  // const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branchs
  });
});

export const getAllRecommandedBranchs = catchAsync(async (req, res, next) => {
  console.log('where');
  
  const filters = req.query;
  let where = {};
  let andAttributes = [];


  if (filters.order_type) {
    andAttributes.push({is_recommended: filters.is_recommended});
  }

  where = {
    [Op.and]: andAttributes
  };
  const branchs = await findAllFilter(branch, where);

  // const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branchs
  });
});

export const getAllBranchsWithQueries = catchAsync(async (req, res, next) => {
  
  const filters = req.query;
  let where = {};
  let orAttributes = [];
  let andAttributes = [];

  if (filters.order_type && filters.order_type != 'all') {
    orAttributes.push({order_type: filters.order_type});
  }
  
  if (filters.vertical) {
    orAttributes.push({branch_type: filters.vertical});
  }
  if (filters.is_free_delivery) {
    orAttributes.push({is_free_delivery: filters.is_free_delivery});
  }

  if (filters.is_offer_available) {
    orAttributes.push({is_offer_available: filters.is_offer_available});
  }
  if (filters.is_online_payment) {
    orAttributes.push({is_online_payment: filters.is_online_payment});
  }
  if (filters.is_donation) {
    orAttributes.push({is_donation: filters.is_donation});
  }
  if (filters.average_cost) {
    orAttributes.push({average_cost: filters.average_cost});
  }
  if (filters.category) {
    filters.category = filters.category.split(',');
    orAttributes.push({category_id: { [Op.contains]: filters.category }});
  }
  if (filters.cuisine) {
    filters.cuisine = filters.cuisine.split(',');
    orAttributes.push({cuisine_id: { [Op.contains]: filters.cuisine }});
  }
  if (filters.name) {
    orAttributes.push({name: {
      [Op.or]: [{[Op.like]: "%"+filters.name+"%"}, {[Op.like]: "%"+filters.name.toLowerCase()+"%"}]
    }});
  }
  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  console.log(where);
  const branchs = await findAllFilter(branch, where);

  // const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branchs
  });
});

export const getBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  var result = await findByBranchId(branch, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Branch not found"
    });
  }
  result = _.omit(result.toJSON(), ['updatedAt', 'createdAt']);
  if (result.is_hasDiscount) {
    var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: result.id});
    result.discount = restaurantDiscount;
  }

  var categories = [];
  var cuisines = [];
  for (let index = 0; index < result.cuisine_id.length; index++) {
    let element = result.cuisine_id[index];
    var cuisineObj = await cuisineService.findByPk(cuisine, element);
    cuisines.push(_.omit(cuisineObj));
  }

  for (let index = 0; index < result.category_id.length; index++) {
    let element = result.category_id[index];
    var category = await findById(item_category, element);
    // var items = await findAllByCategoryId(item, {category_id: category.id, branch_id: result.id, approve_status: 1, status: 1});
    let items = await findItemMapByCategory(item_mapping, {category_id: category.id, branch_id: result.id});
    for (let indexObj = 0; indexObj < items.length; indexObj++) {
      const elementObj = items[indexObj];
      items[indexObj] = await findOneItem(item, elementObj.item_id);
    }
    for (let indexItem = 0; indexItem < items.length; indexItem++) {
      let elementItem = items[indexItem];
      let itemMapping = await findItemMapByItemId(item_mapping, elementItem.id);
      if (itemMapping) {
        let itemMappingGroups = await findAllItemGroupMappingByItemMapId(item_group_mapping, {item_mapping_id: itemMapping.id, status: 1});
        var item_groups = [];
        for (let index = 0; index < itemMappingGroups.length; index++) {
          var elementitemMapping = itemMappingGroups[index];
          item_groups.push(elementitemMapping);
        }
        for (let groupIndex = 0; groupIndex < item_groups.length; groupIndex++) {
          var elementGroup = item_groups[groupIndex];
          let itemGroupObj = await findItemGroupByPk(item_group, elementGroup.item_group_id);
          let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: itemGroupObj.id}); 
          for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
            let elementIngredient = ingredients_mappings[ingredientIndex];
            var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
            ingredients_mappings[ingredientIndex].name = ingredientObj.name;
          }
          
          itemGroupObj.ingredients = ingredients_mappings;
          item_groups[groupIndex] = itemGroupObj;
        }

        // itemMappingGroups[index] = item_groups;
      
        elementItem.itemMappingGroups = item_groups;
      }else{
        elementItem.itemMappingGroups = null;
      }
      console.log(itemMapping);
      elementItem.is_hasVariants = itemMapping.is_hasVariants;
      if (itemMapping.is_hasVariants) {
        elementItem.priceVariants = await findAllItemVariants(item_variant, {item_id: itemMapping.item_id, branch_id: itemMapping.branch_id});
      }
    }
    
    category.items = items;
    categories.push(_.omit(category));
  }
  var popularItems = await findAllPopular(item, result.id);
  for (let indexPopularItem = 0; indexPopularItem < popularItems.length; indexPopularItem++) {
    const elementPopularItem = popularItems[indexPopularItem];
    if (elementPopularItem.is_hasVariants) {
      elementPopularItem.priceVariants = await findAllItemVariants(item_variant, {item_id: elementPopularItem.id});
    }
  }
  result.popularitems = popularItems;
  const itemGroups = await findGroups(item_group);
  for (let index = 0; index < itemGroups.length; index++) {
    const element = itemGroups[index];
    let ingredientMapping = await findByItemGroup(ingredient_mapping, {item_group_id: element.id});
    let mappedIngredient = ingredientMapping.map(ingredient => ingredient.b.name);
    element.ingredients = mappedIngredient.join(',');
  }
  result['itemGroups'] = itemGroups;
  result['categories'] = _.map(categories, categoryObj => _.omit(categoryObj, ['updatedAt', 'createdAt']));
  result['cuisines'] = _.map(cuisines, cuisineObj => _.omit(cuisineObj, ['updatedAt', 'createdAt']));
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createBranch = catchAsync(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const phone = req.body.phone;
  const [branchObj, created] = await findOrCreate(branch, {
    ...req.body,
    email,
    phone
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Branch already exist"
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Branch created successfully",
    payload: _.omit(branchObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateBranch = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(branch, {
    ...req.body,
    id
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Branch didn't updated"
    });
  }

  const resultData = await findByPk(branch, id);

  return res.status(201).json({
    status: "success",
    message: "Branch updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const changeStatusBranch = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(branch, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Branch didn't updated"
    });
  }

  const branches = await findAll(branch);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Branch updated successfully",
    statusCode: 200,
    payload: results
  });
});

export const deleteBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(branch, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Branch not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Branch deleted successfully"
  });
});


export const insertOpeningHours = catchAsync(async (req, res, next) => {
  const id = req.body.branch_id;
  const result = await deleteOpeningByBranch(opening_hour, {branch_id: id});
  const data = req.body.payload;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const openingHourObj = await createOpening(opening_hour, {
      branch_id: id,
      days: element.days,
      fromHour: element.fromHour,
      toHour: element.toHour,
      status: 1
    });
  }

  const opening_hours = await findAllDefault(opening_hour, {branch_id: id});

  const results = _.map(opening_hours, opening_hourObj => _.omit(opening_hourObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Opening hours",
    payload: results
  });
});
export const updateOpeningHoursBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.branch_id;

  const [openingHourObj, created] = await findOrCreate(opening_hour, {
    ...req.body
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Opening hour already exist"
    });
  }

  const opening_hours = await findAllDefault(opening_hour, {branch_id: id});

  const results = _.map(opening_hours, opening_hourObj => _.omit(opening_hourObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Opening hours",
    payload: results
  });
});
export const getOpeningHoursBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const opening_hours = await findAllDefault(opening_hour, {branch_id: id});

  const results = _.map(opening_hours, opening_hourObj => _.omit(opening_hourObj, ['updatedAt', 'createdAt']));

  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Opening hours",
    payload: results
  });
});






