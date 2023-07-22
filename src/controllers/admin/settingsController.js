import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createSettings, updateById, findOne } from "../../services/settingsService.js";
const fs = require("fs");

const { setting } = Model;

export const getSettings = catchAsync(async (req, res, next) => {
    const settingObj = await findOne(setting);
    // if (!_.isEmpty(settingObj.site_logo)) {
    //     settingObj.site_logo ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + settingObj.site_logo, {encoding: 'base64'});
    // }
    // if (!_.isEmpty(settingObj.site_logo_tablet)) {
    //     settingObj.site_logo_tablet ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + settingObj.site_logo_tablet, {encoding: 'base64'});
    // }
    // if (!_.isEmpty(settingObj.site_logo_mobile)) {
    //     settingObj.site_logo_mobile ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + settingObj.site_logo_mobile, {encoding: 'base64'});
    // }
    // if (!_.isEmpty(settingObj.site_fav_icon)) {
    //     settingObj.site_fav_icon ='data:image/jpeg;base64,'+fs.readFileSync(__basedir + "/uploads/" + settingObj.site_fav_icon, {encoding: 'base64'});
    // }
    return res.status(200).json({
        status: "success", 
        statusCode: 200,
        payload: settingObj
    });
});

export const updateSettings = catchAsync(async (req, res, next) => {
    const settingObj = await findOne(setting);

    if (_.isEmpty(settingObj)) {
        console.log(req.body);
        const result = await createSettings(setting, {...req.body});

        return res.status(200).json({
            status: "success", 
            statusCode: 200,
            payload: result
        });
    }else{
    console.log(req.files);
        
        console.log(req.body);
        if (!_.isEmpty(req.files) && !_.isEmpty(req.files.site_logo[0])) {
            req.body.site_logo = req.files.site_logo[0].filename;
        }
        if (!_.isEmpty(req.files) && !_.isEmpty(req.files.site_logo_tablet[0])) {
            req.body.site_logo_tablet = req.files.site_logo_tablet[0].filename;
        }
        if (!_.isEmpty(req.files) && !_.isEmpty(req.files.site_logo_mobile[0])) {
            req.body.site_logo_mobile = req.files.site_logo_mobile[0].filename;
        }
        if (!_.isEmpty(req.files) && !_.isEmpty(req.files.site_fav_icon[0])) {
            req.body.site_fav_icon = req.files.site_fav_icon[0].filename;
        }
        const result = await updateById(setting, settingObj.id,req.body);
        const updatedSetting = await findOne(setting);
        return res.status(200).json({
            status: "success", 
            statusCode: 200,
            payload: updatedSetting
        });
    }
});