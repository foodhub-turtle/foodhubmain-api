import _ from "lodash";
import Model from "../../models/index.js";
const commonService = require("../../services/commonService");
import { Op } from 'sequelize';
const fs = require("fs");
import catchAsync from "../../libs/catchAsync.js";

const { rider, order, rider_log, rider_taken_shift, rider_shift, work_time, rider_active_shift, area } = Model;

export const getRiderProfile = catchAsync(async (req, res, next) => {
    let id = req.query.id;
    const riderObj = await commonService.findWithModelAndFilter(rider, {id: id});
    if(!riderObj) {
      return res.status(404).json({
        status: "failed",
        message: "Rider not found" ,
        statusCode: 404
      });
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: riderObj
    });
});

export const getActiveRiderOrder = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const riderObj = await commonService.findWithModelAndFilter(rider, {id: id});
  if (riderObj) {
    if (riderObj.delivery_status == 'ongoing') {
      const orderObj = await commonService.findWithModelAndFilter(order, {rider_id: id});
      riderObj.order = orderObj;
    }
  } else {
    return res.status(404).json({
      status: "failed",
      message: "Rider not found" ,
      statusCode: 404
    });
  }

  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: riderObj
  });
});

export const setRiderShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;
  const riderShiftId = req.query.shift_id;

  let shiftObj = await commonService.findWithModelAndFilter(rider_shift, {id: riderShiftId});

  const payload  = {
    rider_id: riderId,
    rider_shift_id: shiftObj.id,
    isSwape: 0,
    status: 1
  }

  const result = await commonService.create(rider_taken_shift, payload);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider shift not taken"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider shift taken successfully",
    data: payload
  });
});

export const getOngoingShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  let todayActiveShift = await commonService.findWithModelAndFilter(rider_active_shift, {rider_id: riderId, isActive: 1});

  if (!todayActiveShift) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no active shift"
    });
  }

  let riderObj = await commonService.findWithModelAndFilter(rider, {id: riderId});
  let riderTakenShift = await commonService.findWithModelAndFilter(rider_taken_shift, {id: todayActiveShift.rider_taken_shift_id});
  let riderShift = await commonService.findWithModelAndFilter(rider_shift, {id: riderTakenShift.rider_shift_id});
  let workTime = await commonService.findWithModelAndFilter(work_time, {id: riderShift.rider_work_time_id});
  let areaObj = await commonService.findWithModelAndFilter(area, {id: riderShift.area_id});


  todayActiveShift.rider = _.omit(riderObj, ["updatedAt", "createdAt"]);
  todayActiveShift.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
  todayActiveShift.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
  

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider active shift",
    data: todayActiveShift
  });
});

