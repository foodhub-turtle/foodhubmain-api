import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, createDiscountObj, findById, update, deleteByPk, findAllDiscounts } from "../../services/discountService.js";
import { updateRestaurantNotification } from "../../services/restaurantNotificationService.js";
import { updateBranch, findAllBranch } from "../../services/branchService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
const fs = require("fs");
import { Op } from 'sequelize';
const { discount, branch, restaurant_notification } = Model;

export const getAllDiscounts = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.title) {
    andAttributes.push({title: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.title+"%"}, {[Op.like]: "%"+searchTerm.title.toLowerCase()+"%"}]
    }});
  }
  if (searchTerm.is_all_branch) {
    andAttributes.push({is_all_branch: searchTerm.is_all_branch});
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
  let discounts = await findAllDiscounts(discount, where, limit, offset);

  discounts = getPaginationData(discounts, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: discounts
  });
});

export const getDiscountById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findById(discount, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Discount not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createDiscount = catchAsync(async (req, res, next) => {
  let ids = [];
  if (req.body.is_all_branch == '0'){
    req.body.branch_ids.forEach(element => {
      ids.push(parseInt(element));
    });
    req.body.branch_ids = ids;
  }
  let discountPayload = {
    created_by: req.body.created_by,
    description: req.body.description,
    discount_amount: req.body.discount_amount,
    discount_percentage: req.body.discount_percentage,
    discount_type: req.body.discount_type,
    end_date: req.body.end_date,
    is_all_branch: req.body.is_all_branch,
    is_excluding_tax: req.body.is_excluding_tax,
    is_excluding_vat: req.body.is_excluding_vat,
    is_firstOrderOnly: req.body.is_firstOrderOnly,
    maximum_discount: req.body.maximum_discount,
    minimum_order_amount: req.body.minimum_order_amount,
    start_date: req.body.start_date,
    status: req.body.status,
    title: req.body.title,
  }
  const newDiscount = await createDiscountObj(discount, {
    ...discountPayload
  }); 
  let discountObj = newDiscount.toJSON();
  console.log('called', req.body.is_all_branch);

  let branches;
  let where;
  if (req.body.is_all_branch == '1') {
    where = {status: 1};
    branches = await findAllBranch(branch, where);
  }else if (req.body.is_all_branch == '0'){
    where = {
      id: {
        [Op.in]: ids
      },
      status: 1
    };
    branches = await findAllBranch(branch, where);
  }
  for (let index = 0; index < branches.length; index++) {
    const element = branches[index];
    let branch_id = element.id;
    let notification_table_id = discountObj.id;
    let payload = {
      branch_id: branch_id,
      notification_table: 'discount',
      notification_table_id: notification_table_id,
      status: 1
    };

    const result = await updateRestaurantNotification(restaurant_notification, {
      ...payload,
      branch_id,
      notification_table_id
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Discount created successfully",
    payload: discountObj
  });
});

export const updateDiscount = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  delete req.body.id;
  req.body.category_id = [req.body.category_id];
  req.body.cuisine_id = [req.body.cuisine_id];
  const result = await update(discount, {...req.body},id);

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Discount didn't updated"
    });
  }

  const resultData = await findById(discount, id);

  return res.status(201).json({
    status: "success",
    message: "Discount updated successfully",
    statusCode: 200,
    payload: resultData
  });
});
export const changeStatusDiscount = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(discount, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Discount didn't updated"
    });
  }

  const branches = await findAll(discount);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Discount updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deleteDiscountById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(discount, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Discount not found"
    });
  }
  const branches = await findAll(discount);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Discount deleted successfully",
    payload: results
  });
});