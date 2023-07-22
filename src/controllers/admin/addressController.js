import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { findOrCreate, findByCustomerId, findAll, findByPk, update, deleteByPk, findAllAddresses } from "../../services/addressService.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';

const { address } = Model;

export const getAllAddress = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let addresses = await findAllAddresses(address, {status: {[Op.in]: [0, 1]}}, limit, offset);

  addresses = getPaginationData(addresses, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: addresses
  });
});
  
export const getAddressById = catchAsync(async (req, res, next) => {
    const id = req.query.id;
  
    const result = await findByCustomerId(address, id);
  
    if (!result) {
      return res.status(404).json({
        status: "fail",
        statusCode: 404,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
    });
});
  
export const createAddress = catchAsync(async (req, res, next) => {
    const [addressObj, created] = await findOrCreate(address, {
      ...req.body
    });
    if (!created) {
      return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: "Address already exist"
      });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Address created successfully",
      payload: _.omit(addressObj.toJSON(), ["updatedAt", "createdAt"])
    });
});
  
export const updateAddress = catchAsync(async (req, res, next) => {
    const id = req.query.id;

    const result = await update(address, {
      ...req.body,
      id
    });
  
    if (!result[0]) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Address didn't updated"
      });
    }
  
    const resultData = await findByPk(address, id);

    return res.status(201).json({
      status: "success",
      message: "Address updated successfully",
      statusCode: 200,
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
    });
});
  
export const changeStatusAddress = catchAsync(async (req, res, next) => {
    const id = req.query.id;
  
    const result = await update(address, {
      ...req.body,
      id
    });
  
    if (!result) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Address didn't updated"
      });
    }
  
    const addresses = await findAll(address);
  
    const results = _.map(addresses, addressObj => _.omit(addressObj, ['updatedAt', 'createdAt']));
  
  
    return res.status(201).json({
      status: "success",
      message: "Address status updated successfully",
      statusCode: 200,
      payload: results
    });
});
export const deleteAddressById = catchAsync(async (req, res, next) => {
    const id = req.query.id;
  
    const result = await deleteByPk(address, id);
  
    if (!result) {
      return res.status(404).json({
        status: "fail",
        statusCode: 404,
        message: "Address not found"
      });
    }
    const addresses = await findAll(address);
  
    const results = _.map(addresses, addressObj => _.omit(addressObj, ['updatedAt', 'createdAt']));
  
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Address deleted successfully",
      payload: results
    });
});