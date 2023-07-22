export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { email: payload.email },
    defaults: {
      ...payload
    }
});

//Admin Query start
export const findAllIngredientMappings = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['id', 'ASC']]
});
//Admin Query end
export const findUser = (model, payload) =>
  model.findOne({
    where: {
      phone: payload
    },
    logging: false
  });

export const findByItemGroup = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "b",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      nest: true,
      raw: true,
      required: false,
    }
  ],
  nest: true,
  raw:true
});
export const findOrCreateIngredientMapping = (model, payload) =>
  model.findOrCreate({
    where: { item_group_id: payload.item_group_id, ingredient_id: payload.ingredient_id },
    defaults: {
      ...payload
    }
});
export const updateIngredintMapping = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

export const findByPkDefault = (model, id) => model.findByPk(id);
export const deleteByItemGroup = (model, id) => model.destroy({where: { item_group_id: id}});
export const findByItemGroupId = (model, filters) => model.findAll({where: filters, raw:true});
export const findAllDefault = model => model.findAll({raw:true});