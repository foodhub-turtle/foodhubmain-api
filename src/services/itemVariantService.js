//Admin Query start
export const findAllItemVariants = (model, filters, limit, offset) => model.findAndCountAll({
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
//Admin Query end
export const findByPk = (model, id) => model.findByPk(id);
export const findOneVariant = (model, filters) => model.findOne({
  where: filters,
  raw:true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({raw:true});
export const findAllVariantByBranch = (model, filters) => model.findAll({
  where: filters,
  raw:true
});

export const updateVariant = (model, payload, filters) =>
  model.update(
    payload,
    {where: filters}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { name: payload.name },
    defaults: {
      ...payload
    }
});

export const createVariant = (model, payload) =>
  model.create({
      ...payload
});

