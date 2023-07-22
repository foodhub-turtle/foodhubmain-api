import _, { map } from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
import { createInvoice, findInvoiceDetails, updateById, findByPk, deleteByPk, findAll } from "../../services/invoiceService.js";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Op } from 'sequelize';

const { invoice } = Model;

export const getInvoicesWithBranch = catchAsync(async (req, res, next) => {
    const branch = req.query.id;
    var month = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    var theMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var d = new Date();
    var filteredData = [];
    d.setDate(1);
    for (let i=0; i<=11; i++) {
      const startOfMonth = moment(d.getFullYear() + '-' + month[d.getMonth()]).clone().startOf('month').format('YYYY-MM-DD hh:mm');
      const endOfMonth   = moment(d.getFullYear() + '-' + month[d.getMonth()]).clone().endOf('month').format('YYYY-MM-DD hh:mm');

      let invoices = await findAll(invoice, {
        branch_id: branch, 
        invoice_date: {
          [Op.gte]: new Date(startOfMonth),
          [Op.lt]: new Date(endOfMonth)
        }
      });

      let monthObj = {
        'month': theMonths[d.getMonth()] + " " + d.getFullYear(),
        'invoices': invoices
      };
      if (invoices && invoices.length > 0) {
        filteredData.push(monthObj);
      }

      d.setMonth(d.getMonth() - 1);
    }
    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      payload: filteredData
    });
  });
export const getInvoiceDetail = catchAsync(async (req, res, next) => {

  const invoiceDetails = await findInvoiceDetails(invoice, req.params.id);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: invoiceDetails
  });
});


