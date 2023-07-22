export const findByPk = (model, id) => model.findOne({
  where: {id: id},
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

//Admin Query start
export const findAllNotifications = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['id', 'ASC']]
});
//Admin Query end
export const findAll = (model, filters) => model.findAll({
  where: filters,
  raw:true, 
  nest: true
});
export const findAllNotification = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.notificationId}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { branch_id: payload.branch_id },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

