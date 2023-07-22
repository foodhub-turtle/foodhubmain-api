import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findById, update, deleteByPk, findAllVouchers, updateVoucherById } from "../../services/voucherService.js";
import { updateBranch,findByBranchId } from "../../services/branchService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
const fs = require("fs");

const { voucher, branch } = Model;

export const getAllVouchers = catchAsync(async (req, res, next) => {
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
  if (searchTerm.voucher_code) {
    andAttributes.push({voucher_code: searchTerm.voucher_code});
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
  let vouchers = await findAllVouchers(voucher, where, limit, offset);
  for (let index = 0; index < vouchers.rows.length; index++) {
    const element = vouchers.rows[index];
    if (element.is_all_branch == 0) {
      vouchers.rows[index].branch = await findByBranchId(branch, element.branch_id);
    }
  }
  vouchers = getPaginationData(vouchers, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: vouchers
  });
});

export const getVoucherById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findById(voucher, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createVoucher = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let id = req.body.branch_id;
  req.body.voucher_code = req.body.voucher_code.toLowerCase();
  delete req.body.branch_id;
  req.body.status = 1;
  const [newVoucher, created] = await findOrCreate(voucher, {
    ...req.body
  }); 
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Voucher already exist"
    });
  }
  if (req.body.is_all_branch == '0') {
    let payload = {is_hasVoucher: 1};
    const result = await updateBranch(branch, {
      ...payload,
      id
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Voucher created successfully",
    payload: _.omit(newVoucher.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateVoucher = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  req.body.voucher_code = req.body.voucher_code.toLowerCase();
  const result = await updateVoucherById(voucher, {
    ...req.body}, id);

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher didn't updated"
    });
  }
  if (req.body.is_all_branch == '0') {
    let payload = {is_hasVoucher: 1};
    const result = await updateBranch(branch, {
      ...payload,
      id
    });
  }
  const resultData = await findById(voucher, id);

  return res.status(201).json({
    status: "success",
    message: "Voucher updated successfully",
    statusCode: 200,
    payload: resultData
  });
});
export const changeStatusVoucher = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(voucher, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher didn't updated"
    });
  }

  const branches = await findAll(voucher);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Voucher updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deleteVoucherById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(voucher, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher not found"
    });
  }
  const branches = await findAll(voucher);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Voucher deleted successfully",
    payload: results
  });
});