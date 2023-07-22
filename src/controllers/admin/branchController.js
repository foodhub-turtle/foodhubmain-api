import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findById, update, deleteByPk, findAllBranch, findAllBranches, createOpening, deleteOpeningByBranch } from "../../services/branchService.js";
const categoryService = require("../../services/categoryService.js");
const cuisineService = require("../../services/cuisineService.js");
const branchService = require("../../services/branchService.js");
import { findAllDefault } from "../../services/index.js";
import { getPagination, getPaginationData, branchIdGenerator } from "../../libs/commomLibs";
import { Op } from 'sequelize';
import catchAsync from "../../libs/catchAsync.js";
import { uploadImage } from "../../libs/globalUpload";
import AWS from 'aws-sdk';
import { hashPassword } from "../../libs/passwordOp";
const fs = require("fs");
const commonService = require("../../services/commonService");
const { branch, opening_hour, item_category, cuisine, user, ordered_restaurant } = Model;

export const getAllBranches = catchAsync(async (req, res, next) => {
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
  if (searchTerm.role) {
    andAttributes.push({branch_type: searchTerm.role});
  }
  if (searchTerm.parent_id) {
    andAttributes.push({parent_id: searchTerm.parent_id});
  }
  orAttributes.push({status: {[Op.in]: [0, 1]}});
  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let branches = await findAllBranches(branch, where, limit, offset);
  for (let indexBranch = 0; indexBranch < branches.rows.length; indexBranch++) {
    const elementBranch = branches.rows[indexBranch];
    if (elementBranch.category_id.length > 0) {
      const categories = [];
      for (let index = 0; index < elementBranch.category_id.length; index++) {
        const element = elementBranch.category_id[index];
        const categoryObj = await categoryService.findByPk(item_category, element);
        categories.push(categoryObj);
      }
      elementBranch.categories = categories;
    }else{
      elementBranch.categories = [];
    }
    let orderedRestaurant = await commonService.findWithModelAndFilter(ordered_restaurant, {branch_id: elementBranch.id});
    branches.rows[indexBranch].rating = orderedRestaurant ? orderedRestaurant.avg_rating : 0;
  };

  branches = getPaginationData(branches, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branches
  });
});
export const getBranchByRestaurant = catchAsync(async (req, res, next) => {
  const restaurant_id = req.query.restaurant;
  const branches = await findAllBranch(branch, {parent_id: restaurant_id});

  // const results = _.map(branches, (branchObj) => {
  //   if (!_.isEmpty(branchObj.image)) {
  //     console.log(branchObj);
  //     branchObj.image = fs.readFileSync(__basedir + "/uploads/" + branchObj.image, {encoding: 'base64'});
  //   }
  //   return branchObj;
  // });

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branches
  });
});

