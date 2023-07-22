import _ from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllCustomers } from "../../services/customerService.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
const commonService = require("../../services/commonService.js");
import { Op } from 'sequelize';
const { customer, app_review } = Model;

export const getAllCustomers = catchAsync(async (req, res, next) => {
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
  if (searchTerm.email) {
    andAttributes.push({email: searchTerm.email});
  }
  if (searchTerm.phone) {
    andAttributes.push({phone: searchTerm.phone});
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
  
  let customers = await findAllCustomers(customer, where, limit, offset);
  for (let index = 0; index < customers.rows.length; index++) {
    const element = customers.rows[index];
    customers.rows[index].appreview = await commonService.findWithModelAndFilter(app_review, {customer_id: element.id})
  }
  customers = getPaginationData(customers, req.query.page, limit);
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: customers
  });
});

export const getCustomerById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(customer, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Customer not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});
export const getCustomers = catchAsync(async (req, res, next) => {
  const results = await commonService.findAllWithModelAndFilter(customer, {status: 1});

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const createCustomer = catchAsync(async (req, res, next) => {
  const [customerObj, created] = await findOrCreate(customer, {
    ...req.body
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Customer already exist"
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Customer created successfully",
    payload: _.omit(customerObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateCustomer = catchAsync(async (req, res, next) => {
  console.log(req.body)

  const id = req.query.id;
  const result = await update(customer, {
    ...req.body,
    id
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Customer didn't updated"
    });
  }

  const resultData = await findByPk(customer, id);

  return res.status(201).json({
    status: "success",
    message: "Customer updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});
export const updateCustomerStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(customer, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Customer didn't updated"
    });
  }

  const customers = await findAll(customer);

  const results = _.map(customers, customerObj => _.omit(customerObj, ['updatedAt', 'createdAt']));

  return res.status(201).json({
    status: "success",
    message: "Customer updated successfully",
    statusCode: 200,
    payload: results
  });
});

export const deleteCustomerById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(customer, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Customer not found"
    });
  }
  const customers = await findAll(customer);

  const results = _.map(customers, customerObj => _.omit(customerObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Customer deleted successfully",
    payload: results
  });
});