import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllPages } from "../../services/pageService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';

const { page } = Model;

export const getAllPages = catchAsync(async (req, res, next) => {
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
  let pages = await findAllPages(page, where, limit, offset);
  
  pages = getPaginationData(pages, req.query.page, limit);
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: pages
  });
});

export const getPageById = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  console.log(id);

  const result = await findByPk(page, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Page not found"
    });
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createPage = catchAsync(async (req, res, next) => {
  const page_title = req.body.page_title.toLowerCase().charAt(0).toUpperCase() + req.body.page_title.slice(1);
console.log(req.body);
  const [pageObj, created] = await findOrCreate(page, {
    ...req.body,
    page_title
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Page already exist"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Page created successfully",
    payload: _.omit(pageObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updatePage = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(page, {
    ...req.body
  }, id);

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Page didn't updated"
    });
  }

  const resultData = await findByPk(page, id);

  return res.status(200).json({
    status: "success",
    message: "Page updated successfully",
    statusCode: 200,
    payload: resultData
  });
});

export const changeStatusPage = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  delete req.body.id;
  const result = await update(page, {...req.body}, id);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Page didn't updated"
    });
  }

  const pages = await findAll(page);

  const results = _.map(pages, pageObj => _.omit(pageObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Page updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deletePageById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(page, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Page not found"
    });
  }
  const pages = await findAll(page);

  const results = _.map(pages, pageObj => _.omit(pageObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Page deleted successfully",
    payload: results
  });
});

export const updatePageStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(page, {
      ...req.body,
      id
  });
  if (!result[0]) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Page not found"
      });
  }
  const resultData = await findByPk(page, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Page status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});