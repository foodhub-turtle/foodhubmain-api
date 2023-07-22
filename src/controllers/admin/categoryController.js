import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllCategory, findAllPendingCategories, findOrCreateApprove, findById, findByCategoryId, updateBranchCategory } from "../../services/categoryService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
const fs = require("fs");
const { item_category, branch_category, branch } = Model;
import { uploadImage } from "../../libs/globalUpload";

export const getAllCategories = catchAsync(async (req, res, next) => {
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
  if (searchTerm.branch_id) {
    const branchObj = await findById(branch, searchTerm.branch_id);
    console.log(branchObj.category_id);
    andAttributes.push({id: {[Op.in]: branchObj.category_id}});

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
  let categories = await findAllCategory(item_category, where, limit, offset);


  categories = getPaginationData(categories, req.query.page, limit);
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: categories
  });
});

export const getAllPendingCategories = catchAsync(async (req, res, next) => {
  const branch_id = req.query.id;
  const categories = await findAllPendingCategories(branch_category, {branch_id: branch_id, status: 0});

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: categories
  });
});
export const updateNewCategory = catchAsync(async (req, res, next) => {
  const branch_id = req.body.branch_id;
  const id = parseInt(req.body.category_id);
  const category = await findByCategoryId(branch_category, {branch_id: branch_id, id: id});
  if (category) {
    if (req.body.payload.status == 1) {
      console.log(req.body);
      delete category.id;
      let payloadStatus = {status: 1};
      category.status = 1;
      const [newApproveCategory, created] = await findOrCreateApprove(item_category, category);
      const updateOld = await updateBranchCategory(branch_category, {
        ...payloadStatus
      }, id);
      if (created) {
        let result = await findById(branch, branch_id);
        result.category_id.push(newApproveCategory.id);
        const updateBranch = await update(branch, {
          ...result
        }, result.id);
      }
    }else if (req.body.payload.status == 0) {
      if (req.body.payload.reject_status == 1){
        let payloadStatus2 = {status: 0, reject_status: 1};
        const updateRejectOld = await updateBranchCategory(branch_category, {
          ...payloadStatus2,
          id,
        });
      }
    }
  }
  const categories = await findAllPendingCategories(branch_category, {branch_id: branch_id, status: 0});

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
    payload: result
  });
});

export const createCategory = catchAsync(async (req, res, next) => {
 const slug = req.body.name.toLowerCase().replace(/ /g, "_");
 let image = '';
 if (!_.isEmpty(req.file)) {
  image = await uploadImage(req);
  }
  console.log('Image----', image);
  const [categoryObj, created] = await findOrCreate(item_category, {
    ...req.body,
    image,
    slug
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Category already exist"
    });
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
    req.body.image = await uploadImage(req.file);
    console.log(req.body);

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

  return res.status(201).json({
    status: "success",
    message: "Category updated successfully",
    statusCode: 200,
    payload: resultData
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
        payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
    });
});