import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findAllFilter, findOrCreate, findByPk, update, deleteByPk, findAllFilterRecommended, findAllBusinessCategories, findRating, findAllReview, findAllRating, findAllBranch, findByBranchId } from "../../services/branchService.js";
import { findAllCuisine } from "../../services/cuisineService.js";
import { findByFilter } from "../../services/restaurantDiscountService.js";
import { findVoucherBranch } from "../../services/voucherService.js";
import { findAllBranchesByItem } from "../../services/itemService.js";
import { findOrCreateSearch } from "../../services/searchService.js";
import { findByCustomerId, updateOrderedRestaurant, createFavourite } from "../../services/index.js";
const cuisineService = require("../../services/cuisineService.js");
const promotionService = require("../../services/promotionService.js");
const campaignService = require("../../services/campaignService.js");
import catchAsync from "../../libs/catchAsync.js";
import { Op } from 'sequelize';
const fs = require("fs");
import { findOne } from "../../services/settingsService.js";
import { async } from "regenerator-runtime";
import { getBranchDistanceById } from "../../libs/googleMap.js";
const commonService = require("../../services/commonService.js");
import moment from 'moment';

const { branch, cuisine, order, ordered_restaurant, business_category, restaurant_discount, voucher, customer_search_log, item, review, setting, promotion, campaign, restaurant_promotion } = Model;

export const getAllBranchs = catchAsync(async (req, res, next) => {
  
  const branchs = await findAll(branch);

  const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});
export const getAllBusinessCategories = catchAsync(async (req, res, next) => {
  var where = {};

  where.role = req.query.role;
  where.status = 1;

  const business_categories = await findAllBusinessCategories(business_category, where);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: business_categories
  });
});
export const getAllCuisines = catchAsync(async (req, res, next) => {
  const cuisines = await findAllCuisine(cuisine);

  for (let index = 0; index < cuisines.length; index++) {
    const element = cuisines[index];
    cuisines[index].totalbranches = (await findAllBranch(branch, {cuisine_id: { [Op.contains]: [element.id] }})).length;
  }
  // const results = _.map(cuisines, async (cuisineObj) => {
  //     cuisineObj
  //   return cuisineObj;
  // });
  
  
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: cuisines
  });
});

