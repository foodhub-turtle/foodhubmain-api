import _ from "lodash";
import Model from "../../models/index.js";
const commonService = require("../../services/commonService");
import {
  Op, Sequelize
} from 'sequelize';
const fs = require("fs");
import catchAsync from "../../libs/catchAsync.js";
import moment from 'moment';
import { objIsNotEmpty } from "../../libs/commomLibs.js";

const {
  rider,
  order,
  rider_log,
  rider_taken_shift,
  rider_shift,
  work_time,
  rider_active_shift,
  area,
  rider_shift_week
} = Model;

export const getRiderProfile = catchAsync(async (req, res, next) => {
  let id = req.query.id;
  const riderObj = await commonService.findWithModelAndFilter(rider, {
    id: id
  });
  if (!riderObj) {
    return res.status(404).json({
      status: "failed",
      message: "Rider not found",
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
  const riderObj = await commonService.findWithModelAndFilter(rider, {
    id: id
  });
  if (riderObj) {
    if (riderObj.delivery_status == 'ongoing') {
      const orderObj = await commonService.findWithModelAndFilter(order, {
        rider_id: id
      });
      riderObj.order = orderObj;
    }
  } else {
    return res.status(404).json({
      status: "failed",
      message: "Rider not found",
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

  let shiftObj = await commonService.findWithModelAndFilter(rider_shift, {
    id: riderShiftId
  });

  const payload = {
    rider_id: riderId,
    rider_shift_id: shiftObj.id,
    isSwape: 0,
    status: 1,
    shiftdate: shiftObj.shiftdate,
    rider_work_time_id: shiftObj.rider_work_time_id
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
    payload: payload
  });
});

export const getOngoingShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  let todayActiveShift = await commonService.findWithModelAndFilter(rider_active_shift, {
    rider_id: riderId,
    isActive: 1
  });

  if (!todayActiveShift) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no active shift"
    });
  }

  let riderObj = await commonService.findWithModelAndFilter(rider, {
    id: riderId
  });
  let riderTakenShift = await commonService.findWithModelAndFilter(rider_taken_shift, {
    id: todayActiveShift.rider_taken_shift_id
  });
  let riderShift = await commonService.findWithModelAndFilter(rider_shift, {
    id: riderTakenShift.rider_shift_id
  });
  let workTime = await commonService.findWithModelAndFilter(work_time, {
    id: riderShift.rider_work_time_id
  });
  let areaObj = await commonService.findWithModelAndFilter(area, {
    id: riderShift.area_id
  });
  let time = moment();
  let beforeTime = moment(workTime.start_time, 'HH:mm:ss');
  let afterTime = moment(workTime.end_time, 'HH:mm:ss');
  if (!time.isBetween(beforeTime, afterTime)) {
    let updateActiveShift = await commonService.updateModelAndFilter(rider_active_shift, {isActive: 0}, {id: todayActiveShift.id});
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Rider has no active shift",
      payload: {}
    });
  }

  todayActiveShift.rider = _.omit(riderObj, ["updatedAt", "createdAt"]);
  todayActiveShift.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
  todayActiveShift.area = _.omit(areaObj, ["updatedAt", "createdAt"]);


  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider active shift",
    payload: todayActiveShift
  });
});

