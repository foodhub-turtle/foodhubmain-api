import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { Op } from 'sequelize';
import { getBranchDistanceById } from "../../libs/googleMap.js";
const commonService = require("../../services/commonService.js");

const { setting, foodhubboxsetting, foodhubboxbranch, restaurant_discount, voucher, ordered_restaurant, review, branch } = Model;

export const getFoodhubBoxBranches = catchAsync(async (req, res, next) => {
    let settingObj = await commonService.findWithModelAndFilter(setting);
    let allDiscounts = await commonService.findAllWithModel(foodhubboxsetting);
    let allBranches = await commonService.findAllWithModel(foodhubboxbranch);
    for (let index = 0; index < allBranches.length; index++) {
      const element = await commonService.findWithModelAndFilter(branch, {id: allBranches[index].branch_id});;
      var origins = [req.query.lat+','+req.query.lng];
      var destinations = [element.map_latitude+','+element.map_longitude];
      if (element.is_hasDiscount) {
        var restaurantDiscount = await commonService.findWithModelAndFilter(restaurant_discount, {branch_id: element.id});
        element.discount = restaurantDiscount;
      }
      if (element.is_hasVoucher == 1) {
        var restaurantVoucher = await commonService.findWithModelAndFilter(voucher, {branch_id: element.id});
        element.voucher = restaurantVoucher;
      }
      var ratingObj = await commonService.findAllWithModelAndFilter(ordered_restaurant, {branch_id: element.id});
      var reviews = await commonService.findAllWithModelAndFilter(review, {branch_id: element.id});
      var favourites = await commonService.findAllWithModelAndFilter(ordered_restaurant, {branch_id: element.id, is_favourite: 1});
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
      allBranches[index].branch = element;
    }
    settingObj = _.pick(settingObj, ['foodhub_box_time_limit', 'foodhub_box_branch_limit']);
    let responsPayload = {
      foodhub_box_setting: settingObj,
      foodhub_box_discounts: allDiscounts,
      foodhub_box_branches: allBranches.length > 0 ? _.sortBy(_.slice(allBranches, 0, 15), ['priority']) : []
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: responsPayload
    });
});