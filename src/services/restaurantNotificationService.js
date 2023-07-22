//Admin Query start
export const findAllRestaurantNotifications = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['id', 'ASC']]
});
export const findAllFilter = (model, filter) => model.findAll({
  where: filter,
  include: [
    {
      association: "branch",
      raw: true,
    }
  ],
  raw:true,
  nest: true
});
//Admin Query end
export const updateRestaurantNotification = (model, payload) =>
  model.findOrCreate({
    where: { branch_id: payload.branch_id, notification_table_id: payload.notification_table_id },
    defaults: {
      ...payload
    }
});