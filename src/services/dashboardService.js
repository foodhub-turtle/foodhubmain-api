import Sequelize from "sequelize";
export const findAll = (model, filter) => model.findAll({
    where: filter,
    attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('grand_total')), 'total']],
    group : ['branch_id'],
    raw:true, 
    nest: true
});
export const findAllBranchId = (model, filter) => model.findAll({
    where: filter,
    raw:true, 
    nest: true
});
export const findAllBranchIdCustomer = (model, filter) => model.findAll({
    where: filter,
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('customer_id')) ,'customer']],
    raw:true, 
    nest: true
});
export const findAllItem = (model, filter) => model.findAll({
    where: filter,
    attributes: {exclude: ['createdAt', 'updatedAt']},
    raw:true, 
    nest: true
});
export const findAllCustomers = (model, filter) => model.findAll({
    where: filter,
    attributes: {exclude: ['createdAt', 'updatedAt']},
    raw:true, 
    nest: true
});

