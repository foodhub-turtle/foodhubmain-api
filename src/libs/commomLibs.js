const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const commonService = require("../services/commonService");
import Model from "../models/index.js";
import catchAsync from "./catchAsync.js";
const {
  customer,
  employee,
  rider
} = Model;
const catchError = (err, res) => {
  
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(403).send({ 
      statusCode: 403,
      message: "Unauthorized! Access Token was expired!",
      issue: 'ACCESS_TOKEN_EXPIRED'
    });

  }

  return res.status(403).send({
    statusCode: 401,
    message: "Unauthorizeds!",
    issue: 'UNAUTHORIZED',
  });
}
export const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
export const getPaginationData = (datas , page, limit) => {
    const { count: total, rows: data } = datas;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(total / limit);
  return { total, data, totalPages, currentPage };
};
export const orderNumberGenerator = () => {
  var result           = '';
  var length           = 8;
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  result = result.slice(0, 4) + "-" + result.slice(4);
  return result;
};
export const branchIdGenerator = () => {
  var result           = '';
  var length           = 6;
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  
  return result;
};

export const objIsNotEmpty = (obj = null) => obj && Object.keys(obj).length !== 0;

export const objDeepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const objIsSame = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const getCustomerFromToken = async (token) => {
  let userId;
  let customerObj;
  jwt.verify(token, config.secret,(err, decoded) => {
    if (err) {
      userId = null;
    } else {
      userId = decoded.id;
    }
  });
  if (userId) {
    customerObj = await commonService.findWithModelAndFilter(customer, {user_id: userId});
  } else {
    customerObj =null;
  }
  return customerObj;
}
export const getEmployeeFromToken = async (token) => {
  let userId;
  let employeeObj
  jwt.verify(token, config.secret,(err, decoded) => {
    if (err) {
      userId = null;
    } else {
      userId = decoded.id;
    }
  });
  if (userId) {
    employeeObj = await commonService.findWithModelAndFilter(employee, {user_id: userId});
  } else {
    employeeObj = null;
  }
  return employeeObj;
}
export const getRiderFromToken = async (token) => {
  let userId;
  let riderObj;
  jwt.verify(token, config.secret,(err, decoded) => {
    if (err) {
      userId = null;
    } else {
      userId = decoded.id;
    }
  });
  if (userId) {
    riderObj = await commonService.findWithModelAndFilter(rider, {user_id: userId});
  } else {
    riderObj = null;
  }
  return riderObj;
}
// export const getCustomerFromToken = catchAsync(async (req, res, next) => {
//   let token = req.headers["x-access-token"];
//   jwt.verify(token, config.secret,async (err, decoded) => {
//     if (err) {
//       return catchError(err, res);
//     }
//     let customer = await commonService.findAllWithModelAndFilter(customer, {user_id: decoded.id});
//     console.log(customer);
//     return customer;
//   });
// });