export const setFavouriteBranch = catchAsync(async (req, res, next) => {
  const customer_id = req.query.customer_id;
  const branch_id = req.query.branch_id;

  const result = await updateOrderedRestaurant(ordered_restaurant, {
    ...req.body,
    customer_id,
    branch_id
  });

  if (!result[0]) {
    const favourite = await createFavourite(ordered_restaurant, {
      customer_id: customer_id,
      branch_id: branch_id,
      is_favourite: 1
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: req.body.is_favourite == 1 ? "Branch marked as favorite" : "Branch removed from favorite"
  });
});
export const getAllYourBranchs = catchAsync(async (req, res, next) => {
  const filters = req.query;
  let where = {};
  
  const customer_id = req.query.customer_id;
  
  let orderedRestaurantIds = await findByCustomerId(ordered_restaurant, customer_id);
  let results = _.map(orderedRestaurantIds, branchId => branchId.branch_id);

  where = {
    id: {
      [Op.in]: results
    }
  };
  console.log(orderedRestaurantIds);

  const branchs = await findAllFilter(branch, where);

  // const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branchs
  });
});
export const getAllFavouriteBranchs = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const settingObj = await findOne(setting);
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  let where = {};
  
  const customer_id = req.query.customer_id;
  
  let orderedRestaurantIds = await findByCustomerId(ordered_restaurant, customer_id);
  let results = _.map(_.filter(orderedRestaurantIds, {'is_favourite': 1}), branchId => branchId.branch_id);

  where = {
    id: {
      [Op.in]: results
    }
  };

  const branches = await findAllFilter(branch, where);
  for (let index = 0; index < branches.length; index++) {
    const element = branches[index];
    var origins = [req.query.lat+','+req.query.lng];
    var destinations = [element.map_latitude+','+element.map_longitude];
    if (element.is_hasDiscount) {
      var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: element.id});
      element.discount = restaurantDiscount;
    }
    if (element.is_hasVoucher == 1) {
      var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: element.id});
      element.voucher = restaurantVoucher;
    }
    var ratingObj = await findAllRating(ordered_restaurant, {branch_id: element.id});
    var reviews = await findAllReview(review, {branch_id: element.id});
    var favourites = await findAllRating(ordered_restaurant, {branch_id: element.id, is_favourite: 1});
    element.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
    element.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
    element.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
    let distanceObj = await getBranchDistanceById(origins, destinations);
    let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
    let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
    if (distanceArray.length > 0) {
      element.deliverDistance = parseFloat(distanceArray[0]);
      element.deliverDistanceUnit = distanceArray[1];
    }else{
      element.deliverDistance = 0;
      element.deliverDistanceUnit = 'km';
    }
    if (distanceTimeArray.length > 0) {
      element.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(element.preparation_time);
      element.deliverTimeUnit = distanceTimeArray[1];
    }else{
      element.deliverTime = 0;
      element.deliverTimeUnit = 'mins';
    }
    element.deliverFee = (element.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((element.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
    branches[index] = element;
  }
  // const results = _.map(branchs, branchObj => _.omit(branchObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branches
  });
});
export const getAllRecommandedBranchs = catchAsync(async (req, res, next) => {
  const settingObj = await findOne(setting);
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  const filters = req.query;
  let where = {};
  let andAttributes = [];


  if (filters.is_recommended) {
    andAttributes.push({is_recommended: filters.is_recommended});
  }

  where = {
    [Op.and]: andAttributes
  };
  console.log(where);

  const branches = await findAllFilterRecommended(branch, where);

  for (let index = 0; index < branches.length; index++) {
    const element = branches[index];
    var origins = [req.query.lat+','+req.query.lng];
    var destinations = [element.map_latitude+','+element.map_longitude];
    if (element.is_hasDiscount) {
      var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: element.id});
      element.discount = restaurantDiscount;
    }
    if (element.is_hasVoucher == 1) {
      var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: element.id});
      element.voucher = restaurantVoucher;
    }
    var ratingObj = await findAllRating(ordered_restaurant, {branch_id: element.id});
    var reviews = await findAllReview(review, {branch_id: element.id});
    var favourites = await findAllRating(ordered_restaurant, {branch_id: element.id, is_favourite: 1});
    element.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
    element.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
    element.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
    let distanceObj = await getBranchDistanceById(origins, destinations);
    let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
    let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
    if (distanceArray.length > 0) {
      element.deliverDistance = parseFloat(distanceArray[0]);
      element.deliverDistanceUnit = distanceArray[1];
    }else{
      element.deliverDistance = 0;
      element.deliverDistanceUnit = 'km';
    }
    if (distanceTimeArray.length > 0) {
      element.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(element.preparation_time);
      element.deliverTimeUnit = distanceTimeArray[1];
    }else{
      element.deliverTime = 0;
      element.deliverTimeUnit = 'mins';
    }
    element.deliverFee = (element.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((element.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
    branches[index] = element;
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branches
  });
}); 

