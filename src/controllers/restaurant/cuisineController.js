import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk } from "../../services/cuisineService.js";
import catchAsync from "../../libs/catchAsync.js";
const fs = require("fs");

const { cuisine } = Model;

export const getAllCuisines = catchAsync(async (req, res, next) => {
  const cuisines = await findAll(cuisine);

  const results = _.map(cuisines, (cuisineObj) => {
    if (!_.isEmpty(cuisineObj.image)) {
      console.log(cuisineObj);
      cuisineObj.image = fs.readFileSync(__basedir + "/uploads/" + cuisineObj.image, {encoding: 'base64'});
    }
    return cuisineObj;
  });

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
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
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createCuisine = catchAsync(async (req, res, next) => {
  const name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.slice(1);
  if (!_.isEmpty(req.file)) {
    req.body.image = req.file.filename;
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
  if (!_.isEmpty(req.file)) {
    cuisineObj.image = req.file.filename;
    
    fs.writeFileSync(
      __basedir + "/uploads" + req.file.originalname,
      cuisineObj.image
    );
    const contents = fs.readFileSync(__basedir + "/uploads/" + cuisineObj.image, {encoding: 'base64'});
    cuisineObj.image = contents;  
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
    req.body.image = req.file.filename;
  }
  const result = await update(cuisine, {
    ...req.body,
    id,
    slug
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Cuisine didn't updated"
    });
  }

  const resultData = await findByPk(cuisine, id);
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
    message: "Cuisine updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const changeStatusCuisine = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(cuisine, {
    ...req.body,
    id
  });

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