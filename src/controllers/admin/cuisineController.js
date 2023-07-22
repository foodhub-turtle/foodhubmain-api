import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllCuisines } from "../../services/cuisineService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
const fs = require("fs");
import { uploadImage } from "../../libs/globalUpload";

const { cuisine } = Model;

export const getAllCuisines = catchAsync(async (req, res, next) => {
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
  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let cuisines = await findAllCuisines(cuisine, where, limit, offset);
  
  cuisines = getPaginationData(cuisines, req.query.page, limit);
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: cuisines
  });
});

export const getCuisineById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(cuisine, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Cuisine not found"
    });
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createCuisine = catchAsync(async (req, res, next) => {
  console.log(req.files);
  const name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.slice(1);
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
  if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
    req.body.image = await uploadImage(req.files.image[0]);
  }
  if (!_.isEmpty(req.files) && !_.isEmpty(req.files.mobile_banner[0])) {
      req.body.mobile_banner = await uploadImage(req.files.mobile_banner[0]);
  }

  const [cuisineObj, created] = await findOrCreate(cuisine, {
    ...req.body,
    name
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Cuisine already exist"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Cuisine created successfully",
    payload: _.omit(cuisineObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateCuisine = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const slug = req.body.name.toLowerCase().replace(/ /g, "_");

  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
  if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
    req.body.image = await uploadImage(req.files.image[0]);
  }
  if (!_.isEmpty(req.files) && !_.isEmpty(req.files.mobile_banner[0])) {
      req.body.mobile_banner = await uploadImage(req.files.mobile_banner[0]);
  }
  const result = await update(cuisine, {
    ...req.body
  }, id);

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Cuisine didn't updated"
    });
  }

  const resultData = await findByPk(cuisine, id);

  return res.status(200).json({
    status: "success",
    message: "Cuisine updated successfully",
    statusCode: 200,
    payload: resultData
  });
});

export const changeStatusCuisine = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  delete req.body.id;
  const result = await update(cuisine, {...req.body}, id);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Cuisine didn't updated"
    });
  }

  const cuisines = await findAll(cuisine);

  const results = _.map(cuisines, cuisineObj => _.omit(cuisineObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Cuisine updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deleteCuisineById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(cuisine, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Cuisine not found"
    });
  }
  const cuisines = await findAll(cuisine);

  const results = _.map(cuisines, cuisineObj => _.omit(cuisineObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Cuisine deleted successfully",
    payload: results
  });
});

export const updateCuisineStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(cuisine, {
      ...req.body,
      id
  });
  if (!result[0]) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Cuisine not found"
      });
  }
  const resultData = await findByPk(cuisine, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Cuisine status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});