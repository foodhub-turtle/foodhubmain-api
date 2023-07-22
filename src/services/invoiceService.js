//Admin Query start
export const findAllInvoices = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "customer",
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
  order:[['id', 'ASC']]
});
//Admin Query end
export const findByPk = (model, id) => model.findByPk(id);
export const findAddress = (model, filter) => model.findOne({
  where: filter,
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = (model, filter) => model.findAll({
  where: filter,
  include: [
    {
      association: "customer",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
    {
      association: "branch",
      attributes: { exclude: ['createdAt', 'updatedAt','status'] }, 
      raw: true,
    },
  ],
  raw:true, 
  nest: true
});

export const findInvoiceDetails = (model, id) => model.findOne(
  {
    where: {id: id},
    attributes: { exclude: ['createdAt', 'updatedAt', 'created_by', 'status', 'admin_id'] },
    include: [
      {
        association: "order",
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            association: "order_items",
            attributes: { exclude: ['createdAt', 'updatedAt'] }, 
            include: [
              {
                association: "item",
                attributes: { exclude: ['createdAt', 'updatedAt','image','description','calories','allergic_ingredients','restaurant_id','branch_id','created_by','is_popular','approve_status','status','package','item_type_id'] }, 
                raw: true,
              },
              {
                association: "order_item_extra",
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                  {
                    association: "ingredients",
                    attributes: { exclude: ['createdAt', 'updatedAt','image','description','calories','allergic_ingredients','restaurant_id','branch_id','created_by','is_popular','approve_status','status','package','item_type_id'] }, 
                    raw: true,
                  },
                ],
                raw: true,
                nest: true,
                required: false,
              }
            ],
            raw: false,
            nest: true,
            required: false,
          }
        ],
        raw:false, 
        nest: true
      }
      
    ],
    raw:false, 
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

export const createInvoice = (model, payload) =>
  model.create({
      ...payload
});

export const updateById = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);
