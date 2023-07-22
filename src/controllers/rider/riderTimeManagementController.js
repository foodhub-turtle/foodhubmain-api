import _ from "lodash";
import Model from "../../models/index.js";
const commonService = require("../../services/commonService");
import { Op } from 'sequelize';
const fs = require("fs");
import catchAsync from "../../libs/catchAsync.js";

const { area, work_time } = Model;

export const getAllTimeByArea = catchAsync(async (req, res, next) => {
    let id = req.query.id;
    const riderObj = await commonService.findWithModelAndFilter(rider, {id: id});
    if(!riderObj) {
      return res.status(404).json({
        status: "failed",
        message: "Rider not found" ,
        statusCode: 404
      });
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: riderObj
    });
});