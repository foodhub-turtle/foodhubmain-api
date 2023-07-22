//Admin Query start
export const findAllCustomers = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "user",
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
//Admin Query end
export const findByPk = (model, id) => model.findByPk(id);
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});
export const findByUserId = (model, filter) => model.findOne({where: filter, raw: true});

export const findAll = model => model.findAll({
  include: [
    {
      association: "user",
      attributes: { exclude: ['email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, raw: true,
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { email: payload.email },
    defaults: {
      ...payload
    }
});

export const createCustomer = (model, payload) =>
  model.create({
      ...payload
});


