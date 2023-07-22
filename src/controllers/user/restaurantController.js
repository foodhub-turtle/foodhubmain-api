import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findAllFilter, findOrCreate, findByPk, update, deleteByPk } from "../../services/restaurantService.js";
import catchAsync from "../../libs/catchAsync.js";
import { Op } from 'sequelize';

const { restaurant } = Model;

export const getAllRestaurants = catchAsync(async (req, res, next) => {
  
  const restaurants = await findAll(restaurant);

  const results = _.map(restaurants, restaurantObj => _.omit(restaurantObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});
export const getAllRestaurantsWithQueries = catchAsync(async (req, res, next) => {
  const filters = req.query;
  let where = {};

  if (filters.category_id) {
    filters.category_id = filters.category_id.split(',');
    where.category_id = { [Op.contains]: filters.category_id };
  }
  const restaurants = await findAllFilter(restaurant, where);

  // const results = _.map(restaurants, restaurantObj => _.omit(restaurantObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: restaurants
  });
});

export const getRestaurantById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(restaurant, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createRestaurant = catchAsync(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const phone = req.body.phone;
  const [restaurantObj, created] = await findOrCreate(restaurant, {
    ...req.body,
    email,
    phone
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Restaurant already exist"
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Restaurant created successfully",
    payload: _.omit(restaurantObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateRestaurant = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(restaurant, {
    ...req.body,
    id
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant didn't updated"
    });
  }

  const resultData = await findByPk(restaurant, id);

  return res.status(201).json({
    status: "success",
    message: "Restaurant updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const deleteRestaurantById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(restaurant, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Restaurant deleted successfully"
  });
});




