const { Op } = require("sequelize");
//Admin Query start
export const findAllAddresses = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
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
export const findByCustomerId = (model, id) => model.findOne({
  where: {customer_id: id, status: 1},
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw: true,
  nest: true
});
export const findActiveByCustomerId = (model, filters) => model.findOne({
  where: filters,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw: true,
  nest: true
});
export const findByPk = (model, id) => model.findByPk(id);
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});
export const findAllByCustomer = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});
export const findAllTypes = model => model.findAll({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  order: [['order_position', 'asc']],
  raw:true, 
  nest: true
});

export const update = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

export const updateMultiple = (model, id, customer_id) =>
  model.update(
    { status : 0 },
    { where : {
      [Op.not]: [{ id : id}],
      [Op.and]: [{customer_id, customer_id}]
    }
  }
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: {
      map_longitude: payload.map_longitude,
      map_latitude: payload.map_latitude
    },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

