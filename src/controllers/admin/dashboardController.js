import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { findAll, findAllBranchId, findAllBranchIdCustomer, findAllItem, findAllCustomers } from "../../services/dashboardService.js";
import { findByBranchId } from "../../services/branchService.js";
import moment from 'moment';
import { Op } from 'sequelize';
import Sequelize from "sequelize";
const commonService = require("../../services/commonService.js");

const { order, item, customer, branch } = Model;

export const getDashboardDataByBranchId = catchAsync(async (req, res, next) => {
    let payload = {};
    var month = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    var theMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");
    var d = new Date();
    var filteredData = [];
    var filteredRevenueData = [];
    var filteredmonth = [];
    let orderRejectionRate = 0;
    let customerConversionRate = 0;
    let todayOrders = 0;
    let totalCustomers = 0;
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
          order_datetime: {
              [Op.gte]: new Date(startOfMonth),
              [Op.lt]: new Date(endOfMonth)
            },
            is_paid: 1,
            payment_status: 'success' 
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

    let revenue = await findAll(order, {
        is_paid: 1,
        payment_status: 'success' 
    });
    totalCustomers = await findAllCustomers(customer, {
        status: 1
    });
    let totalOrder = await findAllBranchId(order, {
        status: 1
    });
    let totalCancel = await findAllBranchId(order, {
        order_status: 'rejected'
    });
    let totalcustomer = await findAllBranchIdCustomer(order, {
        status: 1,
    });
    let totalBranch = await branch.count({
        where: {approve_status: 'approve', status: 1}
    });

    let totalItem = await findAllItem(item, {status: 1});
    console.log(totalBranch);
    // orderRejectionRate = (totalCancel.length != 0) ? (totalCancel.length * 100) / totalOrder.length : 0;
    orderRejectionRate = 10;
    customerConversionRate = totalcustomer.length;
    todayOrders = 10;
    todayCancelledOrders = 10;
    offlineBranch = 10;
    totalOrders = totalOrder.length;
    totalCancelledOrders = totalCancel.length;
    totalCustomers = totalCustomers.length;
    totalRevenue = revenue.length > 0 ? revenue[0].total : 0;
    orderSummuryMonthly = {
        months: filteredmonth,
        data: filteredData
    };
    RevenueSummuryMonthly = {
        months: filteredmonth,
        data: filteredRevenueData
    };
    let topCustomers = await commonService.findAllWithModelAndOptions(order, {
        where: {order_status: 'delivered'},
        attributes: ['customer_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
        raw:true,
        group: 'customer_id',
        nest: true
    });
    let limitCustomer = [];
    topCustomers = _.orderBy(topCustomers, ['total'], ['desc'])
    // let recentOrders = await commonService.findAllWithModelAndFilterAndOptions(order, {status: 1}, {limit: 5});
    for (let index = 0; index < 5; index++) {
        const element = topCustomers[index];
        let customerObj = await commonService.findWithModelAndOptions(customer, {
            where: {id: element.customer_id},
            attributes: { exclude: ['updatedAt'] },
            raw:true,
            nest: true
        });
        topCustomers[index].customer = customerObj;
        limitCustomer.push(topCustomers[index]);
    }
    payload = {
        orderRejectionRate : orderRejectionRate,
        customerConversionRate : customerConversionRate,
        todayOrders : todayOrders,
        todayCancelledOrders : todayCancelledOrders,
        offlineBranch : offlineBranch,
        totalOrders : totalOrders,
        totalCancelledOrders : totalCancelledOrders,
        totalRevenue : totalRevenue,
        totalCustomers: totalCustomers,
        orderSummuryMonthly : orderSummuryMonthly,
        RevenueSummuryMonthly : RevenueSummuryMonthly,
        totalItem: totalItem.length,
        totalBranch: totalBranch,
        topCustomers: limitCustomer
    };
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: payload
    });
  });
