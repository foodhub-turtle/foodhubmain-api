//Admin Query start
export const findAllCategory = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['date_of_birth','phone','email','email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    },
    {
      association: "category_type",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      raw: true,
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
export const findCategoryByBranch = (model, filters) => model.findOne({
  where: filters,
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['date_of_birth','phone','email','email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    },
    {
      association: "category_type",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  order:[['id', 'ASC']]
});
export const findByPk = (model, id) => model.findOne({
  where: {id: id},
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['date_of_birth','phone','email','email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    },
    {
      association: "category_type",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    }
  ], 
  raw:true, 
  nest: true
});
export const findById = (model, id) => model.findOne({
  where: {id: id},
  raw: true,
  nest: true,
  required: false
});
export const findByCategoryId = (model, filters) => model.findOne({
  where: filters,
  raw: true,
  nest: true,
  required: false
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAllPendingCategories = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['date_of_birth','phone','email','email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    },
    {
      association: "category_type",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});
export const findAll = model => model.findAll({
  include: [
    {
      association: "created_user",
      attributes: { exclude: ['date_of_birth','phone','email','email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    },
    {
      association: "category_type",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, 
      raw: true,
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});
export const findAllType = model => model.findAll({attributes: { exclude: ['createdAt', 'updatedAt'] }, raw:true, nest: true});

export const updateBranchCategory = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);
export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { slug: payload.slug },
    defaults: {
      ...payload
    }
});
export const findOrCreateApprove = (model, payload) =>
  model.findOrCreate({
    where: { slug: payload.slug },
    defaults: {
      ...payload
    }
});
export const findOrCreateBranch = (model, payload) =>
  model.findOrCreate({
    where: { slug: payload.slug },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

