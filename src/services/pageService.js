//Admin Query start
export const findAllPages = (model, filters, limit, offset) => model.findAndCountAll({
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
  attributes: ['id', 'page_title', 'url_key', 'meta_title','content','meta_description','status'],
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({include: ['created_user'], raw:true, nest: true});
export const findAllPage = model => model.findAll({attributes: { exclude: ['created_by','status','createdAt', 'updatedAt'] }, raw:true, nest: true});

export const update = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { page_title: payload.page_title },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

