import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createOrder, findOrderDetails, updateById, findByPk, findAllExtra, deleteByPk, findAll, findAllWithType, findAllOrders, findAllOrderItem, findByVariantId } from "../../services/orderService.js";
import { updateLog, updateRiderById } from "../../services/riderService.js";

import { findById } from "../../services/voucherService.js";
import { v4 as uuidv4 } from 'uuid';
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { findByOrderItem } from "../../services/itemService.js";
import { Op } from 'sequelize';
const { findIngredientByPk } = require("../../services/ingredientService");

const { order, order_item, order_item_extra, item, item_variant, voucher, ingredient, rider, rider_log } = Model;



export const getOrdersWithType = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  const type = req.query.type;

  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.name) {
    andAttributes.push({name: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.name+"%"}, {[Op.like]: "%"+searchTerm.name.toLowerCase()+"%"}]
    }});
  }
  if (searchTerm.order_number) {
    andAttributes.push({order_number: searchTerm.order_number});
  }
  if (searchTerm.email) {
    andAttributes.push({email: searchTerm.email});
  }
  if (searchTerm.branch_id) {
    andAttributes.push({branch_id: searchTerm.branch_id});
  }
  if (searchTerm.branch_name) {
    andAttributes.push({branch_name: searchTerm.branch_name});
  }

  if (searchTerm.order_type) {
    andAttributes.push({order_type: searchTerm.order_type});
  }
  if (searchTerm.payment_status) {
    andAttributes.push({payment_status: searchTerm.payment_status});
  }
  if (type != 'all') {
    andAttributes.push({order_status: type});
  }
  if (searchTerm.order_status) {
    andAttributes.push({order_status: searchTerm.order_status});
  }

  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
console.log(where);
  
  let orderDetails = await findAllOrders(order, where, limit, offset);
  
  orderDetails = getPaginationData(orderDetails, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderDetails
  });
});
export const getOrderDetail = catchAsync(async (req, res, next) => {

  let orderDetails = await findOrderDetails(order, req.params.id);
  orderDetails.order_items = await findAllOrderItem(order_item, {order_id: orderDetails.id});

  for (let order_item = 0; order_item < orderDetails.order_items.length; order_item++) {
    let elementOrderItem = orderDetails.order_items[order_item];
    elementOrderItem.item = await findByOrderItem(item, {id: elementOrderItem.item_id});
    elementOrderItem.item_variant = await findByVariantId(item_variant, { id: elementOrderItem.item_variant_id });
    elementOrderItem.item_extra = await findAllExtra(order_item_extra, elementOrderItem.id);
    for (let ingredientIndex = 0; ingredientIndex < elementOrderItem.item_extra.length; ingredientIndex++) {
      let elementIngredient = elementOrderItem.item_extra[ingredientIndex];
      var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
      elementIngredient.name = ingredientObj.name;
    }
  }
  if (orderDetails.voucher_ids != null) {
    console.log(orderDetails.voucher_ids);
    for (let voucherIndex = 0; voucherIndex < orderDetails.voucher_ids.length; voucherIndex++) {
      let elementVoucher = orderDetails.voucher_ids[voucherIndex];
      let voucherObj = await findById(voucher, elementVoucher.voucher_id);
      orderDetails.voucher_ids[voucherIndex].voucher_id = voucherObj;
    }
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderDetails
  });
});

export const setCartToOrder = catchAsync(async (req, res, next) => {
  req.body.order_number = uuidv4();


  const orderObj = await createOrder(order, {
      ...req.body
  });
  
  if (!_.isEmpty(orderObj)) {
      req.body.items.forEach(async element => {
        let payload = {
          order_id : orderObj.id,
          item_id : element.id,
          quantity : element.quantity,
          price : element.price
        };
        const orderItemObj = await createOrder(order_item, {
            ...payload
        });
        if (!_.isEmpty(orderItemObj)) {
          element.items_extra.forEach(async items_extra => {
            let payloadExtra = {
              order_item_id : orderItemObj.id,
              ingredient_id : items_extra.ingredient_id,
              quantity : items_extra.quantity,
              price : items_extra.price
            };
            const orderItemExtra = await createOrder(order_item_extra, {
                ...payloadExtra
            });
          });
        }
      });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderObj
  });
});

export const updateCart = catchAsync(async (req, res, next) => {
  let payload = {
    quantity: req.body.quantity,
    price: req.body.price
  }
  console.log(payload);
  const result = await updateById(order_item, payload, req.params.id);
  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Order Item didn't updated"
    });
  }
  const orderItemObj = await findByPk(order_item, payload.id);
  const orderItemExtraObjs = await findAllExtra(order_item_extra, orderItemObj.id);
  orderItemExtraObjs.forEach(async element => {
    let extraPayload = {
      quantity: req.body.quantity,
      price: req.body.quantity * element.price
    };
    const result = await updateById(order_item_extra, extraPayload, element.id);
  });

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderItemObj
  });
});

export const deleteOrderItemById = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const orderItemObj = await findByPk(order_item, req.params.id);
  const orderItemExtraObjs = await findAllExtra(order_item_extra, orderItemObj.id);
  if (!_.isEmpty(orderItemExtraObjs)) {
    orderItemExtraObjs.forEach(async element => {
      const result = await deleteByPk(order_item_extra, element.id);
    });
  }
  const result = await deleteByPk(order_item, order_item.id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Order Item not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(orderItemObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const changeStatusOrder = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await updateById(order, {...req.body}, id);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Order didn't updated"
    });
  }

  const orders = await findAll(order);

  const results = _.map(orders, orderObj => _.omit(orderObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Order updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const setDeliveryManOrder = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  let orderDetails = await findOrderDetails(order, id);
  let result = {};

  if (req.body.order_type == 'delivery' && orderDetails.order_status == 'readytopickup'  && orderDetails.rider_id == null) {
    let payload = {
      rider_id: req.body.rider_id,
    }
    result = await updateById(order, {...payload}, id);
  }else if(req.body.order_type == 'delivery' && orderDetails.order_status == 'handovertorider'){
    let payload = {
      order_status: 'delivered'
    }
    result = await updateById(order, {...payload}, id);
  }else if(req.body.order_type == 'pickup'){
    let payload = {
      order_status: 'delivered'
    }
    result = await updateById(order, {...payload}, id);
  }
  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Order didn't updated"
    });
  }

  if (req.body.order_type == 'delivery' && orderDetails.order_status == 'readytopickup'  && orderDetails.rider_id == null) {
    let riderPayload = {
      delivery_status: 'ongoing'
    }
    let riderLogPayload = {
      map_longitude: req.body.map_longitude,
      map_latitude: req.body.map_latitude,
    }
    console.log('data', riderLogPayload, riderPayload);
    const resultRider = await updateRiderById(rider, riderPayload, {id: req.body.rider_id});
    const resultRiderLog = await updateLog(rider_log, riderLogPayload, {rider_id: req.body.rider_id});
    if (!resultRider) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Rider didn't updated"
      });
    }
    if (!resultRiderLog) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Rider Log didn't updated"
      });
    }
  }else if(orderDetails.order_type == 'delivery' && orderDetails.order_status == 'handovertorider'){
  console.log('order',orderDetails);

    let riderPayload = {
      delivery_status: 'available'
    }
    const resultRider = await updateById(rider, {...riderPayload}, parseInt(orderDetails.rider_id));
    if (!resultRider) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Rider didn't updated"
      });
    }
  }
  const orders = await findAll(order);

  const results = _.map(orders, orderObj => _.omit(orderObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Order updated successfully",
    statusCode: 200,
    payload: results
  });
});
