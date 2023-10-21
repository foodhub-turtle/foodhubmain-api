import _ from "lodash";
import Model from "../../models/index.js";
const commonService = require("../../services/commonService");
import {
  Op
} from 'sequelize';
const fs = require("fs");
import catchAsync from "../../libs/catchAsync.js";
import moment from "moment/moment.js";
import { objIsNotEmpty } from "../../libs/commomLibs.js";
import { findAllExtra, findAllOrderItem, findByVariantId, findOrderDetails } from "../../services/orderService.js";
import { findByOrderItem } from "../../services/itemService.js";
import { findIngredientByPk } from "../../services/ingredientService.js";
import { findById } from "../../services/voucherService.js";
import { findByRider } from "../../services/riderService.js";

const {
  rider,
  rider_log,
  item,
  item_variant,
  order,
  order_item,
  order_item_extra,
  ingredient,
  voucher,
  rider_order_log
} = Model;

export const acceptOrder = catchAsync(async (req, res, next) => {
  const riderId = req.body.id;
  const orderId = req.body.order_id;
  const orderStatus = req.body.order_status;
  console.log(riderId, orderId, orderStatus);
  let orderDetails = await commonService.findWithModelAndFilter(order, {
    id: orderId
  });
  let result = {};

  if (orderDetails.order_type == 'delivery' && orderDetails.order_status == 'readytopickup' && orderDetails.rider_id == null) {
    let payload = {
      rider_id: riderId,
      order_status: orderStatus
    }
    result = await commonService.updateModelAndFilter(order, payload, {
      id: orderId
    });
  } else if (orderDetails.order_type == 'delivery' && orderDetails.order_status == 'handovertorider') {
    let payload = {
      order_status: 'delivered'
    }
    result = await commonService.updateModelAndFilter(order, payload, {
      id: orderId
    });
  } else if (orderDetails.order_type == 'pickup') {
    let payload = {
      order_status: 'delivered'
    }
    result = await commonService.updateModelAndFilter(order, payload, {
      id: orderId
    });
  }
  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Order didn't updated"
    });
  }

  if (orderDetails.order_type == 'delivery' && orderDetails.order_status == 'readytopickup' && orderDetails.rider_id == null) {
    console.log('order log', riderId, orderId);
    let riderPayload = {
      delivery_status: 'ongoing'
    }
    let riderLogPayload = {
      map_longitude: req.body.map_longitude,
      map_latitude: req.body.map_latitude,
    }

    const resultRider = await commonService.updateModelAndFilter(rider, riderPayload, {
      id: riderId
    });
    const resultRiderLog = await commonService.updateModelAndFilter(rider_log, riderLogPayload, {
      rider_id: riderId
    });
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

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      payload: orderDetails
    });
  } else if (orderDetails.order_type == 'delivery' && orderDetails.order_status == 'handovertorider') {
    console.log('order', orderDetails);

    let riderPayload = {
      delivery_status: 'available'
    }
    const resultRider = await commonService.updateModelAndFilter(rider, riderPayload, {
      rider_id: riderId
    });
    if (!resultRider) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Rider didn't updated"
      });
    }
  }
});

export const orderStatusChange   = catchAsync(async (req, res, next) => {
  const orderId = req.body.order_id;
  const riderId = req.body.rider_id;
  const orderStatus = req.body.order_status;
  let updateOrder
  if (orderStatus == 'acceptedorder') {
    updateOrder = await commonService.updateModelAndFilter(order, {order_status: orderStatus, rider_id: riderId}, {id: orderId});
  } else {
    updateOrder = await commonService.updateModelAndFilter(order, {order_status: orderStatus}, {id: orderId, rider_id: riderId});
  }

  if (!updateOrder[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Order status not changed"
    });
  }
  let orderObj2 = await commonService.findWithModelAndFilter(order, {id: orderId});
  //SocketIO connection
  req.io.on('connection', function (socket) {
    let socketPayload = {
      orderId: orderObj2.id,
      customerId: orderObj2?.customer_id,
      branchId: orderObj2?.branch_id,
      orderStatus: orderObj2?.order_status,
      room: orderObj2?.order_number,
      socketId: socket.id
    }
    socket.emit('onStatusEvent', socketPayload);
  });
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Order status changed",
    payload: orderObj2
  });
});

export const getOrderDetail = catchAsync(async (req, res, next) => {

  let orderDetails = await findOrderDetails(order, req.params.id);
  orderDetails.order_items = await findAllOrderItem(order_item, {
    order_id: orderDetails.id
  });

  for (let order_item = 0; order_item < orderDetails.order_items.length; order_item++) {
    const elementOrderItem = orderDetails.order_items[order_item];
    elementOrderItem.item = await findByOrderItem(item, {
      id: elementOrderItem.item_id
    });
    elementOrderItem.item_variant = await findByVariantId(item_variant, {
      id: elementOrderItem.item_variant_id
    });
    elementOrderItem.item_extra = await findAllExtra(order_item_extra, elementOrderItem.id);
    for (let ingredientIndex = 0; ingredientIndex < elementOrderItem.item_extra.length; ingredientIndex++) {
      const elementIngredient = elementOrderItem.item_extra[ingredientIndex];
      var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
      elementIngredient.name = ingredientObj.name;
    }

  }
  if (orderDetails.voucher_ids != null) {
    console.log(orderDetails.voucher_ids);
    for (let voucherIndex = 0; voucherIndex < orderDetails.voucher_ids.length; voucherIndex++) {
      const elementVoucher = orderDetails.voucher_ids[voucherIndex];
      let voucherObj = await findById(voucher, elementVoucher.voucher_id);
      orderDetails.voucher_ids[voucherIndex].voucher_id = voucherObj;
    }
  }
  if (orderDetails.rider_id != null) {
    let riderLog = await findByRider(rider_log, {
      rider_id: orderDetails.rider_id
    });
    orderDetails.rider.rider_log = riderLog;
  }
  // socketIO.on('connection', function (socket) {
  //   socket.on('connected', function (orderId) { 
  //     users[orderId] = socket.id;
  //     console.log(orderId);
  //   });
  //   socket.to(431).emit('onStatusChange', 1);
  // });

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: orderDetails
  });
});