export const getUpcomingShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  let todayUpcomingShifts = await commonService.findAllWithModelAndFilter(rider_taken_shift, {rider_id: riderId});

  if (todayUpcomingShifts.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no upcoming shifts"
    });
  }
  for (let index = 0; index < todayUpcomingShifts.length; index++) {
    const shiftObj = todayUpcomingShifts[index];
    let riderObj = await commonService.findWithModelAndFilter(rider, {id: riderId});
    let riderTakenShift = await commonService.findWithModelAndFilter(rider_taken_shift, {id: shiftObj.rider_shift_id});
    let riderShift = await commonService.findWithModelAndFilter(rider_shift, {id: riderTakenShift.rider_shift_id});
    let workTime = await commonService.findWithModelAndFilter(work_time, {id: riderShift.rider_work_time_id});
    let areaObj = await commonService.findWithModelAndFilter(area, {id: riderShift.area_id});

    shiftObj.rider = _.omit(riderObj, ["updatedAt", "createdAt"]);
    shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
    shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Todays rider upcoming shifts",
    data: todayUpcomingShifts
  });

});
export const getAbsentShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  let totalAbsentShifts = await commonService.findAllWithModelAndFilter(rider_taken_shift, {rider_id: riderId, isActive: 0});

  if (totalAbsentShifts.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no absent shifts"
    });
  }
  for (let index = 0; index < totalAbsentShifts.length; index++) {
    const shiftObj = totalAbsentShifts[index];
    let riderObj = await commonService.findWithModelAndFilter(rider, {id: riderId});
    let riderTakenShift = await commonService.findWithModelAndFilter(rider_taken_shift, {id: shiftObj.rider_shift_id});
    let riderShift = await commonService.findWithModelAndFilter(rider_shift, {id: riderTakenShift.rider_shift_id});
    let workTime = await commonService.findWithModelAndFilter(work_time, {id: riderShift.rider_work_time_id});
    let areaObj = await commonService.findWithModelAndFilter(area, {id: riderShift.area_id});

    shiftObj.rider = _.omit(riderObj, ["updatedAt", "createdAt"]);
    shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
    shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider absent shifts",
    data: totalAbsentShifts
  });

});
export const activeOngoingShift = catchAsync(async (req, res, next) => {
    const riderId = req.query.id;
    const riderShiftId = req.query.shift_id;

    let riderShiftObj = await commonService.findWithModelAndFilter(rider_taken_shift, {rider_id: riderId, rider_shift_id: riderShiftId});
    let shiftObj = await commonService.findWithModelAndFilter(rider_shift, {id: riderShiftObj.rider_shift_id});
    let workTimeObj = await commonService.findWithModelAndFilter(work_time, {id: shiftObj.rider_work_time_id});

    const payload  = {
      rider_id: riderId,
      rider_taken_shift_id: riderShiftObj.rider_shift_id,
      time: workTimeObj.total_time,
      vehicle_type: req.body.vehicle_type,
      bag_type: req.body.bag_type,
      temperature: req.body.temperature,
      isTimeExtend: req.body.isTimeExtend,
      isActive: 1
    }

    const result = await commonService.create(rider_active_shift, payload);

    if (!result) {
      return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: "Rider not activated successfully"
      });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Rider shift started successfully",
    });
});
export const deactiveOngoingShift = catchAsync(async (req, res, next) => {
    const riderId = req.query.id;
    const riderShiftId = req.query.shift_id;

    const payload  = {
      isActive: 0
    }

    const result = await commonService.updateModelAndFilter(rider_active_shift, payload, {rider_id: riderId, rider_taken_shift_id: riderShiftId});

    if (!result) {
      return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: "Rider not ended successfully"
      });
    }

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Rider shift ended successfully",
    });
});
export const getAllDeliveries = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  const orders = await commonService.findAllWithModelAndFilter(order, {rider_id: riderId});
  if (orders.length == 0) {
    return res.status(404).json({
      status: "failed",
      message: "No orders available" ,
      statusCode: 404
    });
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    data: orders
  });
});

export const acceptOrder = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;
  const orderId = req.query.order_id;
  let orderDetails = await commonService.findWithModelAndFilter(order, {id: orderId});
  let result = {};

  if (orderDetails.order_type == 'delivery' && orderDetails.order_status == 'readytopickup'  && orderDetails.rider_id == null) {
    let payload = {
      rider_id: riderId,
    }
    result = await commonService.updateModelAndFilter(order, payload, {id: orderId});
  }else if(orderDetails.order_type == 'delivery' && orderDetails.order_status == 'handovertorider'){
    let payload = {
      order_status: 'delivered'
    }
    result = await commonService.updateModelAndFilter(order, payload, {id: orderId});
  }else if(orderDetails.order_type == 'pickup'){
    let payload = {
      order_status: 'delivered'
    }
    result = await commonService.updateModelAndFilter(order, payload, {id: orderId});
  }
  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Order didn't updated"
    });
  }

  if (orderDetails.order_type == 'delivery' && orderDetails.order_status == 'readytopickup'  && orderDetails.rider_id == null) {
    console.log('order log', riderId, orderId);
    let riderPayload = {
      delivery_status: 'ongoing'
    }
    let riderLogPayload = {
      map_longitude: req.body.map_longitude,
      map_latitude: req.body.map_latitude,
    }

    const resultRider = await commonService.updateModelAndFilter(rider, riderPayload, {id: riderId});
    const resultRiderLog = await commonService.updateModelAndFilter(rider_log, riderLogPayload, {rider_id: riderId});
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
      data: orderDetails
    });
  }else if(orderDetails.order_type == 'delivery' && orderDetails.order_status == 'handovertorider'){
  console.log('order',orderDetails);

    let riderPayload = {
      delivery_status: 'available'
    }
    const resultRider = await commonService.updateModelAndFilter(rider, riderPayload, {rider_id: riderId});
    if (!resultRider) {
      return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Rider didn't updated"
      });
    }
  }
});