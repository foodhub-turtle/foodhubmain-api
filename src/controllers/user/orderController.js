import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createOrder, findOrderDetails, findAllOrderItem,findAllByCustomerId, updateById, findByPk, findAllExtra, deleteByPk, findAllActivePast, findByVariantId, findByCustomerId } from "../../services/orderService.js";
import { findById } from "../../services/voucherService.js";
const { findIngredientByPk } = require("../../services/ingredientService");
import { findByBranch } from "../../services/branchService.js";
import { findByOrderItem } from "../../services/itemService.js";
import { findOne } from "../../services/settingsService.js";
import { v4 as uuidv4 } from 'uuid';
import { orderNumberGenerator } from "../../libs/commomLibs";
import moment from 'moment';
const { order, order_item, order_item_extra, item, voucher, item_variant, branch, ingredient, setting, review, rider_log } = Model;
import { Op } from 'sequelize';
import { findByRider } from "../../services/riderService.js";
// const socketIO = require('socket.io')



export const setCartToOrder = catchAsync(async (req, res, next) => {
    req.body.order_number = orderNumberGenerator();
    console.log('full body', req.body);

    req.body.order_receivedtime = moment().format('hh:mm A');
    const branchObj = await findByBranch(branch, {id: req.body.branch_id});
    const settingObj = await findOne(setting);

    if (branchObj.auto_accept_order == 1) {
      req.body.order_status = 'confirmed';
    }
    const orderObj = await createOrder(order, {
        ...req.body
    });
    
    if (!_.isEmpty(orderObj)) {
      for (let itemIndex = 0; itemIndex < req.body.items.length; itemIndex++) {
        const element = req.body.items[itemIndex];
        
        let payload = {
          order_id : orderObj.id,
          item_id : element.pdt.id,
          quantity : element.quantity,
          price : element.price,
          item_variant_id: (element.selectVariation) ? element.selectVariation.id : null,
          item_variant_name: (element.selectVariation) ? element.selectVariation.name : null,
          is_product_available: (element.is_product_available) ? element.is_product_available : null,
        };
        const orderItemObj = await createOrder(order_item, {
            ...payload
        });
        if (!_.isEmpty(element)) {
          console.log('choiceGroup',element.choiceGroup, req.body);
          if (element.choiceGroup && element.choiceGroup.length > 0) {
            for (let indexGroup = 0; indexGroup < element.choiceGroup.length; indexGroup++) {
              const elementGroup = element.choiceGroup[indexGroup];
              let payloadExtra = {
                order_item_id : orderItemObj.id,
                ingredient_id : elementGroup.ingredient_id,
                quantity : element.quantity,
                price : elementGroup.ingredient_price
              };
              const orderItemExtra = await createOrder(order_item_extra, {
                  ...payloadExtra
              });
            }
          }
        }
      }
    }

    let orderDetails = await findOrderDetails(order, orderObj.id);
    orderDetails.order_items = await findAllOrderItem(order_item, {order_id: orderDetails.id});

    for (let order_item = 0; order_item < orderDetails.order_items.length; order_item++) {
      const elementOrderItem = orderDetails.order_items[order_item];
      elementOrderItem.item = await findByOrderItem(item, {id: elementOrderItem.item_id});
      elementOrderItem.item_variant = await findByVariantId(item_variant, { id: elementOrderItem.item_variant_id });
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
    const elementOrderItem = orderDetails.order_items[order_item];
    elementOrderItem.item = await findByOrderItem(item, {id: elementOrderItem.item_id});
    elementOrderItem.item_variant = await findByVariantId(item_variant, { id: elementOrderItem.item_variant_id });
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
    let riderLog = await findByRider(rider_log, {rider_id: orderDetails.rider_id});
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

export const getOrdersActive = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  let orderDetails = {};

  // orderDetails.active = await findAllActivePast(order, {order_status: 'pending', customer_id: id});
  // orderDetails.past = await findAllActivePast(order, {order_status: 'delivered', customer_id: id});
  let activeOrders = await findAllActivePast(order, {order_status: {[Op.in]: ['pending', 'confirmed', 'preparing', 'prepared', 'readytopickup']}, customer_id: id});
  let pastOrders = await findAllActivePast(order, {order_status: {[Op.in]: ['rejected', 'delivered']}, customer_id: id});

  for (let index = 0; index < activeOrders.length; index++) {
    const element = activeOrders[index];
    element.order_items = await findAllOrderItem(order_item, {order_id: element.id});

    for (let order_item = 0; order_item < element.order_items.length; order_item++) {
      const elementOrderItem = element.order_items[order_item];
      elementOrderItem.item = await findByOrderItem(item, {id: elementOrderItem.item_id});
      elementOrderItem.item_variant = await findByVariantId(item_variant, { id: elementOrderItem.item_variant_id });
      elementOrderItem.item_extra = await findAllExtra(order_item_extra, elementOrderItem.id);
      for (let ingredientIndex = 0; ingredientIndex < elementOrderItem.item_extra.length; ingredientIndex++) {
        const elementIngredient = elementOrderItem.item_extra[ingredientIndex];
        var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
        elementIngredient.name = ingredientObj.name;
      }
    }
    if (element.voucher_ids != null) {
      console.log(element.voucher_ids);
      for (let voucherIndex = 0; voucherIndex < element.voucher_ids.length; voucherIndex++) {
        const elementVoucher = element.voucher_ids[voucherIndex];
        let voucherObj = await findById(voucher, elementVoucher.voucher_id);
        element.voucher_ids[voucherIndex].voucher_id = voucherObj;
      }
    }
  }
  for (let index = 0; index < pastOrders.length; index++) {
    const elementPast = pastOrders[index];
    elementPast.order_items = await findAllOrderItem(order_item, {order_id: elementPast.id});
    for (let order_item = 0; order_item < elementPast.order_items.length; order_item++) {
      const elementPostOrderItem = elementPast.order_items[order_item];
      elementPostOrderItem.item = await findByOrderItem(item, {id: elementPostOrderItem.item_id});
      elementPostOrderItem.item_variant = await findByVariantId(item_variant, { id: elementPostOrderItem.item_variant_id });
      elementPostOrderItem.item_extra = await findAllExtra(order_item_extra, elementPostOrderItem.id);
      for (let ingredientIndex = 0; ingredientIndex < elementPostOrderItem.item_extra.length; ingredientIndex++) {
        const elementIngredient = elementPostOrderItem.item_extra[ingredientIndex];
        var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
        elementIngredient.name = ingredientObj.name;
      }
    }

    if (elementPast.voucher_ids != null) {
      for (let voucherIndex = 0; voucherIndex < elementPast.voucher_ids.length; voucherIndex++) {
        const elementPastVoucher = elementPast.voucher_ids[voucherIndex];
        let voucherObj = await findById(voucher, elementPastVoucher.voucher_id);
        elementPast.voucher_ids[voucherIndex].voucher_id = voucherObj;
      }
    }
  }
  orderDetails.active = activeOrders;
  orderDetails.past = pastOrders;
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderDetails
  });
});
export const getActiveOrdersOnly = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  let orderDetails = {};

  let activeOrders = await findAllActivePast(order, {order_status: {[Op.in]: ['pending', 'confirmed', 'preparing', 'prepared', 'readytopickup']}, customer_id: id});

  for (let index = 0; index < activeOrders.length; index++) {
    const element = activeOrders[index];
    element.order_items = await findAllOrderItem(order_item, {order_id: element.id});

    for (let order_item = 0; order_item < element.order_items.length; order_item++) {
      const elementOrderItem = element.order_items[order_item];
      elementOrderItem.item = await findByOrderItem(item, {id: elementOrderItem.item_id});
      elementOrderItem.item_variant = await findByVariantId(item_variant, { id: elementOrderItem.item_variant_id });
      elementOrderItem.item_extra = await findAllExtra(order_item_extra, elementOrderItem.id);
      for (let ingredientIndex = 0; ingredientIndex < elementOrderItem.item_extra.length; ingredientIndex++) {
        const elementIngredient = elementOrderItem.item_extra[ingredientIndex];
        var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
        elementIngredient.name = ingredientObj.name;
      }
    }
    if (element.voucher_ids != null) {
      console.log(element.voucher_ids);
      for (let voucherIndex = 0; voucherIndex < element.voucher_ids.length; voucherIndex++) {
        const elementVoucher = element.voucher_ids[voucherIndex];
        let voucherObj = await findById(voucher, elementVoucher.voucher_id);
        element.voucher_ids[voucherIndex].voucher_id = voucherObj;
      }
    }
  }

  orderDetails.active = activeOrders;

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderDetails
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
export const checkUnreviewedOrder = catchAsync(async (req, res, next) => {
  let customer_id = req.params.id;
  let order_id = req.params.order;

  let orderObj = await findByCustomerId(order, {customer_id: customer_id, id: order_id, order_status: 'delivered', is_reviewed: 0});
  if (orderObj == null) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "No order to review"
    });
  }

  let branchObj = await findByBranch(branch, {id: orderObj.branch_id});

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: {
      customer_id: orderObj.customer_id,
      rider_id: orderObj.rider_id,
      branch_id: branchObj.id,
      order_id: orderObj.id,
      branch_name: branch.name,
      options: ['Taste', 'Portion size', 'Packaging', 'Ingredients', 'Value for money', 'Special requests', 'Menu information', 'Order was complete']
    }
  });
});
export const getAllUnreviewedOrder = catchAsync(async (req, res, next) => {
  let customer_id = req.query.id;

  let orderObjs = await findAllByCustomerId(order, {customer_id: customer_id, order_status: 'delivered', is_reviewed: 0});
  if (orderObjs == null) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "No order to review"
    });
  }
  for (let index = 0; index < orderObjs.length; index++) {
    const element = orderObjs[index];
    let branchObj = await findByBranch(branch, {id: element.branch_id});
    orderObjs[index].branch = branchObj;
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: {
      orders: orderObjs
    }
  });
});

