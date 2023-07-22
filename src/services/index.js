export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { email: payload.email },
    defaults: {
      ...payload
    }
});

export const findUser = (model, filter) =>
  model.findOne({
    where: filter,
    logging: false
  });
export const findUserFilter = (model, payload) =>
  model.findOne({
    where: payload
  });

export const findByPkDefault = (model, id) => model.findByPk(id);
export const findByFilter = (model, filters) => model.findOne({
  where: filters,
  raw: true
});
export const deleteByPkDefault = (model, id) => model.destroy({where: { id: id}});
export const findAllDefault = (model, filters) => model.findAll({
  where: filters,
  raw:true
});
export const findByCustomerId = (model, id) => model.findAll({
  where: {customer_id: id},
  raw:true
});
export const findOneUser = (model, filters) => model.findAll({
  where: filters,
  attributes: ['id', 'email', 'facebookid'], 
  raw:true
});
export const updateOrderedRestaurant = (model, payload) =>
  model.update(
    {...payload},
    {where: { customer_id: payload.customer_id, branch_id: payload.branch_id}}
);
export const createFavourite = (model, payload) =>
  model.create({
      ...payload
});
