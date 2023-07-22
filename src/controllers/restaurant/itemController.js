import _ from "lodash";
import Model from "../../models/index.js";
import { findAllItemsByBranch, findOrCreate, findByPk, updateFromBranch, deleteByPk, findAllByRestaurantId } from "../../services/itemService.js";
import { create, findItemMapByFilter, updateMapping } from "../../services/itemMappingService.js";
import { createVariant, updateVariant, findAllVariantByBranch } from "../../services/itemVariantService.js";
const commonService = require("../../services/commonService.js");
import catchAsync from "../../libs/catchAsync.js";
import { findByBranchId } from "../../services/branchService.js";
import { findByItemGroupId } from "../../services/ingredientMappingService.js";
import { findIngredientByPk } from "../../services/ingredientService.js";
const fs = require("fs");

const { item, item_mapping, item_group_mapping, item_variant, branch, item_group, ingredient_mapping, ingredient } = Model;

export const getAllItems = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;

  let where = {};

  if (req.query.status == 'approve') {
    where.approve_status = 1;
    where.status = 1;
  }else if(req.query.status == 'pending'){
    where.approve_status = 0;
    where.status = 1;
  }else if(req.query.status == 'rejected'){
    where.approve_status = 0;
    where.status = 0;
  }
  where.branch_id = branch_id;
  const items = await findAllItemsByBranch(item, where);

  // const results = _.map(items, (itemObj) => {
  //   if (!_.isEmpty(itemObj.image)) {
  //     console.log(itemObj);
  //     itemObj.image = fs.readFileSync(__basedir + "/uploads/" + itemObj.image, {encoding: 'base64'});
  //   }
  //   return itemObj;
  // });
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: items
  });
});

export const getItemById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  let result = await findByPk(item, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item not found"
    });
  }
  result = result.toJSON();

  let itemMapping = await findItemMapByItemId(item_mapping, result.id);
  if (itemMapping) {
    let itemMappingGroups = await findAllItemGroupMappingByItemMapId(item_group_mapping, {item_mapping_id: itemMapping.id, status: 1});
    var item_groups = [];
    for (let index = 0; index < itemMappingGroups.length; index++) {
      var element = itemMappingGroups[index];
      item_groups.push(await findAllItemGroups(item_group, {id: element.item_group_id}));
    }
    for (let groupIndex = 0; groupIndex < item_groups.length; groupIndex++) {
      var elementGroup = item_groups[groupIndex];
      
      let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: elementGroup.id}); 
      for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
        let elementIngredient = ingredients_mappings[ingredientIndex];
        var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
        elementIngredient.name = ingredientObj.name;
      }
      elementGroup.ingredients = ingredients_mappings;
    }
    element.item_groups = item_groups;
  
    result.itemMappingGroups = itemMappingGroups;
  }else{
    result.itemMappingGroups = null;
  }

  // const itemGroups = await findAllItemGroupsByItemId(item_group, {item});
  result.is_hasVariants = itemMapping.is_hasVariants;
  if (itemMapping.is_hasVariants) {
    result.priceVariants = await findAllItemVariants(item_variant, {item_id: itemMapping.item_id, branch_id: itemMapping.branch_id});
  }
  // if (!_.isEmpty(result.image)) {
  //   result.image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + result.image, {encoding: 'base64'});
  // }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result, ["updatedAt", "createdAt"])
  });
});