export const getAllShift = catchAsync(async (req, res, next) => {
  let selectedDate = new Date(req.query.date);
  let allShifts = await commonService.findAllWithModelAndFilter(rider_shift, {
    shiftdate: selectedDate
  });

  if (allShifts.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "No available shifts",
      payload: []
    });
  }
  for (let index = 0; index < allShifts.length; index++) {
    const shiftObj = allShifts[index];
    let workTime = await commonService.findWithModelAndFilter(work_time, {
      id: shiftObj.rider_work_time_id
    });
    let areaObj = await commonService.findWithModelAndFilter(area, {
      id: shiftObj.area_id
    });
    let riderTakenShift = await commonService.findWithModelAndFilter(rider_taken_shift, {
      rider_shift_id: shiftObj.id
    });
    shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
    shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
    shiftObj.isTaken = objIsNotEmpty(riderTakenShift) ? 1 : 0;
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "All shifts",
    payload: allShifts
  });

});
export const getUpcomingShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;
  // Get the current time and the time 20 minutes from now using moment

  const twentyMinutesFromNow = moment().add(120, 'minutes').tz("Asia/Dhaka");
  let today = new Date();
  // Convert moment time values to strings in "HH:mm:ss" format

  const twentyMinutesFromNowString = twentyMinutesFromNow.format('HH:mm');

  let workTime = await commonService.findWithModelAndFilter(work_time, {
    start_time: {
      [Op.lte]: twentyMinutesFromNowString
    },
    end_time: {
      [Op.gte]: twentyMinutesFromNowString
    }
  });
  if (!objIsNotEmpty(workTime)) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no upcoming shifts"
    });
  }
  // const currentTime = new moment().utc(process.env.TIMEZONE);
  // const twentyMinutesFromNow = new moment().utc(process.env.TIMEZONE).add(20, 'minutes');
  // console.log(new moment(), new Date(), currentTime, twentyMinutesFromNow);
  // let workTime = await commonService.findAllWithModelAndFilter(work_time, {
  //   start_time: {
  //     [Op.lte]: currentTime.toDate()
  //   },
  //   end_time: {
  //     [Op.gte]: twentyMinutesFromNow.toDate()
  //   },
  // });
  // console.log(twentyMinutesFromNowString, workTime, today );
  let todayUpcomingShifts = await commonService.findWithModelAndFilter(rider_taken_shift, {
    rider_id: riderId,
    isActive: 1,
    rider_work_time_id: workTime.id,
    shiftdate: today
  });

  if (!objIsNotEmpty(todayUpcomingShifts)) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no upcoming shifts"
    });
  }


  let riderShift = await commonService.findWithModelAndFilter(rider_shift, {
    id: todayUpcomingShifts.rider_shift_id
  });
  let workTimeObj = await commonService.findWithModelAndFilter(work_time, {
    id: riderShift.rider_work_time_id
  });
  let areaObj = await commonService.findWithModelAndFilter(area, {
    id: riderShift.area_id
  });

  todayUpcomingShifts.workTime = _.omit(workTimeObj, ["updatedAt", "createdAt"]);
  todayUpcomingShifts.area = _.omit(areaObj, ["updatedAt", "createdAt"]);



  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Todays rider upcoming shifts",
    payload: todayUpcomingShifts
  });

});

export const getAbsentShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  let totalAbsentShifts = await commonService.findAllWithModelAndFilter(rider_taken_shift, {
    rider_id: riderId,
    isActive: 0
  });

  if (totalAbsentShifts.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider has no absent shifts"
    });
  }
  for (let index = 0; index < totalAbsentShifts.length; index++) {
    const shiftObj = totalAbsentShifts[index];
    let riderObj = await commonService.findWithModelAndFilter(rider, {
      id: riderId
    });
    let riderTakenShift = await commonService.findWithModelAndFilter(rider_taken_shift, {
      id: shiftObj.rider_shift_id
    });
    let riderShift = await commonService.findWithModelAndFilter(rider_shift, {
      id: riderTakenShift.rider_shift_id
    });
    let workTime = await commonService.findWithModelAndFilter(work_time, {
      id: riderShift.rider_work_time_id
    });
    let areaObj = await commonService.findWithModelAndFilter(area, {
      id: riderShift.area_id
    });

    shiftObj.rider = _.omit(riderObj, ["updatedAt", "createdAt"]);
    shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
    shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider absent shifts",
    payload: totalAbsentShifts
  });

});
export const activeOngoingShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;
  const riderShiftId = req.query.shift_id;

  let riderShiftObj = await commonService.findWithModelAndFilter(rider_taken_shift, {
    rider_id: riderId,
    rider_shift_id: riderShiftId
  });
  if (!objIsNotEmpty(riderShiftObj)) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider shift is not found"
    });
  }
  let shiftObj = await commonService.findWithModelAndFilter(rider_shift, {
    id: riderShiftObj.rider_shift_id
  });
  let workTimeObj = await commonService.findWithModelAndFilter(work_time, {
    id: shiftObj.rider_work_time_id
  });
  const payload = {
    rider_id: riderId,
    rider_taken_shift_id: riderShiftObj.id,
    time: workTimeObj.total_time,
    vehicle_type: req.body.vehicle_type,
    bag_type: req.body.bag_type,
    temperature: req.body.temperature,
    isTimeExtend: req.body.isTimeExtend,
    isActive: 1,
    rider_work_time_id: workTimeObj.id
  }

  const result = await commonService.create(rider_active_shift, payload);

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider shift is not activated successfully"
    });
  }

  let updateTakenShift = await commonService.updateModelAndFilter(rider_taken_shift, {
    status: 0,
    isActive: 0
  }, {
    id: riderShiftObj.id
  });
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider shift started successfully",
  });
});
export const deactiveOngoingShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;
  const riderShiftId = req.query.shift_id;

  const payload = {
    isActive: 0
  }

  const result = await commonService.updateModelAndFilter(rider_active_shift, payload, {
    rider_id: riderId,
    rider_taken_shift_id: riderShiftId
  });

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
  let selectedDate = new Date(req.query.date);

  const orders = await commonService.findAllWithModelAndFilter(order, {
    rider_id: riderId,
    order_status: 'delivered',
    order_datetime: Sequelize.where(
      Sequelize.fn('date_trunc', 'day', Sequelize.col('order_datetime')),
      selectedDate
    )
  });
  if (orders.length == 0) {
    return res.status(404).json({
      status: "failed",
      message: "No orders available",
      statusCode: 404,
      payload: {}
    });
  }
  let totalAmount = orders.map(item => item.grand_total).reduce((prev, next) => prev + next);
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: {orders: orders, deliver_count: orders.length, total: totalAmount}
  });
});

