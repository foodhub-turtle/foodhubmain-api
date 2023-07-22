//Admin Query start
export const findAllRiders = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, raw: true,
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['id', 'ASC']]
});
export const allActiveRiders = (model, filters) => model.findAll({
  where: filters,
  include: ['created_user'], 
  raw:true, 
  nest: true
});

//Admin Query end
export const findByPk = (model, id) => model.findByPk(id);
export const findByRider = (model, filter) => model.findOne({
  where: filter,
  raw: true,
  nest: true
});
export const findRiderByPk = (model, id) => model.findByPk(id);
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({include: ['created_user'], raw:true, nest: true});

export const update = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);
export const updateRiderById = (model, payload, filters) =>
  model.update(
    {...payload},
    {where: filters}
);
export const updateLog = (model, payload, filters) =>
  model.update(
    {...payload},
    {where: filters}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { email: payload.email, phone: payload.phone },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

