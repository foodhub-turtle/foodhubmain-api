import _ from "lodash";
import Model from "../../models/index.js";
import {
  findAll,
  findOrCreate,
  findByPk,
  update,
  deleteByPk,
  findAllRiders,
  allActiveRiders,
  create,
  findByRider
} from "../../services/riderService.js";
import catchAsync from "../../libs/catchAsync.js";
import {
  getPagination,
  getPaginationData,
  objIsNotEmpty
} from "../../libs/commomLibs";
import {
  Op
} from 'sequelize';
import {
  hashPassword
} from "../../libs/passwordOp";
import {
  uploadImage
} from "../../libs/globalUpload";
import {
  findByRiderId
} from "../../services/orderService.js";
import moment from "moment/moment.js";
const commonService = require("../../services/commonService");

const {
  rider,
  user,
  rider_log,
  order,
  work_time,
  rider_shift,
  area,
  rider_shift_week
} = Model;

export const getAllRiders = catchAsync(async (req, res, next) => {
  const {
    limit,
    offset
  } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.name) {
    andAttributes.push({
      first_name: {
        [Op.or]: [{
          [Op.like]: "%" + searchTerm.name + "%"
        }, {
          [Op.like]: "%" + searchTerm.name.toLowerCase() + "%"
        }]
      }
    });
  }
  if (searchTerm.is_active) {
    andAttributes.push({
      is_active: searchTerm.is_active
    });
  }
  if (searchTerm.rider_uid) {
    andAttributes.push({
      rider_uid: searchTerm.rider_uid
    });
  }
  if (searchTerm.status) {
    andAttributes.push({
      status: parseInt(searchTerm.status)
    });
  } else {
    orAttributes.push({
      status: {
        [Op.in]: [0, 1]
      }
    });
  }
  orAttributes.push({
    createdAt: {
      [Op.not]: null
    }
  });

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let riders = await findAllRiders(rider, where, limit, offset);

  riders = getPaginationData(riders, req.query.page, limit);

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: riders
  });
});

export const getRiderById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(rider, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Rider not found"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createRider = catchAsync(async (req, res, next) => {
  let image = '';
  if (!_.isEmpty(req.file)) {
    image = await uploadImage(req);
  }
  const [riderObj, created] = await findOrCreate(rider, {
    ...req.body,
    image
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider already exist"
    });
  }
  req.body.password = '123456';
  req.body.password = await hashPassword(req.body.password);
  req.body.role = ['user', 'rider'];
  user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    })
    .then(async (result) => {
      let payloadRider = {
        user_id: result.id
      };
      let id = newBranch.id;
      const resultObj = await update(rider, {
        ...payloadRider,
        id
      });
      if (req.body.roles) {
        role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          result.setRoles(roles);
        });
      } else {
        // user role = 1
        result.setRoles([1]);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider created successfully",
    payload: _.omit(riderObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateRider = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req);
  }
  const result = await update(rider, {
    ...req.body
  }, id);

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Rider didn't updated"
    });
  }

  const resultData = await findByPk(rider, id);

  return res.status(201).json({
    status: "success",
    message: "Rider updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});
export const updateRiderStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  console.log(req.body);
  const result = await update(rider, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Rider didn't updated"
    });
  }

  const riders = await findAll(rider);

  const results = _.map(riders, riderObj => _.omit(riderObj, ['updatedAt', 'createdAt']));

  return res.status(201).json({
    status: "success",
    message: "Rider updated successfully",
    statusCode: 200,
    payload: results
  });
});

export const deleteRiderById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(rider, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Rider not found"
    });
  }
  const riders = await findAll(rider);

  const results = _.map(riders, riderObj => _.omit(riderObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider deleted successfully",
    payload: results
  });
});

