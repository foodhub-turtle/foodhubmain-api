//Admin Query start
export const findAllOrders = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "customer_address",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "branch",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['order_datetime', 'desc']]
});
//Admin Query end
export const findByPk = (model, id) => model.findByPk(id);
export const findAddress = (model, filter) => model.findOne({
  where: filter,
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = (model) => model.findAll({
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "customer_address",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "branch",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
  ],
  order: [
    ['order_datetime', 'desc']
  ],
  raw:true, 
  nest: true
});

export const findAllWithType = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "customer_address",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "branch",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
  ],
  order: [
    ['order_datetime', 'desc']
  ],
  raw:true, 
  nest: true
});
export const findAllActivePast = (model, filter) => model.findAll({
  where: filter,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "customer_address",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "branch",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    }
  ],
  order: [
    ['order_datetime', 'desc']
  ],
  raw:true, 
  nest: true
});

export const findOrderDetails = (model, id) => model.findOne(
  {
    where: {id: id},
    include: [
      {
        association: "customer",
        attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
        raw: true,
      },
      {
        association: "rider",
        attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
        raw: true,
      },
      {
        association: "customer_address",
        attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
        raw: true,
      },
      {
        association: "branch",
        attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
        raw: true,
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'created_by', 'status', 'admin_id'] },
    raw:true, 
    nest: true
  }
);
export const findByVariantId = (model, filters) => model.findOne(
  {
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  }
);

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { customer_id: payload.customer_id },
    defaults: {
      ...payload
    }
});

export const createOrder = (model, payload) =>
  model.create({
      ...payload
});
export const findAllOrderItem = (model, filters) => model.findAll({
  where: filters,
  raw:true,
  nest: true
});
export const findAllExtra = (model, id) => model.findAll({
  where: {order_item_id: id},
  raw:true,
  nest: true
});

export const updateById = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);
export const findByRiderId = (model, filters) => model.findOne(
  {
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  }
);
export const findByCustomerId = (model, filters) => model.findOne(
  {
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true,
    limit: 1,
    order:[['id', 'desc']]
  }
);
export const findAllByCustomerId = (model, filters) => model.findAll(
  {
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true,
    limit: 1,
    order:[['id', 'desc']]
  }
);
