//Admin Query start
export const findAllPromotions = (model, filters, limit, offset) => model.findAndCountAll({
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
export const findByPk = (model, id) => model.findOne({
  where: {id: id},
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true
});
export const findPromotionByBranch = (model, filters) => model.findOne({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = (model, filters) => model.findAll({
  where: filters,
  // attributes: ['id', 'title', 'url_key', 'priority', 'start_date', 'end_date', 'is_showonfront', 'status'],
  raw:true, 
  nest: true
});
export const findAllCuisine = model => model.findAll({attributes: { exclude: ['created_by','status','createdAt', 'updatedAt'] }, raw:true, nest: true});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);
export const updatePromo = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);
export const updateStatus = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { title: payload.title },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});
export const createPromotionObj = (model, payload) =>
  model.create({
      ...payload
});

