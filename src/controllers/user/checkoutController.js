import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createOrder } from "../../services/orderService.js";
import { v4 as uuidv4 } from 'uuid';

const { order } = Model;

export const setCartToOrder = catchAsync(async (req, res, next) => {
    req.body.order_number = uuidv4();
    const orderObj = await createOrder(order, {
        ...req.body
    });
    
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: _.omit(orderObj.toJSON(), ["updatedAt", "createdAt"])
    });
  });
