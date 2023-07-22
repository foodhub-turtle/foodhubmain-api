import _, { result } from "lodash";
import Model from "../../models/index.js";
import { findAllPermission, findAllUser, findRole, findLinkedUser, findUser, deleteByPk, bulkCreate, findOrCreate, findRoles, findAllWithModel, findAllWithModelAndFilter, findWithModelAndFilter } from "../../services/permissionService.js";
const commonService = require("../../services/commonService.js");
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import moment from 'moment';
import { Op } from 'sequelize';
const fs = require("fs");
const { link_user_permission, permission, user, userrole, userroles, submodule, screen, rolescreenpermission } = Model;

export const getAllPermissions = catchAsync(async (req, res, next) => {
    let permissions = await findAllPermission(permission);

    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: permissions
    });
  });
export const getAllAdminUser = catchAsync(async (req, res, next) => {
  let users = await findAllUser(user);
  let results = [];
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    let role = await findRole(userrole, {userId: element.id, roleId: 3});
    if (role && role.userId == element.id) {
      results.push(element);
    }
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});
export const getLinkToUser = catchAsync(async (req, res, next) => {
  let userObj = await findUser(user, {phone: req.query.phone});
  console.log(userObj);
  let linkedUser = await findLinkedUser(link_user_permission, {user_id: userObj.id}).map((user) => {
    return parseInt(user.permission_id)
  });
  return res.status(200).json({ 
    status: "success", 
    statusCode: 200,
    payload: linkedUser
  });
});
export const saveUserPermission = catchAsync(async (req, res, next) => {
  let userObj = await findUser(user, {phone: req.query.phone});
  
  let linkedPermissions = [];
  for (let index = 0; index < req.body.permissions.length; index++) {
    const element = req.body.permissions[index];
    linkedPermissions.push({user_id: userObj.id, permission_id: element.permission_id});
  }
  
  const count = await deleteByPk(link_user_permission, {user_id: userObj.id});
console.log(linkedPermissions);
  await bulkCreate(link_user_permission, linkedPermissions);

  return res.status(200).json({ 
    status: "success", 
    statusCode: 200,
    payload: result
  });
});
export const saveUserRole = catchAsync(async (req, res, next) => {
  req.body.setdate = moment().format('YYYY-MM-DD');
  
  const [role, created] = await findOrCreate(userroles, {
    ...req.body
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Role already exist"
    });
  }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Role created successfully",
    payload: _.omit(role.toJSON(), ["updatedAt", "createdAt"])
  });
});
export const updateUserRole = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await commonService.updateModel(userroles, {...req.body},id);
  
  if (!result[0]) {
    return res.status(500).json({
      status: "fail",
      statusCode: 500,
      message: "role didn't updated"
    });
  }

  const resultData = await commonService.findWithModelAndFilter(userroles, {id: id});

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Role updated successfully",
    payload: resultData
  });
});
export const deleteUserRole = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const resultData = await commonService.findWithModelAndFilter(userroles, {id: id});

  const result = await commonService.deleteModelByPk(userroles, id);
  
  if (!result) {
    return res.status(500).json({
      status: "fail",
      statusCode: 500,
      message: "role didn't deleted"
    });
  }
  
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Role deleted successfully",
    payload: resultData
  });
});

export const getRoles = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.role_name) {
    andAttributes.push({role_name: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.role_name+"%"}, {[Op.like]: "%"+searchTerm.role_name.toLowerCase()+"%"}]
    }});
  }
 
  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let roles = await findRoles(userroles, where, limit, offset);

  roles = getPaginationData(roles, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: roles
  });
});
export const getAllRoles = catchAsync(async (req, res, next) => {

  let roles = await findAllWithModel(userroles);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: roles
  });
});
export const getRoleWiseScreen = catchAsync(async (req, res, next) => {
  let module_id = req.query.module;
  let sub_module_id = req.query.submodule;
  let role_id = req.query.role;
  let screens = await findAllWithModelAndFilter(screen, {module_id: module_id, sub_module_id: sub_module_id});

  for (let index = 0; index < screens.length; index++) {
    const element = screens[index];
    console.log(element.screencode, role_id);
    const rolescreen = await findWithModelAndFilter(rolescreenpermission, {screen_code: element.screencode, role_id: role_id});
    screens[index].screenrole = rolescreen;
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: screens
  });
});
export const saveUpdateRoleWiseScreen = catchAsync(async (req, res, next) => {
  if (req.body.rolepermissionid == -1) {
    let createPayload = {
      screen_code: req.body.screen_code, 
      can_add: req.body.permission == 'can_add' ? 1 : 0,
      can_edit: req.body.permission == 'can_edit' ? 1 : 0,
      can_delete: req.body.permission == 'can_delete' ? 1 : 0,
      can_view: req.body.permission == 'can_view' ? 1 : 0,
      date: moment(),
      role_id: req.body.role
    }
    const createResult = await commonService.create(rolescreenpermission, createPayload);
    if (!createResult) {
      return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: "Role permission already exist"
      });
    }
  } else {
    let updatePayload = {};

    switch (req.body.permission) {
      case 'can_add':
        updatePayload.can_add = req.body.permission_status
        break;
      case 'can_edit':
        updatePayload.can_edit = req.body.permission_status
        break;
      case 'can_view':
        updatePayload.can_view = req.body.permission_status
        break;
      case 'can_delete':
        updatePayload.can_delete = req.body.permission_status
        break;
      default:
        break;
    }
    console.log(updatePayload, req.body.rolepermissionid);

    const result = await commonService.updateModel(rolescreenpermission, {...updatePayload}, req.body.rolepermissionid);
  
    if (!result[0]) {
      return res.status(500).json({
        status: "fail",
        statusCode: 500,
        message: "Role permission didn't updated"
      });
    }
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
  });
});
//Sub module
export const getAllSubmodule = catchAsync(async (req, res, next) => {

  let submodules = await findAllWithModel(submodule);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: submodules
  });
});



