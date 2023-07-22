import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { findOrCreate, findByCustomerId, findActiveByCustomerId, findAllByCustomer, findAll, findByPk, update, deleteByPk, findAllTypes,updateMultiple } from "../../services/addressService.js";
const { address, address_type } = Model;

export const getAllAddress = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    const addresses = await findAllByCustomer(address, {customer_id: id});
    if (addresses.length == 0) {

      return res.status(200).json({
        status: "fail",
        statusCode: 404,
        message: "Address not found"
      });
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: addresses
    });
});
export const getAllAddressType = catchAsync(async (req, res, next) => {
    const addressetypes = await findAllTypes(address_type);

    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: addressetypes
    });
});
  
export const getAddressById = catchAsync(async (req, res, next) => {
    const id = req.query.id;
  
    const result = await findByCustomerId(address, id);
  
    if (!result) {
      return res.status(200).json({
        status: "fail",
        statusCode: 404,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: result
    });
});
export const getActiveAddressById = catchAsync(async (req, res, next) => {
    const id = req.query.id;
  
    const result = await findActiveByCustomerId(address, {customer_id: id, status: 1});
  
    if (!result) {
      return res.status(200).json({
        status: "fail",
        statusCode: 404,
        message: "Address not found"
      });
    }

    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: result
    });
});

  
export const createAddress = catchAsync(async (req, res, next) => {
  req.body.customer_id = parseInt(req.body.customer_id);
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
  await updateMultiple(address, addressObj.id, addressObj.customer_id);
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Address created successfully",
    payload: _.omit(addressObj.toJSON(), ["updatedAt", "createdAt"])
  });
});
  
export const updateAddress = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    let payload = {
      address: req.body.address,
      map_longitude: req.body.map_longitude,
      map_latitude: req.body.map_latitude,
      appartment_no: req.body.appartment_no,
      note: req.body.note,
      extra_note: req.body.extra_note,
      address_type: req.body.address_type,
      address_type_note:req.body.address_type_note,
      customer_id:req.body.customer_id
    }
    console.log(payload);
    const result = await update(address, {...payload}, id);
  
    if (!result[0]) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Address didn't updated"
      });
    }
  
    const resultData = await findByPk(address, id);
    // await updateMultiple(address, addressObj.id, addressObj.customer_id);

    return res.status(201).json({
      status: "success",
      message: "Address updated successfully",
      statusCode: 200,
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
    });
});
  
export const changeStatusAddress = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    let payload = {
      status: 1
    }
    const result = await update(address, {...payload}, id);
  
    if (!result) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Address didn't updated"
      });
    }
    const addressObj = await findByPk(address, id);
    await updateMultiple(address, addressObj.id, addressObj.customer_id);

    // const addresses = await findAll(address);
  
    // const results = _.map(addresses, addressObj => _.omit(addressObj, ['updatedAt', 'createdAt']));
  
  
    return res.status(201).json({
      status: "success",
      message: "Address status updated successfully",
      statusCode: 200,
      payload: addressObj
    });
});
export const deleteAddressById = catchAsync(async (req, res, next) => {
    const id = req.query.id;
  
    const result = await deleteByPk(address, id);
  
    if (!result) {
      return res.status(200).json({
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