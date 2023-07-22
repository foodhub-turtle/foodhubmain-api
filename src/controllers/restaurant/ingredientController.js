import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk } from "../../services/ingredientService.js";
import catchAsync from "../../libs/catchAsync.js";


const { ingredient } = Model;

export const getAllIngredients = catchAsync(async (req, res, next) => {
  const ingredients = await findAll(ingredient);

  const results = _.map(ingredients, ingredientObj => _.omit(ingredientObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const getIngredientById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(ingredient, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Ingredient not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createIngredient = catchAsync(async (req, res, next) => {
  console.log(req.body)
 const name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.slice(1);
  const [ingredientObj, created] = await findOrCreate(ingredient, {
    ...req.body,
    name
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Ingredient already exist"
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Ingredient created successfully",
    payload: _.omit(ingredientObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateIngredient = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const slug = req.body.name.toLowerCase().replace(/ /g, "_");
  const result = await update(ingredient, {
    ...req.body,
    id,
    slug
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Ingredient didn't updated"
    });
  }

  const resultData = await findByPk(ingredient, id);

  return res.status(201).json({
    status: "success",
    message: "Ingredient updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});
export const updateIngredientStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(ingredient, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Ingredient didn't updated"
    });
  }

  const ingredients = await findAll(ingredient);

  const results = _.map(ingredients, ingredientObj => _.omit(ingredientObj, ['updatedAt', 'createdAt']));

  return res.status(201).json({
    status: "success",
    message: "Ingredient updated successfully",
    statusCode: 200,
    payload: results
  });
});

export const deleteIngredientById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(ingredient, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Ingredient not found"
    });
  }
  const ingredients = await findAll(ingredient);

  const results = _.map(ingredients, ingredientObj => _.omit(ingredientObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Ingredient deleted successfully",
    payload: results
  });
});

// export const updateIngredientStatusById = catchAsync(async (req, res, next) => {
//   const id = req.query.id;

//   const result = await update(ingredient, {
//       ...req.body,
//       id
//   });
//   if (!result[0]) {
//       return res.status(404).json({
//       status: "fail",
//       statusCode: 404,
//       message: "Ingredient not found"
//       });
//   }
//   const resultData = await findByPk(ingredient, id);
//   return res.status(200).json({
//       status: "success", 
//       statusCode: 200,
//       message: "Ingredient status updated successfully",
//       payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
//   });
// });