export const getAllBranchsWithQueries = catchAsync(async (req, res, next) => {
  const settingObj = await findOne(setting);
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  const filters = req.query;
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  let branchArray = [];

  if (filters.order_type && filters.order_type == 'delivery') {
    orAttributes.push({order_type: {[Op.in]: ['delivery', 'both']}});
  }else if (filters.order_type == 'pickup') {
    orAttributes.push({order_type: {[Op.in]: ['pickup', 'both']}});
  }
  
  if (filters.vertical) {
    orAttributes.push({branch_type: filters.vertical});
  }
  if (filters.is_free_delivery) {
    orAttributes.push({is_free_delivery: filters.is_free_delivery});
  }

  if (filters.is_offer_available) {
    orAttributes.push({is_offer_available: filters.is_offer_available});
  }
  if (filters.is_online_payment) {
    orAttributes.push({is_online_payment: filters.is_online_payment});
  }
  if (filters.is_donation) {
    orAttributes.push({is_donation: filters.is_donation});
  }
  if (filters.average_cost) {
    orAttributes.push({average_cost: filters.average_cost});
  }
  
  if (filters.category) {
    filters.category = filters.category.split(',');
    orAttributes.push({category_id: { [Op.contains]: filters.category }});
  }
  if (filters.cuisines) {
    filters.cuisines = filters.cuisines.split(',');
    orAttributes.push({cuisine_id: { [Op.contains]: filters.cuisines }});
  }
  if (filters.query) {
    const branchesWithItems = await findAllBranchesByItem(item, {name: {[Op.like]: "%"+filters.query+"%"}});
    branchArray = branchesWithItems.map( (obj) => {
      return obj.branch_id;
    });
    if (branchArray.length > 0) {
      andAttributes.push({id: branchArray});
    }else{
      andAttributes.push({name: {
        [Op.or]: [{[Op.like]: "%"+filters.query+"%"}, {[Op.like]: "%"+filters.query.toLowerCase()+"%"}]
      }});
    }
  }

  
  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let branches = await findAllFilter(branch, where);
  for (let index = 0; index < branches.length; index++) {
    const element = branches[index];
    var origins = [req.query.lat+','+req.query.lng];
    var destinations = [element.map_latitude+','+element.map_longitude];
    if (element.is_hasDiscount) {
      var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: element.id});
      element.discount = restaurantDiscount;
    }
    if (element.is_hasVoucher == 1) {
      var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: element.id});
      element.voucher = restaurantVoucher;
    }
    var ratingObj = await findAllRating(ordered_restaurant, {branch_id: element.id});
    var reviews = await findAllReview(review, {branch_id: element.id});
    var favourites = await findAllRating(ordered_restaurant, {branch_id: element.id, is_favourite: 1});
    element.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
    element.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
    element.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
    let distanceObj = await getBranchDistanceById(origins, destinations);
    let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
    let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
    if (distanceArray.length > 0) {
      element.deliverDistance = parseFloat(distanceArray[0]);
      element.deliverDistanceUnit = distanceArray[1];
    }else{
      element.deliverDistance = 0;
      element.deliverDistanceUnit = 'km';
    }
    if (distanceTimeArray.length > 0) {
      element.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(element.preparation_time);
      element.deliverTimeUnit = distanceTimeArray[1];
    }else{
      element.deliverTime = 0;
      element.deliverTimeUnit = 'mins';
    }
    element.deliverFee = (element.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((element.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
    branches[index] = element;
  }
  if (filters.query) {
    const [searchLog, created] = await findOrCreateSearch(customer_search_log, {search_content: filters.query});

  }
  if (filters.sort) {
    switch (filters.sort) {
      case 'distance_asc':
      branches = _.orderBy(branches, ['deliverDistance'], ['asc']);       
      break;
      case 'rating_desc':
      branches = _.orderBy(branches, ['rating'], ['desc']);       
      break;
      case 'delivery_time_asc':
      branches = _.orderBy(branches, ['deliverTime'], ['asc']);       
      break;
    }
  }
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: branches
  });
});