export const getBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findById(branch, id);
  if (result.category_id.length > 0) {
    const categories = [];
    for (let index = 0; index < result.category_id.length; index++) {
      const element = result.category_id[index];
      const categoryObj = await categoryService.findByPk(item_category, element);
      categories.push(categoryObj);
    }
    result.categories = categories;
  }else{
    result.categories = [];
  }
  console.log(result.cuisine_id);
  if (result.cuisine_id.length > 0) {
    const cuisines = [];
    for (let indexCuisine = 0; indexCuisine < result.cuisine_id.length; indexCuisine++) {
      const elementCuisine = result.cuisine_id[indexCuisine];
      const cuisineObj = await cuisineService.findByPk(cuisine, elementCuisine);
      cuisines.push(cuisineObj);
    }
    result.cuisines = cuisines;
  }else{
    result.cuisines = [];
  }
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Branch not found"
    });
  }
  // if (!_.isEmpty(result.image)) {
  //   result.image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + result.image, {encoding: 'base64'});
  // }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createBranch = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const email = req.body.email.toLowerCase();
  const phone = req.body.phone;
  const category_id = [];
  const cuisine_id = [];

  req.body.category_id.split(',').forEach(category => {
    category_id.push(parseInt(category));
  });
  req.body.cuisine_id.split(',').forEach(cuisine => {
    cuisine_id.push(parseInt(cuisine));
  });
  req.body.category_id = category_id;
  req.body.cuisine_id = cuisine_id;
  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
  // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
  //   req.body.image = await uploadImage(req.files.image[0]);
  // }
  // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
  //     req.body.banner_image = await uploadImage(req.files.banner_image[0]);
  // }
  console.log(req.body);
  req.body.branch_uid = branchIdGenerator();
  const [newBranch, created] = await findOrCreate(branch, {email: email}, {
    ...req.body
  }); 
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Branch already exist"
    });
  }
  req.body.password = '123456';
  req.body.password = await hashPassword(req.body.password);
  req.body.role = ['user','vendor'];
  var branchBody = req.body;
  // delete req.body.name;
  // delete req.body.average_cost;
  // delete req.body.address;
  req.body.firstName = newBranch.name;
  req.body.lastName = newBranch.name;
  user.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  })
    .then(async (result) => {  
      let payloadBranch = {user_id: result.id};
      let id = newBranch.id;
      const resultObj = await branchService.updateBranch(branch, {
        ...payloadBranch,
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
  //   newBranch.image = req.file.filename;
    
  //   fs.writeFileSync(
  //     __basedir + "/uploads" + req.file.originalname,
  //     newBranch.image
  //   );
  //   const contents = fs.readFileSync(__basedir + "/uploads/" + newBranch.image, {encoding: 'base64'});
  //   newBranch.image = contents;
  // }

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Branch created successfully",
    payload: _.omit(newBranch.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateBranch = catchAsync(async (req, res, next) => {
  console.log(req.body.is_business);
  const id = req.query.id;
  
  const category_id = [];
  const cuisine_id = [];
  req.body.category_id.split(',').forEach(category => {
    category_id.push(parseInt(category));
  });
  req.body.cuisine_id.split(',').forEach(cuisine => {
    cuisine_id.push(parseInt(cuisine));
  });
  req.body.category_id = category_id;
  req.body.cuisine_id = cuisine_id;
  if (req.file) {
    req.body.image = await uploadImage(req.file);
    console.log(req.body.image);
  }
  // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
  //   req.body.image = await uploadImage(req.files.image[0]);
  // }
  // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
  //     req.body.banner_image = await uploadImage(req.files.banner_image[0]);
  // }
  // req.body.category_id = [req.body.category_id];
  // req.body.cuisine_id = [req.body.cuisine_id];
  const result = await update(branch, {
    ...req.body,
    id
  });

  if (!result[0]) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Branch didn't updated"
    });
  }

  const resultData = await findById(branch, id);

  if (_.isEmpty(resultData.branch_uid)) {
    let payload = {
      branch_uid: branchIdGenerator()
    };
    await update(branch, {
      ...payload,
      id
    });
  }
  const newResultData = await findById(branch, id);

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
    message: "Branch updated successfully",
    statusCode: 200,
    payload: newResultData
  });
});
export const changeStatusBranch = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(branch, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Branch didn't updated"
    });
  }

  const branches = await findAll(branch);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Branch updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deleteBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(branch, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Branch not found"
    });
  }
  const branches = await findAll(branch);

  const results = _.map(branches, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Branch deleted successfully",
    payload: results
  });
});
export const getOpeningHoursBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const opening_hours = await findAllDefault(opening_hour, {branch_id: id});

  const results = _.map(opening_hours, opening_hourObj => _.omit(opening_hourObj, ['updatedAt', 'createdAt']));

  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Opening hours",
    payload: results
  });
});
export const insertOpeningHours = catchAsync(async (req, res, next) => {
  const id = req.body.branch_id;
  const result = await deleteOpeningByBranch(opening_hour, {branch_id: id});
  const data = req.body.payload;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const openingHourObj = await createOpening(opening_hour, {
      branch_id: id,
      days: element.days,
      fromHour: element.fromHour,
      toHour: element.toHour,
      status: 1
    });
  }

  const opening_hours = await findAllDefault(opening_hour, {branch_id: id});

  const results = _.map(opening_hours, opening_hourObj => _.omit(opening_hourObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Opening hours",
    payload: results
  });
});



// export const uploadImage = catchAsync(async (req, res, next) => {
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   })
//   let image = null;
//   // if (!_.isEmpty(req.file)) {
//     const imagePath = req.file.path
//     const blob = fs.readFileSync(imagePath)

//     const uploadedImage = await s3.upload({
//       Bucket: process.env.AWS_BUCKET,
//       Key: req.file.originalname,
//       Body: blob,
//     }).promise()

//     console.log(uploadedImage.Location);
//     // fs.writeFileSync(
//     //   __basedir + "/uploads" + req.file.originalname,
//     //   newBranch.image
//     // );
//     // const contents = fs.readFileSync(__basedir + "/uploads/" + newBranch.image, {encoding: 'base64'});
//     // newBranch.image = contents;
//   // }

//   return res.status(200).json({
//     status: "success",
//     statusCode: 200,
//     message: "Branch created successfully",
//     image: uploadedImage.Location
//   });
// });