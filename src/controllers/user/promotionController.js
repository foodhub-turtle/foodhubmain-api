import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, create } from "../../services/promotionService.js";
import { findAllRating, findAllReview } from "../../services/branchService.js";
import { findVoucherBranch } from "../../services/voucherService.js";
import catchAsync from "../../libs/catchAsync.js";
const fs = require("fs");
import { findByFilter } from "../../services/restaurantDiscountService.js";
import { findOne } from "../../services/settingsService.js";
import { getBranchDistanceById } from "../../libs/googleMap.js";

const { promotion, restaurant_promotion, branch, restaurant_discount,review,ordered_restaurant,voucher,setting } = Model;

export const getAllPromotions = catchAsync(async (req, res, next) => {
  const promotions = await findAll(promotion, {status: 1});
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  const settingObj = await findOne(setting);
  for (let index = 0; index < promotions.length; index++) {
    const element = promotions[index];
    var restaurant_promotions = await findAll(restaurant_promotion, {promotion_id: element.id});
    for (let rindex = 0; rindex < restaurant_promotions.length; rindex++) {
      const restaurant_promotion = restaurant_promotions[rindex];
      var branchObj = await findByPk(branch, restaurant_promotion.branch_id);
      var origins = [req.query.lat+','+req.query.lng];
      var destinations = [branchObj.map_latitude+','+branchObj.map_longitude];
      if (branchObj.is_hasVoucher == 1) {
        var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: branchObj.id});
        branchObj.voucher = restaurantVoucher;
      }
      var ratingObj = await findAllRating(ordered_restaurant, {branch_id: branchObj.id});
      var reviews = await findAllReview(review, {branch_id: branchObj.id});
      var favourites = await findAllRating(ordered_restaurant, {branch_id: branchObj.id, is_favourite: 1});
      branchObj.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
      branchObj.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
      branchObj.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
      let distanceObj = await getBranchDistanceById(origins, destinations);
      let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
      let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
      if (distanceArray.length > 0) {
        branchObj.deliverDistance = parseFloat(distanceArray[0]);
        branchObj.deliverDistanceUnit = distanceArray[1];
      }else{
        branchObj.deliverDistance = 0;
        branchObj.deliverDistanceUnit = 'km';
      }
      if (distanceTimeArray.length > 0) {
        branchObj.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(branchObj.preparation_time);
        branchObj.deliverTimeUnit = distanceTimeArray[1];
      }else{
        branchObj.deliverTime = 0;
        branchObj.deliverTimeUnit = 'mins';
      }
      branchObj.deliverFee = (branchObj.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((branchObj.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
      if (branchObj.is_hasDiscount) {
        var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: branchObj.id});
        branchObj.discount = restaurantDiscount;
      }

      restaurant_promotion.branch = branchObj;
    }
    promotions[index].restaurant_promotions = restaurant_promotions;
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: promotions
  });
});

export const getPromotionById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(promotion, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createPromotion = catchAsync(async (req, res, next) => {
  const title = req.body.title.toLowerCase().charAt(0).toUpperCase() + req.body.title.slice(1);
    if (!_.isEmpty(req.file)) {
        req.body.image = req.file.filename;
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
        req.body.image = req.files.image[0].filename;
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
        req.body.banner_image = req.files.banner_image[0].filename;
    }
  const [promotionObj, created] = await findOrCreate(promotion, {
    ...req.body,
    title
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Promotion already exist"
    });
  }
  if (!_.isEmpty(req.file)) {
    promotionObj.image = req.file.filename;
    
    fs.writeFileSync(
      __basedir + "/uploads" + req.file.originalname,
      promotionObj.image
    );
    const contents = fs.readFileSync(__basedir + "/uploads/" + promotionObj.image, {encoding: 'base64'});
    promotionObj.image = contents;  
  }
  const branches = req.body.branch_ids;
  const result = _.omit(promotionObj.toJSON(), ["updatedAt", "createdAt"]);
  
  branches.forEach(async (value, index) => {
    console.log(value);
    let restaurantPromotionPayload = {
      promotion_id: result.id,
      branch_id: value.branch_id,
      status: 1
    };

    const restaurantPromotionObj = await create(restaurant_promotion, {
      ...restaurantPromotionPayload
    });
  });
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Promotion created successfully",
    payload: _.omit(promotionObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updatePromotion = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
        req.body.image = req.files.image[0].filename;
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
        req.body.banner_image = req.files.banner_image[0].filename;
    }
    if (!_.isEmpty(req.file)) {
        req.body.image = req.file.filename;
    }
    const result = await update(promotion, {
        ...req.body,
        id,
        slug
    });

    if (!result[0]) {
        return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Promotion didn't updated"
        });
    }

    const resultData = await findByPk(promotion, id);
    if (!_.isEmpty(req.file)) {
        resultData.image = req.file.filename;
        
        fs.writeFileSync(
        __basedir + "/uploads" + req.file.originalname,
        resultData.image
        );
        const contents = fs.readFileSync(__basedir + "/uploads/" + resultData.image, {encoding: 'base64'});
        resultData.image = contents;  
    }

    return res.status(201).json({
        status: "success",
        message: "Promotion updated successfully",
        statusCode: 200,
        payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
    });
});

export const changeStatusPromotion = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(promotion, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion didn't updated"
    });
  }

  const promotions = await findAll(promotion);

  const results = _.map(promotions, promotionObj => _.omit(promotionObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Promotion updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deletePromotionById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(promotion, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion not found"
    });
  }
  const promotions = await findAll(promotion);

  const results = _.map(promotions, promotionObj => _.omit(promotionObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Promotion deleted successfully",
    payload: results
  });
});

export const updatePromotionStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(promotion, {
      ...req.body,
      id
  });
  if (!result[0]) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Promotion not found"
      });
  }
  const resultData = await findByPk(promotion, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Promotion status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});