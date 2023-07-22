import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllRiders, allActiveRiders, create, findByRider } from "../../services/riderService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { Op } from 'sequelize';
import { hashPassword } from "../../libs/passwordOp";
import { uploadImage } from "../../libs/globalUpload";
import { findByRiderId } from "../../services/orderService.js";
const commonService = require("../../services/commonService");

const { rider, user, rider_log, order } = Model;

export const getAllRiders = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.name) {
    andAttributes.push({first_name: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.name+"%"}, {[Op.like]: "%"+searchTerm.name.toLowerCase()+"%"}]
    }});
  }
  if (searchTerm.is_active) {
    andAttributes.push({is_active: searchTerm.is_active});
  }
  if (searchTerm.rider_uid) {
    andAttributes.push({rider_uid: searchTerm.rider_uid});
  }
  if (searchTerm.status) {
    andAttributes.push({status: parseInt(searchTerm.status)});
  }else{
    orAttributes.push({status: {[Op.in]: [0, 1]}});
  }
  orAttributes.push({createdAt: {[Op.not]: null}});

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
   req.body.role = ['user','rider'];
   user.create({
     firstName: req.body.firstName,
     lastName: req.body.lastName,
     email: req.body.email,
     phone: req.body.phone,
     password: req.body.password
   })
     .then(async (result) => {  
       let payloadRider = {user_id: result.id};
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
       res.status(500).send({ message: err.message });
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
  const result = await update(rider, {...req.body}, id);

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

  const riders = await allActiveRiders(rider, {is_active: 1});

  for (let index = 0; index < riders.length; index++) {
    const element = riders[index];
    const riderLog = await findByRider(rider_log, {rider_id: element.id});
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
  const riderObj = await findByRider(rider, {id: id});
  if (riderObj.delivery_status == 'ongoing') {
    const orderObj = await findByRiderId(order, {rider_id: id});
    riderObj.order = orderObj;
  }

  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: riderObj
  });
});
export const setRiderShiftNextWeek = catchAsync(async (req, res, next) => {

});