export const getBranchById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByBranchId(branch, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Branch not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createBranch = catchAsync(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const phone = req.body.phone;
  const [branchObj, created] = await findOrCreate(branch, {
    ...req.body,
    email,
    phone
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Branch already exist"
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Branch created successfully",
    payload: _.omit(branchObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateBranch = catchAsync(async (req, res, next) => {
  const id = req.query.id;

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

  const resultData = await findByPk(branch, id);

  return res.status(201).json({
    status: "success",
    message: "Branch updated successfully",
    statusCode: 200,
    payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
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

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Branch deleted successfully"
  });
});

export const getAllBranchsForCustomer = catchAsync(async (req, res, next) => {
  const settingObj = await findOne(setting);
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  var searchFlag = false;
  const payload = {
    allCampaigns: [],
    yourRestaurant: [],
    recommendedRestaurant: [],
    allCuisines: [],
    allPromotions: [],
    allFilteredRestaurant: []
  }
  const filters = req.query;
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  let branchArray = [];

  if (filters.expedition && filters.expedition == 'delivery') {
    orAttributes.push({order_type: {[Op.in]: ['delivery', 'both']}});
  }else if (filters.expedition == 'pickup') {
    orAttributes.push({order_type: {[Op.in]: ['pickup', 'both']}});
  }
  
  if (filters.vertical) {
    orAttributes.push({branch_type: filters.vertical});
  }
  if (filters.is_free_delivery) {
    orAttributes.push({is_free_delivery: filters.is_free_delivery});
    searchFlag = true;
  }

  if (filters.is_offer_available) {
    orAttributes.push({is_offer_available: filters.is_offer_available});
    searchFlag = true;
  }
  if (filters.is_online_payment) {
    orAttributes.push({is_online_payment: filters.is_online_payment});
    searchFlag = true;
  }
  if (filters.is_donation) {
    orAttributes.push({is_donation: filters.is_donation});
    searchFlag = true;
  }
  if (filters.average_cost) {
    orAttributes.push({average_cost: filters.average_cost});
    searchFlag = true;
  }
  if (filters.category) {
    filters.category = filters.category.split(',');
    orAttributes.push({category_id: { [Op.contains]: filters.category }});
    searchFlag = true;
  }
  if (filters.cuisines) {
    filters.cuisines = filters.cuisines.split(',');
    orAttributes.push({cuisine_id: { [Op.contains]: filters.cuisines }});
    searchFlag = true;
  }

  if (filters.query) {
    const branchesWithItems = await findAllBranchesByItem(item, {name: {[Op.like]: "%"+filters.query+"%"}});
    branchArray = branchesWithItems.map( (obj) => {
      return obj.branch_id;
    });
    if (branchArray.length > 0) {
      andAttributes.push({id: branchArray});
    }else{
      andAttributes.push({name: {
        [Op.or]: [{[Op.like]: "%"+filters.query+"%"}, {[Op.like]: "%"+filters.query.toLowerCase()+"%"}]
      }});
    }
  }
  console.log(filters);
  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };

  //To Get All Restaurants with filter
  let branches = await findAllFilter(branch, where);
  for (let index = 0; index < branches.length; index++) {
    let element = branches[index];
    var origins = [req.query.lat+','+req.query.lng];
    var destinations = [element.map_latitude+','+element.map_longitude];
    var cuisines = [];

    for (let index = 0; index < element.cuisine_id.length; index++) {
      let elementValue = element.cuisine_id[index];
      var cuisineObj = await cuisineService.findByPk(cuisine, elementValue);
      cuisines.push(_.omit(cuisineObj));
    }
    if (element.is_hasDiscount) {
      var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: element.id});
      if (restaurantDiscount) {
        element.discount = restaurantDiscount.discount;
      }else{
        element.discount = {};
      }
    }
    if (element.is_hasVoucher == 1) {
      var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: element.id});
      element.voucher = restaurantVoucher;
    }
    var ratingObj = await findAllRating(ordered_restaurant, {branch_id: element.id});
    var reviews = await findAllReview(review, {branch_id: element.id});
    var favourites = await findAllRating(ordered_restaurant, {branch_id: element.id, is_favourite: 1});
    element.cuisine = (cuisines.length > 0) ? cuisines[0] : [];
    element.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
    element.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
    element.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
    let distanceObj = await getBranchDistanceById(origins, destinations);
    let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
    let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
    if (distanceArray.length > 0) {
      element.deliverDistance = parseFloat(distanceArray[0]);
      element.deliverDistanceUnit = distanceArray[1];
    }else{
      element.deliverDistance = 0;
      element.deliverDistanceUnit = 'km';
    }
    if (distanceTimeArray.length > 0) {
      element.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(element.preparation_time);
      element.deliverTimeUnit = distanceTimeArray[1];
    }else{
      element.deliverTime = 0;
      element.deliverTimeUnit = 'mins';
    }
    element.deliverFee = (element.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((element.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
    branches[index] = element;
  }

  //To Get All Cuisines with restaurant count
  let cuisineObjs = await findAllCuisine(cuisine);

  for (let index = 0; index < cuisineObjs.length; index++) {
    let elementCuisine = cuisineObjs[index];
    cuisineObjs[index].totalbranches = (await findAllBranch(branch, {cuisine_id: { [Op.contains]: [elementCuisine.id] }})).length;
  }

  //To Get All Campaigns
  let campaignObjs = await campaignService.findAll(campaign, {status: 1, is_active: 1, is_showonfront: 1});

  //To Get All Promotions with restaurants
  let promotions = await promotionService.findAll(promotion, {status: 1});
  for (let index = 0; index < promotions.length; index++) {
    let elementPromotion = promotions[index];
    var restaurant_promotions = await promotionService.findAll(restaurant_promotion, {promotion_id: elementPromotion.id});
    let promotionBranches = []
    let cuisines = [];
    for (let rindex = 0; rindex < restaurant_promotions.length; rindex++) {
      let restaurant_promotion = restaurant_promotions[rindex];
      let promotionBranchObj = await commonService.findWithModelAndFilter(branch, {id: restaurant_promotion.branch_id});
      let origins = [req.query.lat+','+req.query.lng];
      let destinations = [promotionBranchObj.map_latitude+','+promotionBranchObj.map_longitude];
      if (promotionBranchObj.is_hasVoucher == 1) {
        let restaurantVoucher = await findVoucherBranch(voucher, {branch_id: restaurant_promotion.branch_id});
        promotionBranchObj.voucher = restaurantVoucher;
      }

      for (let index = 0; index < promotionBranchObj.cuisine_id.length; index++) {
        let elementValue = promotionBranchObj.cuisine_id[index];
        let cuisineObj = await commonService.findWithModelAndFilter(cuisine, {id: elementValue});
        cuisines.push(cuisineObj);
      }
      let ratingObj = await commonService.findWithModelAndFilter(ordered_restaurant, {branch_id: restaurant_promotion.branch_id});
      let reviews = await commonService.findAllWithModelAndFilter(review, {branch_id: restaurant_promotion.branch_id});
      let favourites = await findAllRating(ordered_restaurant, {branch_id: restaurant_promotion.branch_id, is_favourite: 1});
      promotionBranchObj.cuisine = (cuisines.length > 0) ? cuisines[0] : [];
      promotionBranchObj.rating = ratingObj ? ratingObj.avg_rating : 0;
      promotionBranchObj.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
      promotionBranchObj.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
      let distanceObj = await getBranchDistanceById(origins, destinations);
      let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
      let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
      if (distanceArray.length > 0) {
        promotionBranchObj.deliverDistance = parseFloat(distanceArray[0]);
        promotionBranchObj.deliverDistanceUnit = distanceArray[1];
      }else{
        promotionBranchObj.deliverDistance = 0;
        promotionBranchObj.deliverDistanceUnit = 'km';
      }
      if (distanceTimeArray.length > 0) {
        promotionBranchObj.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(promotionBranchObj.preparation_time);
        promotionBranchObj.deliverTimeUnit = distanceTimeArray[1];
      }else{
        promotionBranchObj.deliverTime = 0;
        promotionBranchObj.deliverTimeUnit = 'mins';
      }
      promotionBranchObj.deliverFee = (promotionBranchObj.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((promotionBranchObj.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
      if (promotionBranchObj.is_hasDiscount) {
        let restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: restaurant_promotion.branch_id});
        promotionBranchObj.discount = restaurantDiscount.discount;
      }
      promotionBranches.push(promotionBranchObj);
    }
    promotions[index].restaurant_promotions = promotionBranches;
  }

  //To Get All Recommanded Restaurants with filter
  let recommendedBranches = await findAllFilterRecommended(branch, {is_recommended: 1});

  for (let index = 0; index < recommendedBranches.length; index++) {
    let recommendedElement = recommendedBranches[index];
    var origins = [req.query.lat+','+req.query.lng];
    var destinations = [recommendedElement.map_latitude+','+recommendedElement.map_longitude];
    if (recommendedElement.is_hasDiscount) {
      var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: recommendedElement.id});
      recommendedElement.discount = restaurantDiscount;
    }
    if (recommendedElement.is_hasVoucher == 1) {
      var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: recommendedElement.id});
      recommendedElement.voucher = restaurantVoucher;
    }
    let cuisines = [];

    for (let index = 0; index < recommendedElement.cuisine_id.length; index++) {
      let elementValue = recommendedElement.cuisine_id[index];
      let cuisineObj = await cuisineService.findByPk(cuisine, elementValue);
      cuisines.push(_.omit(cuisineObj));
    }
    var ratingObj = await findAllRating(ordered_restaurant, {branch_id: recommendedElement.id});
    var reviews = await findAllReview(review, {branch_id: recommendedElement.id});
    var favourites = await findAllRating(ordered_restaurant, {branch_id: recommendedElement.id, is_favourite: 1});
    recommendedElement.cuisine = (cuisines.length > 0) ? cuisines[0] : [];
    recommendedElement.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
    recommendedElement.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
    recommendedElement.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
    let distanceObj = await getBranchDistanceById(origins, destinations);
    let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
    let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
    if (distanceArray.length > 0) {
      recommendedElement.deliverDistance = parseFloat(distanceArray[0]);
      recommendedElement.deliverDistanceUnit = distanceArray[1];
    }else{
      recommendedElement.deliverDistance = 0;
      recommendedElement.deliverDistanceUnit = 'km';
    }
    if (distanceTimeArray.length > 0) {
      recommendedElement.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(recommendedElement.preparation_time);
      recommendedElement.deliverTimeUnit = distanceTimeArray[1];
    }else{
      recommendedElement.deliverTime = 0;
      recommendedElement.deliverTimeUnit = 'mins';
    }
    recommendedElement.deliverFee = (recommendedElement.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((recommendedElement.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
    recommendedBranches[index] = recommendedElement;
  }

  //To Get All Your Restaurant With Customer id
  let yourBranches = [];
  if (filters.customer_id) {
    let whereYour = {};
    
    let orderedRestaurantIds = await findByCustomerId(ordered_restaurant, filters.customer_id);
    let results = _.map(orderedRestaurantIds, branchId => {return parseInt(branchId.branch_id)});
    whereYour = {
      id: {
        [Op.in]: results
      }
    };
    
    yourBranches = await findAllFilter(branch, whereYour);
    for (let index = 0; index < yourBranches.length; index++) {
      let elementYour = yourBranches[index];
      var origins = [req.query.lat+','+req.query.lng];
      var destinations = [elementYour.map_latitude+','+elementYour.map_longitude];
      var cuisines = [];
  
      for (let index = 0; index < elementYour.cuisine_id.length; index++) {
        let elementValue = elementYour.cuisine_id[index];
        var cuisineObj = await cuisineService.findByPk(cuisine, elementValue);
        cuisines.push(_.omit(cuisineObj));
      }
      if (elementYour.is_hasDiscount) {
        var restaurantDiscount = await findByFilter(restaurant_discount, {branch_id: elementYour.id});
        elementYour.discount = restaurantDiscount;
      }
      if (elementYour.is_hasVoucher == 1) {
        var restaurantVoucher = await findVoucherBranch(voucher, {branch_id: elementYour.id});
        elementYour.voucher = restaurantVoucher;
      }
      var ratingObj = await findAllRating(ordered_restaurant, {branch_id: elementYour.id});
      var reviews = await findAllReview(review, {branch_id: elementYour.id});
      var favourites = await findAllRating(ordered_restaurant, {branch_id: elementYour.id, is_favourite: 1});
      elementYour.cuisine = (cuisines.length > 0) ? cuisines[0] : [];
      elementYour.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
      elementYour.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
      elementYour.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
      let distanceObj = await getBranchDistanceById(origins, destinations);
      let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
      let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
      if (distanceArray.length > 0) {
        elementYour.deliverDistance = parseFloat(distanceArray[0]);
        elementYour.deliverDistanceUnit = distanceArray[1];
      }else{
        elementYour.deliverDistance = 0;
        elementYour.deliverDistanceUnit = 'km';
      }
      if (distanceTimeArray.length > 0) {
        elementYour.deliverTime = parseFloat(distanceTimeArray[0])+parseInt(elementYour.preparation_time);
        elementYour.deliverTimeUnit = distanceTimeArray[1];
      }else{
        elementYour.deliverTime = 0;
        elementYour.deliverTimeUnit = 'mins';
      }
      elementYour.deliverFee = (elementYour.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((elementYour.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
      yourBranches[index] = elementYour;
    }
  }
  //Daily voucher
  let dailyVoucher = '';
  var compareDate = moment();
  let vouchersActive = await commonService.findAllWithModelAndFilter(voucher, {status: 1, is_forCustomer: 0, is_showOnTop: 1});
  let currentVouchers = _.filter(vouchersActive, (voucher) => {
    let startDate = moment(voucher.start_date), endDate = moment(voucher.end_date);
    if (compareDate.isBetween(startDate, endDate)) {
      return voucher;
    }
  });
  var time = moment();
  currentVouchers = _.filter(currentVouchers, (voucher) => {
    let beforeTime = moment(voucher.start_time, 'HH:mm:ss');
    let afterTime = moment(voucher.end_time, 'HH:mm:ss');
    if (time.isBetween(beforeTime, afterTime)) {
      return voucher;
    }
  });
  currentVouchers.map((voucher) => {
    dailyVoucher += voucher.description+' | ';
  });
  dailyVoucher += ' *T&C Apply';
  //Final payload for the filters
  if (!searchFlag) {
    payload.allCampaigns = (campaignObjs.length > 0) ? campaignObjs : [];
    payload.yourRestaurant = (yourBranches.length > 0) ? yourBranches : [];
    payload.recommendedRestaurant = (recommendedBranches.length > 0) ? recommendedBranches : [];
    payload.allPromotions = (promotions.length > 0) ? promotions : [];
    payload.allCuisines = (cuisineObjs.length > 0) ? cuisineObjs : [];
    payload.dailyVoucher = (dailyVoucher) ? dailyVoucher : null
  }
  if (filters.sort) {
    switch (filters.sort) {
      case 'distance_asc':
      branches = _.orderBy(branches, ['deliverDistance'], ['asc']);       
      break;
      case 'rating_desc':
      branches = _.orderBy(branches, ['rating'], ['desc']);       
      break;
      case 'delivery_time_asc':
      branches = _.orderBy(branches, ['deliverTime'], ['asc']);       
      break;
    }
  }
  payload.voucherText = dailyVoucher;
  payload.allFilteredRestaurant = (branches.length > 0) ? branches : [];
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: payload
  });
});




