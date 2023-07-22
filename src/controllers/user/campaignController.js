import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, findByPk, update, deleteByPk, findAllRestaurantCampaign, findByUrl } from "../../services/campaignService.js";
import catchAsync from "../../libs/catchAsync.js";
import { findAllRating, findAllReview } from "../../services/branchService.js";
import { findByFilter } from "../../services/restaurantDiscountService.js";
const fs = require("fs");
import { findOne } from "../../services/settingsService.js";
import { findVoucherBranch } from "../../services/voucherService.js";
import { getBranchDistanceById } from "../../libs/googleMap.js";

const { campaign, restaurant_campaign, branch, review, ordered_restaurant, restaurant_discount, setting,voucher } = Model;

export const getAllCampaigns = catchAsync(async (req, res, next) => {
  const settingObj = await findOne(setting);
  const campaigns = await findAll(campaign, {status: 1, is_active: 1, is_showonfront: 1});
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  var origins = [req.query.lat+','+req.query.lng];

  for (let index = 0; index < campaigns.length; index++) {
    const element = campaigns[index];

    var restaurant_campaigns = await findAllRestaurantCampaign(restaurant_campaign, {campaign_id: element.id});
    for (let rindex = 0; rindex < restaurant_campaigns.length; rindex++) {
      const restaurant_campaign = restaurant_campaigns[rindex];
      var branchObj = await findByPk(branch, restaurant_campaign.branch_id);
      var destinations = [branchObj.map_latitude+','+branchObj.map_longitude];

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
      // if (!_.isEmpty(branchObj.image)) {
      //   branchObj.image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + branchObj.image, {encoding: 'base64'});
      // }
      restaurant_campaign.branch = branchObj;
    }
    campaigns[index].restaurant_campaigns = restaurant_campaigns;
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: campaigns
  });
});

export const getCampaignById = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const campaignObj = await findByPk(campaign, id);

  if (!campaignObj) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Campaign not found"
    });
  }
  
  // if (!_.isEmpty(campaignObj.image)) {
  //   campaignObj.image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + campaignObj.image, {encoding: 'base64'});
  // }
  // if (!_.isEmpty(campaignObj.banner_image)) {
  //   campaignObj.banner_image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + campaignObj.banner_image, {encoding: 'base64'});
  // }
  var restaurant_campaigns = await findAllRestaurantCampaign(restaurant_campaign, {campaign_id: campaignObj.id});
  for (let rindex = 0; rindex < restaurant_campaigns.length; rindex++) {
    const restaurantCampaignObj = restaurant_campaigns[rindex];
    var branchObj = await findByPk(branch, restaurantCampaignObj.branch_id);
    restaurantCampaignObj[rindex] = branchObj;
    console.log(restaurantCampaignObj);
  }
  campaignObj.restaurant_campaigns = restaurant_campaigns;
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: campaignObj
  });
});
export const getCampaignByURLKEY = catchAsync(async (req, res, next) => {
  const url_key = req.query.key;
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';
  const campaignObj = await findByUrl(campaign, {url_key: url_key});
  const settingObj = await findOne(setting);
  if (!campaignObj) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Campaign not found"
    });
  }
  
  // if (!_.isEmpty(campaignObj.image)) {
  //   campaignObj.image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + campaignObj.image, {encoding: 'base64'});
  // }
  // if (!_.isEmpty(campaignObj.banner_image)) {
  //   campaignObj.banner_image ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + campaignObj.banner_image, {encoding: 'base64'});
  // }
  var restaurant_campaigns = await findAllRestaurantCampaign(restaurant_campaign, {campaign_id: campaignObj.id});
  let campaignbranch = [];
  var origins = [req.query.lat+','+req.query.lng];
  for (let rindex = 0; rindex < restaurant_campaigns.length; rindex++) {
    const restaurantCampaignObj = restaurant_campaigns[rindex];
    var branchObj = await findByPk(branch, restaurantCampaignObj.branch_id);
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
    restaurantCampaignObj.branch = branchObj;
  }
  campaignObj.restaurant_campaigns = restaurant_campaigns;
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: campaignObj
  });
});

export const createCampaign = catchAsync(async (req, res, next) => {
//   const name = req.body.name.toLowerCase().charAt(0).toUpperCase() + req.body.name.slice(1);
    // if (!_.isEmpty(req.file)) {
    //     req.body.image = req.file.filename;
    // }
    // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
    //     req.body.image = req.files.image[0].filename;
    // }
    // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
    //     req.body.banner_image = req.files.banner_image[0].filename;
    // }
  const [campaignObj, created] = await findOrCreate(campaign, {
    ...req.body
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: "Campaign already exist"
    });
  }
  // if (!_.isEmpty(req.file)) {
  //   campaignObj.image = req.file.filename;
    
  //   fs.writeFileSync(
  //     __basedir + "/uploads" + req.file.originalname,
  //     campaignObj.image
  //   );
  //   const contents = fs.readFileSync(__basedir + "/uploads/" + campaignObj.image, {encoding: 'base64'});
  //   campaignObj.image = contents;  
  // }
  const branches = req.body.branch_ids;
  const result = _.omit(campaignObj.toJSON(), ["updatedAt", "createdAt"]);
  
  branches.forEach(async (value, index) => {
    console.log(value);
    let restaurantCampaignPayload = {
      campaign_id: result.id,
      branch_id: value.branch_id,
      status: 1
    };

    const restaurantCampaignObj = await create(restaurant_campaign, {
      ...restaurantCampaignPayload
    });
  });
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Campaign created successfully",
    payload: _.omit(campaignObj.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const updateCampaign = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
    //     req.body.image = req.files.image[0].filename;
    // }
    // if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
    //     req.body.banner_image = req.files.banner_image[0].filename;
    // }
    // if (!_.isEmpty(req.file)) {
    //     req.body.image = req.file.filename;
    // }
    const result = await update(campaign, {
        ...req.body,
        id,
        slug
    });

    if (!result[0]) {
        return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Campaign didn't updated"
        });
    }

    const resultData = await findByPk(campaign, id);
    // if (!_.isEmpty(req.file)) {
    //     resultData.image = req.file.filename;
        
    //     fs.writeFileSync(
    //     __basedir + "/uploads" + req.file.originalname,
    //     resultData.image
    //     );
    //     const contents = fs.readFileSync(__basedir + "/uploads/" + resultData.image, {encoding: 'base64'});
    //     resultData.image = contents;  
    // }

    return res.status(201).json({
        status: "success",
        message: "Campaign updated successfully",
        statusCode: 200,
        payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
    });
});

export const changeStatusCampaign = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(campaign, {
    ...req.body,
    id
  });

  if (!result) {
    return res.status(400).json({
      status: "fail",
      statusCode: 404,
      message: "Campaign didn't updated"
    });
  }

  const campaigns = await findAll(campaign);

  const results = _.map(campaigns, campaignObj => _.omit(campaignObj, ['updatedAt', 'createdAt']));


  return res.status(201).json({
    status: "success",
    message: "Campaign updated successfully",
    statusCode: 200,
    payload: results
  });
});
export const deleteCampaignById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(campaign, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Campaign not found"
    });
  }
  const campaigns = await findAll(campaign);

  const results = _.map(campaigns, campaignObj => _.omit(campaignObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Campaign deleted successfully",
    payload: results
  });
});

export const updateCampaignStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(campaign, {
      ...req.body,
      id
  });
  if (!result[0]) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Campaign not found"
      });
  }
  const resultData = await findByPk(campaign, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Campaign status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});