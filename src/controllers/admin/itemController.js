import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllByRestaurantId, findAllItems, findAllItemVariants } from "../../services/itemService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
const fs = require("fs");
import { createVariant, updateVariant, findAllVariantByBranch, findOneVariant } from "../../services/itemVariantService.js";
const categoryService = require("../../services/categoryService.js");
import { updateHasVariant } from "../../services/itemMappingService.js";
import { uploadImage } from "../../libs/globalUpload";
const { item, item_variant, item_mapping, item_category } = Model;

export const getAllItems = catchAsync(async (req, res, next) => {
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
  if (searchTerm.is_popular) {
    andAttributes.push({is_popular: parseInt(searchTerm.is_popular)});
  }
  if (searchTerm.category_name) {
    let category = await categoryService.findCategoryByBranch(item_category, {name: searchTerm.category_name});
    andAttributes.push({category_id: parseInt(category.id)});
  }
  if (searchTerm.approve_status) {
    andAttributes.push({approve_status: parseInt(searchTerm.approve_status)});
  }
  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let items = await findAllItems(item, where, limit, offset);
  console.log(items);
  
  items = getPaginationData(items, req.query.page, limit);
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: items
  });
});

export const getItemById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(item, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item not found"
    });
  }
  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result, ["updatedAt", "createdAt"])
  });
});
export const getItemVariants = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const branch_id = req.query.branch_id;
  console.log('select - ', id, branch_id);

  const results = await findAllItemVariants(item_variant, {item_id: id, branch_id: branch_id});
  if (!results) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});
export const updateItemVariants = catchAsync(async (req, res, next) => {
  const variant_id = req.body.variant_id;
  const payload = req.body.payload;

  const variant = await updateVariant(item_variant, payload, {id: variant_id});
  const results = await findOneVariant(item_variant, {id: variant_id});

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});
export const setItemVariants = catchAsync(async (req, res, next) => {

  const result = await createVariant(item_variant, {
    item_id: req.body.item_id,
    branch_id: req.body.branch_id,
    created_by: req.body.created_by,
    name: req.body.variantObj.variant_name,
    price: parseFloat(req.body.variantObj.variant_price),
    status: 1,
    reject_status: 0
  });
  const results = await findAllItemVariants(item_variant, {item_id: req.body.item_id});
  const resultVariant = await updateHasVariant(item_mapping, {
    is_hasVariant: 1,
    item_id: req.body.item_id,
    branch_id: req.body.branch_id
  });
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const createItem = catchAsync(async (req, res, next) => {
  const name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.slice(1);
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }

  const [itemObj, created] = await findOrCreate(item, {
    ...req.body,
    name
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Item already exist"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Item created successfully",
    payload: _.omit(itemObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateItem = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
  const result = await update(item, {
    ...req.body}, id);

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Item didn't updated"
    });
  }

  const resultData = await findByPk(item, id);
  
  return res.status(201).json({
    status: "success",
    message: "Item updated successfully",
    statusCode: 200,
    payload: resultData
  });
});
export const updateItemStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  delete req.body.id;
  const result = await update(item, {
    ...req.body}, id);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Item didn't updated"
    });
  }

  const items = await findAll(item);

  const results = _.map(items, itemObj => _.omit(itemObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Item updated successfully",
    statusCode: 200,
    payload: results
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