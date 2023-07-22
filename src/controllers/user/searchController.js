import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { findAll, findAllSavedSearch } from "../../services/searchService.js";
import { Op } from 'sequelize';
const commonService = require("../../services/commonService");

const { customer_search_log } = Model;

export const getPopularSearch = catchAsync(async (req, res, next) => {
    const query = req.query.q;
    let where = {};
    let orAttributes = [];
    let andAttributes = [];

    if (query) {
      andAttributes.push({search_content: {
        [Op.or]: [{[Op.like]: "%"+query+"%"}, {[Op.like]: "%"+query.toLowerCase()+"%"}]
      }});
    } else {
      andAttributes.push({search_content: ''});
    }
    
    // orAttributes.push({createdAt: {[Op.not]: null}});

    where = {
      [Op.and]: andAttributes
    };
    const searchResults = await commonService.findAllWithModelAndFilter(customer_search_log, where);
    
  
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: searchResults
    });
  });
export const getSavedPopularSearch = catchAsync(async (req, res, next) => {
    const searchResults = await findAllSavedSearch(customer_search_log);
  
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: searchResults
    });
  });
