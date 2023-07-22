import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { findAll, findAllBranchId, findAllBranchIdCustomer } from "../../services/dashboardService.js";
import { findByBranchId } from "../../services/branchService.js";
import moment from 'moment';
import { Op } from 'sequelize';

const { order, branch } = Model;

export const getDashboardDataByBranchId = catchAsync(async (req, res, next) => {
    let payload = {};
    const id = req.query.id;
    var month = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    var theMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");
    var d = new Date();
    var filteredData = [];
    var filteredRevenueData = [];
    var filteredmonth = [];
    let preperationTime = 0;
    let orderRejectionRate = 0;
    let customerConversionRate = 0;
    let todayOrders = 0;
    let todayCancelledOrders = 0;
    let offlineBranch = 0;
    let totalOrders = 0;
    let totalCancelledOrders = 0;
    let totalRevenue = 0;
    let orderSummuryMonthly = {};
    let RevenueSummuryMonthly = {};
    d.setDate(1);
    for (let i=0; i<=11; i++) {
        const startOfMonth = moment(d.getFullYear() + '-' + month[d.getMonth()]).clone().startOf('month').format('YYYY-MM-DD hh:mm');
        const endOfMonth   = moment(d.getFullYear() + '-' + month[d.getMonth()]).clone().endOf('month').format('YYYY-MM-DD hh:mm');
        let orders = await findAll(order, {
          branch_id: id, 
          order_datetime: {
              [Op.gte]: new Date(startOfMonth),
              [Op.lt]: new Date(endOfMonth)
            }
        });
        filteredmonth.push(theMonths[d.getMonth()]);
        filteredData.push(orders.length);
        if (orders && orders.length > 0) {
            filteredRevenueData.push(orders[0].total);
        }else{
            filteredRevenueData.push(0);
        }
        d.setMonth(d.getMonth() - 1);
    }
    let branchObj = await findByBranchId(branch, id);
    preperationTime = branchObj.preparation_time;

    let revenue = await findAll(order, {
        branch_id: id, 
    });
    let totalOrder = await findAllBranchId(order, {
        branch_id: id, 
    });
    let totalCancel = await findAllBranchId(order, {
        branch_id: id,
        order_status: 'rejected'
    });
    let totalcustomer = await findAllBranchIdCustomer(order, {
        branch_id: id,
    });
    // orderRejectionRate = (totalCancel.length != 0) ? (totalCancel.length * 100) / totalOrder.length : 0;
    orderRejectionRate = 10;
    customerConversionRate = totalcustomer.length;
    todayOrders = 10;
    todayCancelledOrders = 10;
    offlineBranch = 10;
    totalOrders = totalOrder.length;
    totalCancelledOrders = totalCancel.length;
    totalRevenue = revenue.length > 0 ? revenue[0].total : 0;
    orderSummuryMonthly = {
        months: filteredmonth,
        data: filteredData
    };
    RevenueSummuryMonthly = {
        months: filteredmonth,
        data: filteredRevenueData
    };

    payload = {
        preperationTime : preperationTime,
        orderRejectionRate : orderRejectionRate,
        customerConversionRate : customerConversionRate,
        todayOrders : todayOrders,
        todayCancelledOrders : todayCancelledOrders,
        offlineBranch : offlineBranch,
        totalOrders : totalOrders,
        totalCancelledOrders : totalCancelledOrders,
        totalRevenue : totalRevenue,
        orderSummuryMonthly : orderSummuryMonthly,
        RevenueSummuryMonthly : RevenueSummuryMonthly
    };
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: payload
    });
  });
