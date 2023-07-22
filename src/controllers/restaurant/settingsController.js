import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createSettings, updateById, findOne } from "../../services/settingsService.js";
const fs = require("fs");

const { setting } = Model;

export const getSettings = catchAsync(async (req, res, next) => {
    const settingObj = await findOne(setting);

    return res.status(200).json({
        status: "success", 
        statusCode: 200,
        payload: settingObj
    });
});