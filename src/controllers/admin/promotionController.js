import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, createPromotionObj, findByPk, update, deleteByPk, create, findAllPromotions, updateStatus, updatePromo } from "../../services/promotionService.js";
import { updateRestaurantNotification, findAllFilter } from "../../services/restaurantNotificationService.js";
import catchAsync from "../../libs/catchAsync.js";
import { updateBranch, findAllBranch } from "../../services/branchService.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
const fs = require("fs");

const { promotion, branch, restaurant_notification } = Model;

export const getAllPromotions = catchAsync(async (req, res, next) => {
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
    andAttributes.push({is_all_branch: parseInt(searchTerm.is_all_branch)});
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
  let promotions = await findAllPromotions(promotion, where, limit, offset);
  for (let index = 0; index < promotions.rows.length; index++) {
    const element = promotions.rows[index];
    if (element.is_all_branch == 0) {
      promotions.rows[index].branches = await findAllFilter(restaurant_notification, {notification_table: 'promotion', notification_table_id: element.id});
    }
  }
  promotions = getPaginationData(promotions, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: promotions
  });
});

export const getPromotionById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(promotion, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createPromotion = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const title = req.body.title.toLowerCase().charAt(0).toUpperCase() + req.body.title.slice(1);
  req.body.url_key = req.body.title.toLowerCase().replace(/ /g, "_");
  
  let ids = [];
    if (req.body.is_all_branch == '0'){
      req.body.branch_ids.forEach(element => {
        ids.push(parseInt(element));
      });
      req.body.branch_ids = ids;
    }
    const newPromotion = await createPromotionObj(promotion, {
      ...req.body
    }); 
    let promotionObj = newPromotion.toJSON();
  
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
      let notification_table_id = promotionObj.id;
      let payload = {
        branch_id: branch_id,
        notification_table: 'promotion',
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
    message: "Promotion created successfully",
    payload: promotionObj
  });
});

export const updatePromotion = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    req.body.url_key = req.body.title.toLowerCase().replace(/ /g, "_");
    
    const result = await updatePromo(promotion, {
        ...req.body}, id);

    if (!result[0]) {
        return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Promotion didn't updated"
        });
    }
    let ids = [];
    if (req.body.is_all_branch == '0'){
      req.body.branch_ids.forEach(element => {
        ids.push(parseInt(element));
      });
      req.body.branch_ids = ids;
    }
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
      let notification_table_id = id;
      let payload = {
        branch_id: branch_id,
        notification_table: 'promotion',
        notification_table_id: notification_table_id,
        status: 1
      };
  
      const result = await updateRestaurantNotification(restaurant_notification, {
        ...payload,
        branch_id,
        notification_table_id
      });
    }
    const resultData = await findByPk(promotion, id);

    return res.status(201).json({
        status: "success",
        message: "Promotion updated successfully",
        statusCode: 200,
        payload: resultData
    });
});

export const changeStatusPromotion = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await updateStatus(promotion, {...req.body},id);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion didn't updated"
    });
  }

  const promotions = await findAll(promotion);

  const results = _.map(promotions, promotionObj => _.omit(promotionObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Promotion updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deletePromotionById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(promotion, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion not found"
    });
  }
  const promotions = await findAll(promotion);

  const results = _.map(promotions, promotionObj => _.omit(promotionObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Promotion deleted successfully",
    payload: results
  });
});

export const updatePromotionStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(promotion, {
      ...req.body,
      id
  });
  if (!result[0]) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion not found"
      });
  }
  const resultData = await findByPk(promotion, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Promotion status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});