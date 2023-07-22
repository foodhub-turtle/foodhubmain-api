import _, {
  map
} from "lodash";
import Model from "../../models/index.js";
import {
  findAllByRestaurantId,
  findItemDetailsByRestaurantId,
  findOneMapping,
  findAllItemGroupMappingByItemMapId,
  findItemGroupByItemGroupId,
  findAllByCategoryId,
  findAllPopular,
  findBranchItemFilter,
  findByFilter,
  findAllItemVariants,
  findBoughtTogether
} from "../../services/itemService.js";
// import { findByPk } from "../../services/restaurantService.js";
import catchAsync from "../../libs/catchAsync.js";
import {
  findAll,
  findAllFilter,
  findOrCreate,
  findByPk,
  update,
  deleteByPk,
  findByBranchId,
  findAllReview,
  findAllRating,
  findCustomerRating
} from "../../services/branchService.js";
// import { findAllCuisine } from "../../services/cuisineService.js";
import {
  findById
} from "../../services/categoryService.js";
const cuisineService = require("../../services/cuisineService.js");
const {
  findItemMapByItemId,
  findItemMapByFilter
} = require("../../services/itemMappingService.js");
const {
  findAllItemGroups
} = require("../../services/itemGroupService.js");
const {
  findByItemGroupId
} = require("../../services/ingredientMappingService");
const {
  findIngredientByPk
} = require("../../services/ingredientService");
const fs = require("fs");
var distance = require('google-distance-matrix');
import {
  findOne
} from "../../services/settingsService.js";
const commonService = require("../../services/commonService.js");

import {
  Op
} from 'sequelize';
import {
  getBranchDistanceById
} from "../../libs/googleMap.js";
import moment from "moment";


const {
  item,
  branch,
  item_category,
  cuisine,
  restaurant_discount,
  review,
  ordered_restaurant,
  item_variant,
  item_group_mapping,
  item_mapping,
  item_group,
  ingredient_mapping,
  ingredient,
  customer,
  setting,
  voucher
} = Model;

