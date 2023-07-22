import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findById, update, deleteByPk, findVoucherByCode } from "../../services/voucherService.js";
import { updateBranch } from "../../services/branchService.js";
import catchAsync from "../../libs/catchAsync.js";
const fs = require("fs");
import { Op } from 'sequelize';
import moment from 'moment';
const commonService = require("../../services/commonService.js");

const { voucher, branch } = Model;

export const getAllVouchers = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  let payload = {};
  const vouchers = await findAll(voucher, {branch_id: 0, status: 1});
  if (id) {
    const branchVouchers = await findAll(voucher, {branch_id: id, status: 1});
    payload.branchVouchers = branchVouchers;
  }

  payload.commonVouchers = vouchers;
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: payload
  });
});
export const getVoucherWithType = catchAsync(async (req, res, next) => {
  let customer_id = req.query.id;

  let vouchersActive = await findAll(voucher, {status: 1, is_forCustomer: 0});
  let customerVouchers = await findAll(voucher, {status: 1, is_forCustomer: 1, customer_id: customer_id});
  let vouchersPast = await commonService.findAllWithModel(voucher);
  var compareDate = moment();
  let currentVouchers = _.filter(vouchersActive, (voucher) => {
    let startDate = moment(voucher.start_date), endDate = moment(voucher.end_date);
    if (compareDate.isBetween(startDate, endDate)) {
      return voucher;
    }
  });
  let pastVouchers = _.filter(vouchersPast, (voucher) => {
    let startDate = moment(voucher.start_date), endDate = moment(voucher.end_date);
    if (!compareDate.isBetween(startDate, endDate)) {
      return voucher;
    }
  });
  currentVouchers = _.concat(currentVouchers, customerVouchers);
  let payload = {
    current: currentVouchers,
    past: pastVouchers,
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: payload
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
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createVoucher = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let id = req.body.branch_id;

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
  if (!_.isEmpty(req.file)) {
    req.body.image = req.file.filename;
  }
  req.body.category_id = [req.body.category_id];
  req.body.cuisine_id = [req.body.cuisine_id];
  const result = await update(voucher, {
    ...req.body,
    id
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher didn't updated"
    });
  }

  const resultData = await findById(voucher, id);
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
    message: "Voucher updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
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

export const checkVoucher = catchAsync(async (req, res, next) => {
  let data = req.query.voucher.toLowerCase();

  let voucherObj = await findVoucherByCode(voucher, {voucher_code: data});
  if (voucherObj == null) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher not found"
    });
  }
  console.log(voucherObj);
  var compareDate = moment(moment()),
  startDate   = moment(voucherObj.start_date),
  endDate     = moment(voucherObj.end_date);

  var time = moment(moment(),'hh:mm:ss'),
  beforeTime = moment(voucherObj.start_time, 'hh:mm:ss'),
  afterTime = moment(voucherObj.end_time, 'hh:mm:ss');

  if (!compareDate.isBetween(startDate, endDate)) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher date expired",
      payload: voucherObj
    });
  }
  if (!time.isBetween(beforeTime, afterTime)) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Voucher time expired",
      payload: voucherObj
    });
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: voucherObj
  });
});