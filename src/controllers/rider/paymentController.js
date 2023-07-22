import _ from "lodash";
import Model from "../../models/index.js";
const commonService = require("../../services/commonService");
import { Op } from 'sequelize';
const fs = require("fs");
import catchAsync from "../../libs/catchAsync.js";
const { startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek, format } = require('date-fns');

const { rider, order, rider_log, rider_taken_shift, rider_shift, work_time, rider_active_shift, area, rider_payment } = Model;


export const getRiderMonthlyPayments = catchAsync(async (req, res, next) => {
    // const riderId = req.query.id;
    
  
    // Determine the start and end dates of the given month
    const startDate = startOfMonth(new Date(2023, 6 - 1));
    const endDate = endOfMonth(new Date(2023, 6 - 1));

    // Determine the start and end dates of each week within the month
    let weekDates = eachWeekOfInterval({ start: startDate, end: endDate });
    let weekStartEndDates = weekDates.map((weekDate) => ({
        start: startOfWeek(weekDate),
        end: endOfWeek(weekDate)
    }));
    
    // Query the database using Sequelize to fetch data for each week's start and end dates
    for (let index = 0; index < weekStartEndDates.length; index++) {
        const week = weekStartEndDates[index];
        let weekData = await commonService.findAllWithModelAndOptions(rider_payment, {
            where: {
                payment_date: {
                    [Op.gte]: format(week.start, 'yyyy-MM-dd'),
                    [Op.lt]: format(week.end, 'yyyy-MM-dd')
                },
            },
        });
        console.log('asdasd',_.sumBy(weekData, 'amount'));
        weekStartEndDates[index].amount = _.sumBy(weekData, 'amount');
    }
    
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      data: weekStartEndDates
    });
});