export const getAllItemsByRestaurantId = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  req.query.lat = '23.79962796';
  req.query.lng = '90.3810735';

  const settingObj = await findOne(setting);

  var result = await findByBranchId(branch, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Branch not found"
    });
  }
  var origins = [req.query.lat + ',' + req.query.lng];
  var destinations = [result.map_latitude + ',' + result.map_longitude];
  console.log('lat-lng', req.query.lat, req.query.lng, distance);

  result = _.omit(result.toJSON(), ['updatedAt', 'createdAt']);
  if (result.is_hasDiscount) {
    var restaurantDiscount = await findByFilter(restaurant_discount, {
      branch_id: result.id
    });
    result.discount = restaurantDiscount;
  }
  var categories = [];
  var cuisines = [];
  for (let index = 0; index < result.cuisine_id.length; index++) {
    const element = result.cuisine_id[index];
    var cuisineObj = await cuisineService.findByPk(cuisine, element);
    cuisines.push(_.omit(cuisineObj));
  }
  for (let index = 0; index < result.category_id.length; index++) {
    const element = result.category_id[index];
    var category = await findById(item_category, element);
    var items = await findAllByCategoryId(item_mapping, {
      category_id: category.id,
      branch_id: result.id,
      status: 1
    });
    var itemsArray = [];
    for (let indexItem = 0; indexItem < items.length; indexItem++) {
      const elementItem = items[indexItem];
      let itemObj = await findItemDetailsByRestaurantId(item, {
        id: elementItem.item_id
      });
      if (!_.isEmpty(elementItem.image)) {
        itemObj.image = elementItem.image;
      }
      if (!_.isEmpty(elementItem.description)) {
        itemObj.description = elementItem.description;
      }
      itemsArray.push(itemObj);
    }
    if (itemsArray.length > 0) {
      category.items = itemsArray;
      categories.push(_.omit(category));
    }
  }
  var popularItems = await findAllPopular(item, result.id);
  var ratingObj = await findAllRating(ordered_restaurant, {
    branch_id: result.id
  });
  var reviews = await findAllReview(review, {
    branch_id: result.id
  });
  var favourites = await findAllRating(ordered_restaurant, {
    branch_id: result.id,
    is_favourite: 1
  });
  result.rating = reviews.length > 0 ? _.meanBy(reviews, (p) => p.rating) : 0;
  result.ratingTotalCustomer = reviews.length > 0 ? reviews.length : 0;
  result.favouriteTotalCustomer = favourites.length > 0 ? favourites.length : 0;
  let distanceObj = await getBranchDistanceById(origins, destinations);
  let distanceArray = distanceObj.branchDistance.distance.text.split(" ");
  let distanceTimeArray = distanceObj.branchDistance.duration.text.split(" ");
  if (distanceArray.length > 0) {
    result.deliverDistance = parseFloat(distanceArray[0]);
    result.deliverDistanceUnit = distanceArray[1];
  } else {
    result.deliverDistance = 0;
    result.deliverDistanceUnit = 'km';
  }
  if (distanceTimeArray.length > 0) {
    result.deliverTime = parseFloat(distanceTimeArray[0]) + parseInt(result.preparation_time);
    result.deliverTimeUnit = distanceTimeArray[1];
  } else {
    result.deliverTime = 0;
    result.deliverTimeUnit = 'mins';
  }
  result.deliverFee = (result.deliverDistance > settingObj.min_distance_min_fee) ? Math.round(settingObj.min_delivery_fee + ((result.deliverDistance - settingObj.min_distance_min_fee) * settingObj.fee_per_km)) : Math.round(settingObj.min_delivery_fee);
  for (let reviewindex = 0; reviewindex < reviews.length; reviewindex++) {
    const reviewelement = reviews[reviewindex];
    reviews[reviewindex].customer = await commonService.findWithModelAndFilter(customer, {
      id: reviewelement.customer_id
    })

  }
  result.reviews = _.map(reviews, reviewObj => _.omit(reviewObj, ['updatedAt', 'createdAt']));

  result['categories'] = _.map(categories, categoryObj => _.omit(categoryObj, ['updatedAt', 'createdAt']));
  result['cuisines'] = _.map(cuisines, cuisineObj => _.omit(cuisineObj, ['updatedAt', 'createdAt']));

  //Daily voucher
  let dailyVoucher = '';
  var compareDate = moment();
  let vouchersActive = await commonService.findAllWithModelAndFilter(voucher, {
    status: 1,
    is_forCustomer: 0,
    is_showOnTop: 1
  });
  let currentVouchers = _.filter(vouchersActive, (voucher) => {
    let startDate = moment(voucher.start_date),
      endDate = moment(voucher.end_date);
    if (compareDate.isBetween(startDate, endDate)) {
      return voucher;
    }
  });

  const time = moment();
  currentVouchers = _.filter(currentVouchers, (voucher) => {
    let beforeTime = moment(voucher.start_time, 'HH:mm:ss');
    let afterTime = moment(voucher.end_time, 'HH:mm:ss');
    if (time.isBetween(beforeTime, afterTime)) {
      return voucher;
    }
  });
  currentVouchers.map((voucher) => {
    dailyVoucher += voucher.description + ' | ';
  });
  dailyVoucher += ' *T&C Apply';
  result.voucherText = dailyVoucher;
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: result
  });
});
export const branchItemFilter = catchAsync(async (req, res, next) => {

  const filters = req.query;
  let where = {};
  let andAttributes = [];

  if (filters.name) {
    andAttributes.push({
      name: {
        [Op.or]: [{
          [Op.iLike]: "%" + filters.name + "%"
        }, {
          [Op.iLike]: "%" + filters.name.toLowerCase() + "%"
        }]
      }
    });
  }
  andAttributes.push({
    branch_id: filters.branch
  });
  andAttributes.push({
    status: 1
  });

  where = {
    [Op.and]: andAttributes
  };

  const items = await findBranchItemFilter(item, where);
  // const results = _.map(items, (itemObj) => {
  //   if (!_.isEmpty(itemObj.image)) {
  //     // console.log(itemObj);
  //     itemObj.image = fs.readFileSync(__basedir + "/uploads/" + itemObj.image, {encoding: 'base64'});
  //   }
  //   return itemObj;
  // });

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: items
  });
});
export const getItemByRestaurantId = catchAsync(async (req, res, next) => {
  let itemObj = await findItemDetailsByRestaurantId(item, {
    id: req.params.itemid
  });

  if (!itemObj) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item not found"
    });
  }
  itemObj = itemObj.toJSON();
  console.log(req.params.itemid);

  const itemMapping = await findItemMapByFilter(item_mapping, {
    item_id: itemObj.id,
    branch_id: req.params.restaurantid
  });
  if (!_.isEmpty(itemMapping.image)) {
    itemObj.image = itemMapping.image;
  }
  if (!_.isEmpty(itemMapping.description)) {
    itemObj.description = itemMapping.description;
  }
  if (itemMapping) {
    const itemMappingGroups = await findAllItemGroupMappingByItemMapId(item_group_mapping, {
      item_mapping_id: itemMapping.id,
      status: 1
    });
    for (let index = 0; index < itemMappingGroups.length; index++) {
      var element = itemMappingGroups[index];
      var item_groups = [];
      item_groups.push(await findAllItemGroups(item_group, {
        id: element.item_group_id
      }));
      for (let groupIndex = 0; groupIndex < item_groups.length; groupIndex++) {
        var elementGroup = item_groups[groupIndex];

        let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {
          item_group_id: elementGroup.id
        });
        for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
          const elementIngredient = ingredients_mappings[ingredientIndex];
          var ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
          elementIngredient.name = ingredientObj.name;
        }
        elementGroup.ingredients = ingredients_mappings;
      }
      itemMappingGroups[index].item_groups = item_groups;
    }


    itemObj.itemMappingGroups = itemMappingGroups;
  } else {
    itemObj.itemMappingGroups = [];
  }

  // const itemGroups = await findAllItemGroupsByItemId(item_group, {item});
  var branchObj = await findByBranchId(branch, req.params.restaurantid);

  itemObj.is_hasVariants = itemMapping.is_hasVariants;
  if (itemMapping.is_hasVariants) {
    itemObj.priceVariants = await findAllItemVariants(item_variant, {
      item_id: itemMapping.item_id,
      branch_id: itemMapping.branch_id
    });
  }
  if (branchObj.is_showboughttogether == 1) {
    itemObj.boughttogether = await findBoughtTogether(item_mapping, {
      branch_id: branchObj.id
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    payload: itemObj
  });
});