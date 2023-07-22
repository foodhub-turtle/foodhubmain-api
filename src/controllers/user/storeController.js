import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findAllStoreFilter, findOrCreate, findByPk, update, deleteByPk } from "../../services/branchService.js";
import { findAllCuisine } from "../../services/cuisineService.js";
import catchAsync from "../../libs/catchAsync.js";
import { Op } from 'sequelize';
const fs = require("fs");

const { branch, cuisine } = Model;


export const getAllStoresWithQueries = catchAsync(async (req, res, next) => {
  
  const filters = req.query;
  let where = {};
  let orAttributes = [];
  let andAttributes = [];


  andAttributes.push({branch_type: "store"});
  orAttributes.push({status: 1});
  if (filters.order_type && filters.order_type != 'all') {
    orAttributes.push({order_type: filters.order_type});
  }

  if (filters.is_free_delivery) {
    orAttributes.push({is_free_delivery: filters.is_free_delivery});
  }

  if (filters.is_offer_available) {
    orAttributes.push({is_offer_available: filters.is_offer_available});
  }
  if (filters.is_online_payment) {
    orAttributes.push({is_online_payment: filters.is_online_payment});
  }
  if (filters.is_donation) {
    orAttributes.push({is_donation: filters.is_donation});
  }
  if (filters.average_cost) {
    orAttributes.push({average_cost: filters.average_cost});
  }
  if (filters.category_id) {
    filters.category_id = filters.category_id.split(',');
    orAttributes.push({category_id: { [Op.contains]: filters.category_id }});
  }
  if (filters.cuisine_id) {
    filters.cuisine_id = filters.cuisine_id.split(',');
    orAttributes.push({cuisine_id: { [Op.contains]: filters.cuisine_id }});
  }
  if (filters.name) {
    orAttributes.push({name: {
      [Op.or]: [{[Op.like]: "%"+filters.name+"%"}, {[Op.like]: "%"+filters.name.toLowerCase()+"%"}]
    }});
  }
  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  console.log(where);
  const branchs = await findAllStoreFilter(branch, where);

  // const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branchs
  });
});