export const createItem = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.slice(1);
  // if (!_.isEmpty(req.file)) {
  //  req.body.image = req.file.filename;
  // }
  let itemPayload = {
    name: name,
    description: req.body.description,
    image: req.body.image,
    category_id: req.body.category_id,
    branch_id: req.body.branch_id,
    price: req.body.price,
    created_by: req.body.created_by,
    is_hasVariants: req.body.variations.length > 0 ? 1: 0,
    approve_status: 1,
    status: req.body.status
  };
  const [itemObj, created] = await findOrCreate(item, {
    ...itemPayload,
    name
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Item already exist"
    });
  }
  const groups = req.body.item_group_id;
  const variations = req.body.variations;
  var result = await findByBranchId(branch, id);
  if (groups.length > 0) {
    const itemMapping = await create(item_mapping, {
      item_id: itemObj.id,
      restaurant_id: result.parent_id,
      branch_id: req.body.branch_id,
      category_id: req.body.category_id,
      created_by: itemObj.created_by
    });

    
    const result = _.omit(itemMapping.toJSON(), ["updatedAt", "createdAt"]);
    
    groups.forEach(async (value, index) => {
  
      let item_group = {
        item_mapping_id: itemMapping.id,
        item_group_id: value,
        created_by: itemObj.created_by
      };
  
      const itemGroupMapping = await create(item_group_mapping, {
        ...item_group
      });
    });
  }
  
  if (variations.length > 0) {
    variations.forEach(async (value, index) => {
      const variant = await createVariant(item_variant, {
        item_id: itemObj.id,
        branch_id: req.body.branch_id,
        price: value.variantionPrice,
        name: value.variantionName,
        status: 0
      });
    });
  }

  // if (!_.isEmpty(req.file)) {
  //   itemObj.image = req.file.filename;
    
  //   fs.writeFileSync(
  //     __basedir + "/uploads" + req.file.originalname,
  //     itemObj.image
  //   );
  //   const contents = fs.readFileSync(__basedir + "/uploads/" + itemObj.image, {encoding: 'base64'});
  //   itemObj.image = contents;  
  // }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Item created successfully",
    payload: _.omit(itemObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateItem = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const slug = req.body.name.toLowerCase().replace(/ /g, "_");
  if (!_.isEmpty(req.file)) {
    req.body.image = req.file.filename;
  }
  const result = await updateFromBranch(item, {...payload},{id: id, branch_id: branch_id});

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Item didn't updated"
    });
  }

  const resultData = await findByPk(item, id);
  if (!_.isEmpty(req.file)) {
    resultData.image = req.file.filename;
    fs.writeFileSync(
      __basedir + "/uploads" + req.file.originalname,
      resultData.image
    );
    const contents = fs.readFileSync(__basedir + "/uploads/" + resultData.image, {encoding: 'base64'});
    resultData.image = contents;  
  }
  

  return res.status(201).json({
    status: "success",
    message: "Item updated successfully",
    statusCode: 200,
    payload: resultData
  });
});
export const setItemPrice = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const branch_id = req.body.branch_id;
  if (req.body.price != 0) {
    const result = await updateFromBranch(item, {
      price: req.body.price,
      status: 1
    },{id: id, branch_id: branch_id});
    if (!result[0]) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Item didn't updated"
      });
    }
  }
  const variations = req.body.variations;
  if (variations.length > 0) {
    variations.forEach(async (value, index) => {
      const itemMapping = await findItemMapByFilter(item_mapping, {item_id: id, branch_id: branch_id});
      if (itemMapping.is_hasVariants == 0) {
        let payload = {
          is_hasVariants: 1
        }
        const result = await updateMapping(item_mapping, payload, itemMapping.id);
        
      }
      if (value.variation_id != 0) {
        const variant = await updateVariant(item_variant, {
          price: value.variation_price,
          name: value.variation_name,
          status: 1
        }, {id: value.variation_id});
      }else{
        const variantObj = await createVariant(item_variant, {
          item_id: id,
          branch_id: branch_id,
          price: value.variation_price,
          name: value.variation_name,
          status: 1
        });
      }
    });
  }
  

  let resultData = await findByPk(item, id);
  if (variations.length > 0) {
    const variants = await findAllVariantByBranch(item_variant, {branch_id: branch_id, status: 1});
    resultData.variants = variants;
  }
  
  return res.status(201).json({
    status: "success",
    message: "Item updated successfully",
    statusCode: 200,
    payload: resultData
  });
});
export const getPendingItemVariantPrice = catchAsync(async (req, res, next) => {
  const branch_id = req.query.branch_id;
  const pendingVariation = await findAllVariantByBranch(item_variant, {status: 0, reject_status: 0, branch_id: branch_id});

  if (pendingVariation.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Item variant not found"
    });
  }

  return res.status(201).json({
    status: "success",
    message: "Item variant list",
    statusCode: 200,
    payload: pendingVariation
  });
});
export const updateItemStatusById = catchAsync(async (req, res, next) => {
  console.log(req.body.status);
  const id = req.query.id;
  const branch_id = req.body.branch_id;
  const payload = {status: req.body.status};
  const result = await commonService.updateModelAndFilter(item_mapping, payload,{item_id: id, branch_id: branch_id});

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Item didn't updated"
    });
  }
  let branchItem = await commonService.findWithModelAndFilter(item_mapping, {item_id: id, branch_id: branch_id});
  let itemObj = await commonService.findWithModelAndFilter(item, {id: id});

  branchItem.item = itemObj;

  return res.status(201).json({
    status: "success",
    message: "Item updated successfully",
    statusCode: 200,
    payload: branchItem
  });
});
export const deleteItemById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(item, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item not found"
    });
  }
  const items = await findAll(item);

  const results = _.map(items, itemObj => _.omit(itemObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Item deleted successfully",
    payload: results
  });
});