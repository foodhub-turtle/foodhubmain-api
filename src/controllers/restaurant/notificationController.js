import _ from "lodash";
import Model from "../../models/index.js";
import { findAllNotification, findByPk, findOrCreate, update } from "../../services/notificationService.js";
import { findAllBranch, findByBranch, updateApprove } from "../../services/branchService.js";
import { findDiscountByBranch } from "../../services/discountService.js";
import { findCampaignByBranch } from "../../services/campaignService.js";
import { findPromotionByBranch } from "../../services/promotionService.js";
import catchAsync from "../../libs/catchAsync.js";
const fs = require("fs");
import { Op } from 'sequelize';

const { restaurant_notification, branch, discount, campaign, promotion, restaurant_discount, restaurant_campaign, restaurant_promotion } = Model;

export const getAllNotifications = catchAsync(async (req, res, next) => {
  var branch_id = req.query.id;
  let branchObj = await findByBranch(branch, {id: branch_id});

  console.log(branch_id);
  if (branchObj.is_mainBranch == 1) {
    
    let AllBranches = await findAllBranch(branch, {parent_id: branchObj.parent_id});
    let allBranchIds = AllBranches.map(branch => branch.id)
    let where2 = {};
    let orAttributes2 = [];
    let andAttributes2 = [];
    orAttributes2.push({status: {[Op.in]: [0, 1]}});
    andAttributes2.push({branch_id: {[Op.in]: allBranchIds}});
  
    where2 = {
      [Op.or]: orAttributes2,
      [Op.and]: andAttributes2
    };
    const notifications = await findAllNotification(restaurant_notification, where2);
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      console.log('branch',element.branch_id);
      element.branch = await findByBranch(branch, {id: element.branch_id});
      // element.branch = await findByBranch(branch, {id: element.branch_id});
  
      if (element.notification_table == 'discount') {
        element.notification = await findDiscountByBranch(discount, {id: element.notification_table_id});
      }
      if (element.notification_table == 'campaign') {
        element.notification = await findCampaignByBranch(campaign, {id: element.notification_table_id});
      }
      if (element.notification_table == 'promotion') {
        element.notification = await findPromotionByBranch(promotion, {id: element.notification_table_id});
      }
    }
    
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: notifications
    });
  }else{
    let where = {};
    let orAttributes = [];
    let andAttributes = [];
    orAttributes.push({status: {[Op.in]: [0, 1]}});
    andAttributes.push({branch_id: branch_id});

  
    where = {
      [Op.or]: orAttributes,
      [Op.and]: andAttributes
    };
    const notifications = await findAllNotification(restaurant_notification, where);
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      element.branch = await findByBranch(branch, {id: branch_id});
      // element.branch = await findByBranch(branch, {id: element.branch_id});
  
      if (element.notification_table == 'discount') {
        element.notification = await findDiscountByBranch(discount, {id: element.notification_table_id});
      }
      if (element.notification_table == 'campaign') {
        element.notification = await findCampaignByBranch(campaign, {id: element.notification_table_id});
      }
      if (element.notification_table == 'promotion') {
        element.notification = await findPromotionByBranch(promotion, {id: element.notification_table_id});
      }
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: notifications
    });
  }

});
export const approveNotification = catchAsync(async (req, res, next) => {
  var notificationId = req.body.id;
  var branch_id = req.body.branch_id;
  
  var notification = await findByPk(restaurant_notification, notificationId);
  console.log(notification);
  switch (notification.notification_table) {
    case 'discount':
      {
        let discountPayload = {
          branch_id: notification.branch_id,
          discount_id: notification.notification_table_id,
          status: 1
        };

        var restaurantDiscount = await findOrCreate(restaurant_discount, {
          ...discountPayload
        });
        await updateApprove(branch, {is_hasDiscount: 1}, branch_id);
      }
      break;
    case 'campaign':
      {
        let campaignPayload = {
          branch_id: notification.branch_id,
          campaign_id: notification.notification_table_id,
          status: 1
        };

        var restaurantCampaign = await findOrCreate(restaurant_campaign, {
          ...campaignPayload
        });
      }
      break;
    case 'promotion':
      {
        let promotionPayload = {
          branch_id: notification.branch_id,
          promotion_id: notification.notification_table_id,
          status: 1
        };

        var restaurantPromotion = await findOrCreate(restaurant_promotion, {
          ...promotionPayload
        });
      }
      break;
    default:
      break;
  }
  let notificationPayload = {
    status: 0,
    reject_status: 0
  };
  await update(restaurant_notification, {
    ...notificationPayload,
    notificationId
  });
  let branchObj = await findByBranch(branch, {id: branch_id});

  if (branchObj.is_mainBranch == 1) {
    
    let AllBranches = await findAllBranch(branch, {parent_id: branchObj.parent_id});
    let allBranchIds = AllBranches.map(branch => branch.id)
    let where2 = {};
    let orAttributes2 = [];
    let andAttributes2 = [];
    orAttributes2.push({status: {[Op.in]: [0, 1]}});
    andAttributes2.push({branch_id: {[Op.in]: allBranchIds}});
  
    where2 = {
      [Op.or]: orAttributes2,
      [Op.and]: andAttributes2
    };
    const notifications = await findAllNotification(restaurant_notification, where2);
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      console.log('branch',element.branch_id);
      element.branch = await findByBranch(branch, {id: element.branch_id});
      // element.branch = await findByBranch(branch, {id: element.branch_id});
  
      if (element.notification_table == 'discount') {
        element.notification = await findDiscountByBranch(discount, {id: element.notification_table_id});
      }
      if (element.notification_table == 'campaign') {
        element.notification = await findCampaignByBranch(campaign, {id: element.notification_table_id});
      }
      if (element.notification_table == 'promotion') {
        element.notification = await findPromotionByBranch(promotion, {id: element.notification_table_id});
      }
    }
    
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: notifications
    });
  }else{
    let where = {};
    let orAttributes = [];
    let andAttributes = [];
    orAttributes.push({status: {[Op.in]: [0, 1]}});
    andAttributes.push({branch_id: branch_id});

  
    where = {
      [Op.or]: orAttributes,
      [Op.and]: andAttributes
    };
    const notifications = await findAllNotification(restaurant_notification, where);
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      element.branch = await findByBranch(branch, {id: element.branch_id});
      // element.branch = await findByBranch(branch, {id: element.branch_id});
  
      if (element.notification_table == 'discount') {
        element.notification = await findDiscountByBranch(discount, {id: element.notification_table_id});
      }
      if (element.notification_table == 'campaign') {
        element.notification = await findCampaignByBranch(campaign, {id: element.notification_table_id});
      }
      if (element.notification_table == 'promotion') {
        element.notification = await findPromotionByBranch(promotion, {id: element.notification_table_id});
      }
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: notifications
    });
  }
});
export const rejectNotification = catchAsync(async (req, res, next) => {
  var notificationId = req.body.id;
  var branch_id = req.body.branch_id;
  
  var notification = await findByPk(restaurant_notification, notificationId);

  let notificationPayload = {
    status: 0,
    reject_status: 1
  };
  await update(restaurant_notification, {
    ...notificationPayload,
    notificationId
  });
  let branchObj = await findByBranch(branch, {id: branch_id});

  if (branchObj.is_mainBranch == 1) {
    
    let AllBranches = await findAllBranch(branch, {parent_id: branchObj.parent_id});
    let allBranchIds = AllBranches.map(branch => branch.id)
    let where2 = {};
    let orAttributes2 = [];
    let andAttributes2 = [];
    orAttributes2.push({status: {[Op.in]: [0, 1]}});
    andAttributes2.push({branch_id: {[Op.in]: allBranchIds}});
  
    where2 = {
      [Op.or]: orAttributes2,
      [Op.and]: andAttributes2
    };
    const notifications = await findAllNotification(restaurant_notification, where2);
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      console.log('branch',element.branch_id);
      element.branch = await findByBranch(branch, {id: element.branch_id});
      // element.branch = await findByBranch(branch, {id: element.branch_id});
  
      if (element.notification_table == 'discount') {
        element.notification = await findDiscountByBranch(discount, {id: element.notification_table_id});
      }
      if (element.notification_table == 'campaign') {
        element.notification = await findCampaignByBranch(campaign, {id: element.notification_table_id});
      }
      if (element.notification_table == 'promotion') {
        element.notification = await findPromotionByBranch(promotion, {id: element.notification_table_id});
      }
    }
    
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: notifications
    });
  }else{
    let where = {};
    let orAttributes = [];
    let andAttributes = [];
    orAttributes.push({status: {[Op.in]: [0, 1]}});
    andAttributes.push({branch_id: branch_id});

  
    where = {
      [Op.or]: orAttributes,
      [Op.and]: andAttributes
    };
    const notifications = await findAllNotification(restaurant_notification, where);
    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];
      element.branch = await findByBranch(branch, {id: element.branch_id});
      // element.branch = await findByBranch(branch, {id: element.branch_id});
  
      if (element.notification_table == 'discount') {
        element.notification = await findDiscountByBranch(discount, {id: element.notification_table_id});
      }
      if (element.notification_table == 'campaign') {
        element.notification = await findCampaignByBranch(campaign, {id: element.notification_table_id});
      }
      if (element.notification_table == 'promotion') {
        element.notification = await findPromotionByBranch(promotion, {id: element.notification_table_id});
      }
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: notifications
    });
  }
});