export const getShiftNotTaken = catchAsync(async (req, res, next) => {
  let riderId = req.query.id;
  let today = new Date();

  let todayUpcomingShifts = await commonService.findAllWithModelAndFilter(rider_taken_shift, {
    rider_id: riderId,
    shiftdate: today
  });

  let allShiftIds = todayUpcomingShifts.map(s => s.rider_shift_id);

  let notTakenShifts = await commonService.findAllWithModelAndFilter(rider_shift, {
    [Op.not]: {
      id: {
        [Op.in]: allShiftIds
      },
    },
    shiftdate: today
  })

  if (notTakenShifts.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "No available shifts",
      payload: []
    });
  }
  for (let index = 0; index < notTakenShifts.length; index++) {
    const shiftObj = notTakenShifts[index];
    let workTime = await commonService.findWithModelAndFilter(work_time, {
      id: shiftObj.rider_work_time_id
    });
    let areaObj = await commonService.findWithModelAndFilter(area, {
      id: shiftObj.area_id
    });

    shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
    shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: notTakenShifts
  });
});

const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export const getRiderShift = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;
  let today = new Date();
  let workingWeek = await commonService.findWithModelAndFilter(rider_shift_week, {
    start_date: {
      [Op.lte]: today
    },
    end_date: {
      [Op.gte]: today
    },
  });
  let takenList = [];
  let dateList = getDatesBetween(workingWeek.start_date, workingWeek.end_date);
  for (let index = 0; index < dateList.length; index++) {
    const element = dateList[index];
    let takenShifts = await commonService.findAllWithModelAndFilter(rider_taken_shift, {
      rider_id: riderId,
      shiftdate: element
    });
    if (takenShifts.length > 0) {
      for (let index = 0; index < takenShifts.length; index++) {
        let shiftObj = takenShifts[index];
        let riderShift = await commonService.findWithModelAndFilter(rider_shift, {
          id: shiftObj.rider_shift_id
        });
        let workTime = await commonService.findWithModelAndFilter(work_time, {
          id: riderShift.rider_work_time_id
        });
        let areaObj = await commonService.findWithModelAndFilter(area, {
          id: riderShift.area_id
        });

        shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
        shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
      }

    }

    let todayUpcomingShifts = {
      date: element,
      data: takenShifts
    }
    console.log(todayUpcomingShifts);

    takenList.push(todayUpcomingShifts);
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: takenList
  });
});
export const getRiderShiftHistory = catchAsync(async (req, res, next) => {
  const riderId = req.query.id;

  let allTakenShiftHistories = await commonService.findAllWithModelAndFilter(rider_taken_shift, {
    rider_id: riderId,
    status: 0
  });
  if (allTakenShiftHistories.length == 0) {
    return res.status(404).json({
      status: "failed",
      statusCode: 404,
      message: "No shift history found",
    });
  }
  if (allTakenShiftHistories.length > 0) {
    for (let index = 0; index < allTakenShiftHistories.length; index++) {
      let shiftObj = allTakenShiftHistories[index];
      let riderShift = await commonService.findWithModelAndFilter(rider_shift, {
        id: shiftObj.rider_shift_id
      });
      let workTime = await commonService.findWithModelAndFilter(work_time, {
        id: riderShift.rider_work_time_id
      });
      let areaObj = await commonService.findWithModelAndFilter(area, {
        id: riderShift.area_id
      });

      shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
      shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
    }

  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: allTakenShiftHistories
  });
});