export const createRiderLog = catchAsync(async (req, res, next) => {
  const result = await create(rider_log, {
    ...req.body
  });
  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider Log already exist"
    });
  }

  let id = req.body.rider_id;

  let payload = {
    is_active: 1,
    delivery_status: 'available'
  }
  const resultObj = await update(rider, payload, id);

  if (!resultObj) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Rider didn't updated"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider Log created successfully"
  });
});
export const getActiveRiders = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const riders = await allActiveRiders(rider, {
    is_active: 1
  });

  for (let index = 0; index < riders.length; index++) {
    const element = riders[index];
    const riderLog = await findByRider(rider_log, {
      rider_id: element.id
    });
    riders[index].rider_log = riderLog;
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: riders
  });
});
export const getActiveRiderOrder = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const riderObj = await findByRider(rider, {
    id: id
  });
  if (riderObj.delivery_status == 'ongoing') {
    const orderObj = await findByRiderId(order, {
      rider_id: id,
      order_status: {
        [Op.in]: ['acceptedorder', 'arrivedatvendor','handovertorider', 'pickeduporder', 'arrivedatcustomer','handovertocustomer' ]
      }
    });
    riderObj.order = orderObj;
  } else {
    riderObj.order = null;
  }
  const riderLog = await findByRider(rider_log, {
    rider_id: riderObj.id
  });

  riderObj.map_lat = riderLog.map_latitude;
  riderObj.map_lng = riderLog.map_longitude;  
  
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: riderObj
  });
});
const getDatesBetween = (startDate, endDate) => {
  
  const dates = [];
  const currentDate = moment(startDate);
  const lastDate = moment(endDate);
  
  while (currentDate <= lastDate) {
    dates.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate.add(1, 'days');
  }

  return dates;
}
export const setRiderShiftNextWeek = catchAsync(async (req, res, next) => {

  let weekDates = getDatesBetween(req.body.start_date, req.body.end_date);
  let lastStartDate = moment(req.body.start_date).subtract(7, 'days').utc(process.env.TIMEZONE);
  let lastEndDate = moment(req.body.end_date).subtract(7, 'days').utc(process.env.TIMEZONE);
  let times = await commonService.findAllWithModelAndFilter(work_time, {status: 1}).map(time => time.id);
  let areaIds = await commonService.findAllWithModelAndFilter(area, {status: 1}).map(areaObj => areaObj.id);
  let lastShiftWeek = await commonService.findWithModelAndFilter(rider_shift_week, {start_date: lastStartDate, end_date: lastEndDate});

  let updateShiftWeek = await commonService.updateModelAndFilter(rider_shift_week, {
    status: 0
  }, {
    id: {
      [Op.not]: lastShiftWeek.id
    }
  })

  let payload = {
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    status: 1
  }

  let riderShiftWeekObj = await commonService.create(rider_shift_week, payload);

  if (!objIsNotEmpty(riderShiftWeekObj)) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Rider shift week not created"
    });
  }
  let updateOldRiderShift = await commonService.updateModelAndFilter(rider_shift, {
    status: 0
  }, {
    rider_shift_week_id: {
      [Op.not]: lastShiftWeek.id
    }
  })
  for (let dateIndex = 0; dateIndex < weekDates.length; dateIndex++) {
    const date = weekDates[dateIndex];
    for (let areaIndex = 0; areaIndex < areaIds.length; areaIndex++) {
      const areaId = areaIds[areaIndex];
      for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
        const timeId = times[timeIndex];

        let riderShiftPayload = {
          area_id: areaId,
          rider_work_time_id: timeId,
          rider_shift_week_id: riderShiftWeekObj.id,
          shiftdate: date,
          status: 1
        }
        let riderShiftObj = await rider_shift.create({
          ...riderShiftPayload
        });
      }
    }
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Rider shift created",
    payload: {lastEndDate, lastStartDate}
  });
});

export const getAllShift = catchAsync(async (req, res, next) => {
  const {
    limit,
    offset
  } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  // if (searchTerm.name) {
  //   andAttributes.push({first_name: {
  //     [Op.or]: [{[Op.like]: "%"+searchTerm.name+"%"}, {[Op.like]: "%"+searchTerm.name.toLowerCase()+"%"}]
  //   }});
  // }
  // if (searchTerm.is_active) {
  //   andAttributes.push({is_active: searchTerm.is_active});
  // }
  // if (searchTerm.rider_uid) {
  //   andAttributes.push({rider_uid: searchTerm.rider_uid});
  // }
  // if (searchTerm.status) {
  //   andAttributes.push({status: parseInt(searchTerm.status)});
  // }else{
  //   orAttributes.push({status: {[Op.in]: [0, 1]}});
  // }
  orAttributes.push({
    createdAt: {
      [Op.not]: null
    }
  });

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let allShifts = await commonService.findAndCountAllWithModelAndOptions(rider_shift, {
    where: where,
    attributes: { exclude: ['createdAt', 'updatedAt'] }, 
    raw:true,
    limit: limit,
    offset: offset,
    order:[['shiftdate', 'DESC']]
  });

  if (allShifts.length == 0) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "No available shifts",
      payload: []
    });
  }
  for (let index = 0; index < allShifts.rows.length; index++) {
    const shiftObj = allShifts.rows[index];
    let workTime = await commonService.findWithModelAndFilter(work_time, {
      id: shiftObj.rider_work_time_id
    });
    let areaObj = await commonService.findWithModelAndFilter(area, {
      id: shiftObj.area_id
    });
    shiftObj.workTime = _.omit(workTime, ["updatedAt", "createdAt"]);
    shiftObj.area = _.omit(areaObj, ["updatedAt", "createdAt"]);
  }
  allShifts = getPaginationData(allShifts, req.query.page, limit);
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "All shifts",
    payload: allShifts
  });

});