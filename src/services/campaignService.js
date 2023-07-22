//Admin Query start
export const findAllCampaigns = (model, filters, limit, offset) => model.findAndCountAll({
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
  raw: true
});
export const findByUrl = (model, filters) => model.findOne({
  where: filters,
  raw: true
});
export const findCampaignByBranch = (model, filters) => model.findOne({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, raw: true,
      required: false,
    }
  ], 
  attributes: ['id', 'title', 'url_key', 'image', 'priority', 'start_date', 'end_date', 'is_showonfront', 'status'],
  order: [
    ['priority', 'DESC']
  ],
  raw:true, 
  nest: true
});
export const findAllRestaurantCampaign = (model, payload) => model.findAll({
  where: payload,
  raw:true, 
  nest: true
});
export const findAllCuisine = model => model.findAll({attributes: { exclude: ['created_by','status','createdAt', 'updatedAt'] }, raw:true, nest: true});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);
export const updateCampaignObj = (model, payload, id) =>
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

export const createCampaignObj = (model, payload) =>
  model.create({
      ...payload
});

