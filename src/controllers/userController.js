import _ from "lodash";
import { findAll, findUser, findUserFilter } from "../services/index.js";
import GlobalError from "../libs/globalError.js";
import Model from "../models/index.js";
import catchAsync from "../libs/catchAsync.js";
import { findOrCreate } from "../services/restaurantService.js";
import { signupService } from "../services/authService.js";
import { hashPassword } from "../libs/passwordOp";

const { user, restaurant, branch } = Model;

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await findAll(user);
  const body = users.map(user => _.omit(user, ["email_verified_at","remember_token","password", "updatedAt", "createdAt"]));

  return res.status(200).json({
    status: "success",
    payload: users
  });
});
export const checkPhoneForUser = catchAsync(async (req, res, next) => {
    const phone = req.body.phone;
    if (!phone) {
      return res.status(200).json({
        status: "fail",
        statusCode: 400,
        message: "Phone number is missing"
      });
        // return next(new GlobalError("User doesn't exists", 404));
    }
    const resultUser = await findUser(user, {phone : phone});
    if (!resultUser) {
      return res.status(200).json({
        status: "fail",
        statusCode: 403,
        message: "User doesn't exists"
      });
        // return next(new GlobalError("User doesn't exists", 404));
    }
    
    return res.status(200).json({
        status: "success",
        statusCode: 200,
        payload: _.omit(resultUser.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"])
    });
});
export const checkEmailForUser = catchAsync(async (req, res, next) => {
    const email = req.body.email;

    const resultUser = await findUser(user, {email : email});
    if (!resultUser) {
      return res.status(400).json({
        status: "fail",
        statusCode: 400,
        message: "User already exist"
      });
        // return next(new GlobalError("User doesn't exists", 404));
    }
    
    return res.status(200).json({
        status: "success",
        statusCode: 200,
        payload: _.omit(resultUser.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"])
    });
});

export const registerRestaurant = catchAsync(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const phone = req.body.phone;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  req.body.category_id = [req.body.category_id];
  req.body.cuisine_id = [req.body.cuisine_id];
  delete req.body.firstName;
  delete req.body.lastName;
  console.log(req.body);
  const [restaurantObj, created] = await findOrCreate(restaurant, {
    ...req.body,
    email,
    phone
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Restaurant already exist"
    });
  }
  
  req.body.password = '123456';
  req.body.password = await hashPassword(req.body.password);
  req.body.role = ['user','vendor'];
  var branchBody = req.body;
  // delete req.body.name;
  // delete req.body.average_cost;
  // delete req.body.address;
  req.body.firstName = firstName;
  req.body.lastName = lastName;
  user.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  })
    .then(async (result) => {  
      console.log(branchBody.email);
      var userObj = await findUserFilter(user, { email: branchBody.email});

      branchBody.parent_id = restaurantObj.id;
      branchBody.user_id = userObj.id;
      branchBody.is_mainBranch = 1;
      const [branchObj, createdBranch] = await findOrCreate(branch, {
        ...branchBody,
        email,
        phone
      });    
      if (req.body.roles) {
        role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
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
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

    
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Restaurant created successfully",
    payload: _.omit(restaurantObj.toJSON(), ["updatedAt", "createdAt"])
  });
});