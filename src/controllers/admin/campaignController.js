import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, createCampaignObj, findByPk, update, updateCampaignObj, deleteByPk, create, findAllCampaigns } from "../../services/campaignService.js";
import catchAsync from "../../libs/catchAsync.js";
import { updateRestaurantNotification, findAllFilter } from "../../services/restaurantNotificationService.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
const fs = require("fs");
import { updateBranch, findAllBranch } from "../../services/branchService.js";
import { Op } from 'sequelize';
const { campaign, branch, restaurant_notification } = Model;
import { uploadImage } from "../../libs/globalUpload";

export const getAllCampaigns = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  if (searchTerm.title) {
    andAttributes.push({title: {
      [Op.or]: [{[Op.like]: "%"+searchTerm.title+"%"}, {[Op.like]: "%"+searchTerm.title.toLowerCase()+"%"}]
    }});
  }
  if (searchTerm.is_all_branch) {
    andAttributes.push({is_all_branch: searchTerm.is_all_branch});
  }

  if (searchTerm.status) {
    andAttributes.push({status: parseInt(searchTerm.status)});
  }else{
    orAttributes.push({status: {[Op.in]: [0, 1]}});
  }

  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  let campaigns = await findAllCampaigns(campaign, where, limit, offset);

  for (let index = 0; index < campaigns.rows.length; index++) {
    const element = campaigns.rows[index];
    if (element.is_all_branch == 0) {
      campaigns.rows[index].branches = await findAllFilter(restaurant_notification, {notification_table: 'campaign', notification_table_id: element.id});
    }
  }
  campaigns = getPaginationData(campaigns, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: campaigns
  });
});

export const getCampaignById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(campaign, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Campaign not found"
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

export const createCampaign = catchAsync(async (req, res, next) => {
    console.log(req.body);
    let ids = [];
    if (req.body.is_all_branch == '0'){
      req.body.branch_ids.split(',').forEach(branch => {
        ids.push(parseInt(branch));
      });
    }
    if (!_.isEmpty(req.file)) {
      req.body.image = await uploadImage(req.file);
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
      req.body.image = await uploadImage(req.files.image[0]);
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
        req.body.banner_image = await uploadImage(req.files.banner_image[0]);
    }
    let payload = {
      title: req.body.title,
      url_key: req.body.title.toLowerCase().replace(/ /g, "_"),
      description: req.body.description,
      image: req.body.image,
      banner_image: req.body.banner_image,
      priority: req.body.priority,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      is_all_branch: req.body.is_all_branch,
      is_showonfront: req.body.is_showonfront,
      voucher_campaign: req.body.voucher_campaign,
      status: req.body.status,
      created_by: req.body.created_by
    }
    if (req.body.is_all_branch == '0'){
      payload.branch_ids = ids;
    }
    if (req.body.voucher_campaign == 1){
      payload.voucher_campaign_id = req.body.voucher_campaign_id;
    }else{
      payload.voucher_campaign_id = 0;
    }
    const newCampaign = await createCampaignObj(campaign, {
      ...payload
    }); 
    let campaignObj = newCampaign.toJSON();
  
    let branches;
    let where;
    if (req.body.is_all_branch == '1') {
      where = {status: 1};
      branches = await findAllBranch(branch, where);
    }else if (req.body.is_all_branch == '0'){
      where = {
        id: {
          [Op.in]: ids
        },
        status: 1
      };
      branches = await findAllBranch(branch, where);
    }
    for (let index = 0; index < branches.length; index++) {
      const element = branches[index];
      let branch_id = element.id;
      let notification_table_id = campaignObj.id;
      let payload = {
        branch_id: branch_id,
        notification_table: 'campaign',
        notification_table_id: notification_table_id,
        status: 1
      };
  
      const result = await updateRestaurantNotification(restaurant_notification, {
        ...payload,
        branch_id,
        notification_table_id
      });
    }
    
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Campaign created successfully",
    payload: campaignObj
  });
});

export const updateCampaign = catchAsync(async (req, res, next) => {
    const id = req.query.id;
    if (!_.isEmpty(req.file)) {
      req.body.image = await uploadImage(req.file);
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.image[0])) {
      req.body.image = await uploadImage(req.files.image[0]);
    }
    if (!_.isEmpty(req.files) && !_.isEmpty(req.files.banner_image[0])) {
        req.body.banner_image = await uploadImage(req.files.banner_image[0]);
    }
    let payload = {
      title: req.body.title,
      url_key: req.body.title.toLowerCase().replace(/ /g, "_"),
      description: req.body.description,
      image: req.body.image,
      banner_image: req.body.banner_image,
      priority: req.body.priority,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      is_all_branch: req.body.is_all_branch,
      is_showonfront: req.body.is_showonfront,
      voucher_campaign: req.body.voucher_campaign,
      status: req.body.status,
      created_by: req.body.created_by
    }
    let ids = [];
    if (req.body.is_all_branch == '0' || req.body.is_all_branch == 0){
      req.body.branch_ids.split(',').forEach(branch => {
        ids.push(parseInt(branch));
      });
      payload.branch_ids = ids;
    }
    console.log('branches', ids);
    if (req.body.voucher_campaign == 1){
      payload.voucher_campaign_id = req.body.voucher_campaign_id;
    }else{
      payload.voucher_campaign_id = 0;
    }
    const result = await updateCampaignObj(campaign, {
        ...payload}, id);

    if (!result[0]) {
        return res.status(400).json({
        status: "fail",
        statusCode: 404,
        message: "Campaign didn't updated"
        });
    }
    console.log(req.body);

    const resultData = await findByPk(campaign, id);

    return res.status(201).json({
        status: "success",
        message: "Campaign updated successfully",
        statusCode: 200,
        payload: resultData
    });
});

export const changeStatusCampaign = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  let payload = {};
  payload.created_by = req.body.created_by;
  if(req.body.is_all_branch != -1 || req.body.is_all_branch != ''){
    payload.is_all_branch = req.body.is_all_branch;
  }
  if(req.body.status != -1){
    payload.status = req.body.status;
  }
  console.log('payload', payload, req.body);
  const result = await updateCampaignObj(campaign, {
    ...payload}, 
    id
  );

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