import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findById, update, deleteByPk, findAllRestaurant } from "../../services/restaurantService.js";
import catchAsync from "../../libs/catchAsync.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
const fs = require("fs");
import { Op } from 'sequelize';
import { hashPassword } from "../../libs/passwordOp";
import { uploadImage } from "../../libs/globalUpload";

const { restaurant, user } = Model;

export const getAllRestaurants = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.name) {
    andAttributes.push({name: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.name+"%"}, {[Op.like]: "%"+searchTerm.name.toLowerCase()+"%"}]
    }});
  }
  if (searchTerm.email) {
    andAttributes.push({email: searchTerm.email});
  }
  if (searchTerm.phone) {
    andAttributes.push({phone: searchTerm.phone});
  }
  if (searchTerm.average_cost) {
    andAttributes.push({average_cost: searchTerm.average_cost});
  }
  if (searchTerm.role) {
    andAttributes.push({outlet_type: searchTerm.role});
  }
  orAttributes.push({status: {[Op.in]: [0, 1]}});
  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let restaurants = await findAllRestaurant(restaurant, where, limit, offset);

  // const results = _.map(restaurants, (restaurantObj) => {
  //   if (!_.isEmpty(restaurantObj.image)) {
  //     console.log(restaurantObj);
  //     restaurantObj.image = fs.readFileSync(__basedir + "/uploads/" + restaurantObj.image, {encoding: 'base64'});
  //   }
  //   return restaurantObj;
  // });
  restaurants = getPaginationData(restaurants, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: restaurants
  });
});

export const getRestaurantById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findById(restaurant, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant not found"
    });
  }
  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createRestaurant = catchAsync(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const phone = req.body.phone;
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
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
  req.body.firstName = req.body.name;
  req.body.lastName = '';
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
  // if (!_.isEmpty(req.file)) {
  //   restaurantObj.image = req.file.filename;
    
  //   fs.writeFileSync(
  //     __basedir + "/uploads" + req.file.originalname,
  //     restaurantObj.image
  //   );
  //   const contents = fs.readFileSync(__basedir + "/uploads/" + restaurantObj.image, {encoding: 'base64'});
  //   restaurantObj.image = contents;  
  // }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Restaurant created successfully",
    payload: _.omit(restaurantObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateRestaurant = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
  const result = await update(restaurant, {
    ...req.body,
    id
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant didn't updated"
    });
  }

  const resultData = await findById(restaurant, id);
  // if (!_.isEmpty(req.file)) {
  //   resultData.image = req.file.filename;
    
  //   fs.writeFileSync(
  //     __basedir + "/uploads" + req.file.originalname,
  //     resultData.image
  //   );
  //   const contents = fs.readFileSync(__basedir + "/uploads/" + resultData.image, {encoding: 'base64'});
  //   resultData.image = contents;  
  // }

  return res.status(201).json({
    status: "success",
    message: "Restaurant updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});
export const changeStatusRestaurant = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(restaurant, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant didn't updated"
    });
  }

  const restaurants = await findAll(restaurant);

  const results = _.map(restaurants, restaurantObj => _.omit(restaurantObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Restaurant updated successfully",
    statusCode: 200,
    payload: results
  });
});

export const deleteRestaurantById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(restaurant, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Restaurant not found"
    });
  }
  const restaurants = await findAll(restaurant);

  const results = _.map(restaurants, restaurantObj => _.omit(restaurantObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Restaurant deleted successfully",
    payload: results
  });
});




