import _ from "lodash";
import Model from "../../models/index.js";
import { findCategoryByBranch, findOrCreate,findOrCreateBranch, findByPk, update, deleteByPk, findAllType, findAllPendingCategories } from "../../services/categoryService.js";
import { findGroups} from "../../services/itemGroupService.js";
import { findByBranchId} from "../../services/branchService.js";
import { findByItemGroup} from "../../services/ingredientMappingService";
import catchAsync from "../../libs/catchAsync.js";
const fs = require("fs");

const { item_category, item_category_type, item_group, ingredient_mapping, branch, branch_category } = Model;

export const getAllCategories = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;

  var result = await findByBranchId(branch, branch_id);

  var categories = [];
  for (let index = 0; index < result.category_id.length; index++) {
    const element = result.category_id[index];
    let where = {};

    if (req.query.status == 'approve') {
      where.status = 1;
    }else if(req.query.status == 'pending'){
      where.status = 0;
    }
    where.id = element;
    var category = await findCategoryByBranch(item_category, where);
    if (category) {
      categories.push(_.omit(category));
    }
  }


  const results = _.map(categories, (categoryObj) => {
    if (!_.isEmpty(categoryObj.image)) {
      console.log(categoryObj);
      categoryObj.image = fs.readFileSync(__basedir + "/uploads/" + categoryObj.image, {encoding: 'base64'});
    }
    return categoryObj;
  });
  const itemGroups = await findGroups(item_group);
  for (let index = 0; index < itemGroups.length; index++) {
    const element = itemGroups[index];
    let ingredientMapping = await findByItemGroup(ingredient_mapping, {item_group_id: element.id});
    let mappedIngredient = ingredientMapping.map(ingredient => ingredient.b.name);
    element.ingredients = mappedIngredient.join(',');
  }
  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results,
    itemGroups: itemGroups
  });
});
export const getAllPendingCategories = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;
  const categories = await findAllPendingCategories(branch_category, {branch_id: branch_id, status: 0, reject_status: 0});

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: categories
  });
});
export const getAllRejectedCategories = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;
  const categories = await findAllPendingCategories(branch_category, {branch_id: branch_id, status: 0, reject_status: 1});

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: categories
  });
});
export const getAllCategoriesTypes = catchAsync(async (req, res, next) => {
  const categories = await findAllType(item_category_type);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: categories
  });
});

export const getCategoryById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(item_category, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Category not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result, ["updatedAt", "createdAt"])
  });
});

export const createCategory = catchAsync(async (req, res, next) => {
 const slug = req.body.name.toLowerCase().replace(/ /g, "_");
 const branch_id = req.body.branch_id;
 if (!_.isEmpty(req.file)) {
   req.body.image = req.file.filename;
 }
 req.body.branch_id = branch_id;
  const [categoryObj, created] = await findOrCreateBranch(branch_category, {
    ...req.body,
    slug
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Category already exist"
    });
  }
  // const [categoryObj, created] = await findOrCreate(item_category, {
  //   ...req.body,
  //   slug
  // });
  // if (!created) {
  //   return res.status(400).json({
  //     status: "fail",
  //     statusCode: 400,
  //     message: "Category already exist"
  //   });
  // }

  if (!_.isEmpty(req.file)) {
    categoryObj.image = req.file.filename;
    
    fs.writeFileSync(
      __basedir + "/uploads" + req.file.originalname,
      categoryObj.image
    );
    const contents = fs.readFileSync(__basedir + "/uploads/" + categoryObj.image, {encoding: 'base64'});
    categoryObj.image = contents;
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Category created successfully",
    payload: _.omit(categoryObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const slug = req.body.name.toLowerCase().replace(/ /g, "_");
  if (!_.isEmpty(req.file)) {
    req.body.image = req.file.filename;
  }
  const result = await update(item_category, {
    ...req.body,
    id,
    slug
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Category didn't updated"
    });
  }
  const resultData = await findByPk(item_category, id);
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
    message: "Category updated successfully",
    statusCode: 200,
    payload: _.omit(resultData, ["updatedAt", "createdAt"])
  });
});
export const changeStatusCategory = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(item_category, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Category didn't updated"
    });
  }

  const categories = await findAll(item_category);

  const results = _.map(categories, categoryObj => _.omit(categoryObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Category updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deleteCategoryById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(item_category, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Category not found"
    });
  }

  const categories = await findAll(item_category);

  const results = _.map(categories, categoryObj => _.omit(categoryObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});
export const updateCategoryStatusById = catchAsync(async (req, res, next) => {
    const id = req.query.id;

    const result = await update(item_category, {
        ...req.body,
        id
    });
    if (!result[0]) {
        return res.status(404).json({
        status: "fail",
        statusCode: 404,
        message: "Category not found"
        });
    }
    const resultData = await findByPk(item_category, id);
    return res.status(200).json({
        status: "success", 
        statusCode: 200,
        message: "Category status updated successfully",
        payload: _.omit(resultData, ["updatedAt", "createdAt"])
    });
});