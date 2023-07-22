import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createOrder, findOrderDetails,findAllOrderItem, updateById, findByPk, findAllExtra, deleteByPk, findAll, findAllWithType, findByVariantId } from "../../services/orderService.js";
import { v4 as uuidv4 } from 'uuid';
import { findById } from "../../services/voucherService.js";
import { findByBranch } from "../../services/branchService.js";
import moment from 'moment';
import { findByOrderItem } from "../../services/itemService.js";
const { findIngredientByPk } = require("../../services/ingredientService");
import { Op } from 'sequelize';
// const socketIO = require('socket.io');

const { order, order_item, branch,order_item_extra, address, item, voucher, item_variant, ingredient } = Model;

export const getOrdersWithType = catchAsync(async (req, res, next) => {
  const type = req.query.type;
  const branch_id = req.query.branch_id;
  console.log(type);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  let branchObj = await findByBranch(branch, {id: branch_id})

  if (branchObj.parent_id != 0) {
    andAttributes.push({branch_id: branch_id});
  }
  if (type == 'all') {
    orAttributes.push({order_status: {[Op.in]: ['pending', 'confirmed', 'prepared', 'preparing', 'readytopickup', 'handovertorider', 'handovertocustomer', 'delivering', 'delivered', 'rejected']}});
  }else{
    andAttributes.push({order_status: type});
  }
  where = {
    [Op.and]: andAttributes
  };
  let orderDetails = await findAllWithType(order, where);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: orderDetails
  });
});
export const getOrderDetail = catchAsync(async (req, res, next) => {

  const orderDetails = await findOrderDetails(order, req.params.id);
  orderDetails.order_items = await findAllOrderItem(order_item, {order_id: orderDetails.id});

  for (let order_item = 0; order_item < orderDetails.order_items.length; order_item++) {
    const elementOrderItem = orderDetails.order_items[order_item];
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

  const orders = await findOrderDetails(order, id);

  //SocketIO connection
  // socketIO.on('connection', function (socket) {
  //     // socket.on('connected', function (orderId) { 
  //     //   users[orderId] = socket.id;
  //     //   console.log(orderId);
  //     // });
  //     socket.on('onStatusEvent', function (param) { 
  //       socket.to(431).emit('onStatusChange', 1);
  //     });
      
  //   });

  return res.status(201).json({
    status: "success",
    message: "Order updated successfully",
    statusCode: 200,
    payload: orders
  });
});

