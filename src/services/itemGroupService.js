//Admin Query start
export const findAllItemGroup = (model, filters, limit, offset) => model.findAndCountAll({
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
export const findItemGroupByPk = (model, id) => model.findOne({
  where: { id: id},
  raw: true
});
export const findOneById = (model, id) => model.findOne({
  where: { id: id},
  raw: true,
});
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt','status'] },
  nest: true,
  raw:true
});
export const findAllItemGroups = (model, filters) => model.findOne({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt','status'] },
  nest: true,
  raw:true
});
export const findItemGroups = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt','status'] },
  nest: true,
  raw:true
});
export const findAllActive = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt','status'] },
  nest: true,
  raw:true
});
export const findAllPending = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "a",
      include: [
        {
          association: "b",
          attributes: { exclude: ['createdAt', 'updatedAt','status'] }
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt','status'] },
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt','status'] },
  nest: true,
  raw:false
});
export const findGroups = model => model.findAll({
  attributes: { exclude: ['createdAt', 'updatedAt','status'] },
  nest: true,
  raw:true
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
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

