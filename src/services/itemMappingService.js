//Admin Query start
export const findAllItemMappings = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "restaurant",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "branch",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "category",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "item",
      attributes: { exclude: ['email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['branch_id', 'ASC'],['category_id', 'ASC']]
});
//Admin Query end
export const findByPk = (model, id) => model.findByPk(id);
export const findMappingById = (model, filters) => model.findOne({
  where: filters,
  raw:true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});
export const findItemMapByItemId = (model, id) => model.findOne({where: { item_id: id}, raw:true});
export const findItemMapByFilter = (model, filters) => model.findOne({where: filters, raw:true});
export const findItemMapByCategory = (model, filters) => model.findAll({where: filters, raw:true});

export const findAll = (model, filters) => model.findAll({
  where: filters,
  raw:true
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);
export const updateMapping = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);
export const updateMappingStatus = (model, payload) =>
  model.update(
    {
      created_by: payload.created_by,
      status: payload.status
    },
    {where: { id: payload.id}}
);
export const updateHasVariant = (model, payload) =>
  model.update(
    {
      is_hasVariants: payload.is_hasVariant
    },
    {where: { item_id: payload.item_id, branch_id: payload.branch_id}}
);
export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { name: payload.name },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

export const findOrCreateGroupMapping = (model, payload) =>
  model.findOrCreate({
    where: { item_group_id: payload.item_group_id, item_mapping_id: payload.item_mapping_id },
    defaults: {
      ...payload
    }
});
export const updateGroupMapping = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

