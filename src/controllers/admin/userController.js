import _, { result } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import moment from 'moment';
import { Op } from 'sequelize';
const commonService = require("../../services/commonService.js");
import { hashPassword } from "../../libs/passwordOp";
const fs = require("fs");
const { user, userroles, employee, role } = Model;

//User
export const getAllUsers = catchAsync(async (req, res, next) => {

    let users = await commonService.findAllWithModel(user);
    for (let index = 0; index < users.length; index++) {
        const element = users[index];
        let role = await commonService.findWithModelAndFilter(userroles, {id: element.role_id});
        users[index].role = role;
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: users
    });
  });
  
export const saveUser = catchAsync(async (req, res, next) => {
  const password = await hashPassword(req.body.password);

  const email = req.body.email.toLowerCase();
  req.body.email = email;
  req.body.password = password;
  user.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    isActive: req.body.isActive,
    isLockout: req.body.isLockout,
    role_id: req.body.role,
    verified: true
  })
    .then(async (result) => {
      await commonService.create(employee, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        user_id: result.id,
        status: 0
      });
      
      if (req.body.role) {
        role.findAll({
          where: {
            name: {
              [Op.or]: ['admin']
            }
          }
        }).then(roles => {
          result.setRoles(roles).then(() => {
            // res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        result.setRoles([1]).then(() => {
          // res.send({ message: "User was registered successfully!" });
        });
      }
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        user: _.omit(result.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]),
        message: "User registered successfully",
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});
export const updateUser = catchAsync(async (req, res, next) => {
  let password = '';
  const id = req.query.id;

  if (req.body.password == '') {
    delete req.body.password;
  } else {
    password = await hashPassword(req.body.password);
    req.body.password = password;
  }

  const email = req.body.email.toLowerCase();
  req.body.email = email;
  const result = await commonService.updateModel(user, {...req.body}, id);

  if (!result[0]) {
    return res.status(500).json({
      status: "fail",
      statusCode: 500,
      message: "user didn't updated"
    });
  }

  const resultData = await commonService.findWithModelAndFilter(user, {id: id});

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "User updated successfully",
    payload: resultData
  });
});

export const updateUserStatus = catchAsync(async (req, res, next) => {
  let updatePayload = {};
  const id = req.query.id;

  switch (req.body.optiono) {
    case 'isactive':
      updatePayload.isactive = req.body.status
      break;
    case 'islockout':
      updatePayload.islockout = req.body.status
      break;
    default:
      break;
  }

  const result = await commonService.updateModel(user, updatePayload, id);

  if (!result[0]) {
    return res.status(500).json({
      status: "fail",
      statusCode: 500,
      message: "user didn't updated"
    });
  }

  const resultData = await commonService.findWithModelAndFilter(user, {id: id});

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "User updated successfully",
    payload: resultData
  });
});

export const getAssociatedUsers = catchAsync(async (req, res, next) => {

  let users = await commonService.findAllWithModel(user);
  for (let index = 0; index < users.length; index++) {
      const element = users[index];
      let role = await commonService.findWithModelAndFilter(userroles, {id: element.role_id});
      users[index].role = role;
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: users
  });
});