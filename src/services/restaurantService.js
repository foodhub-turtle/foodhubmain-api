//Admin Query start
export const findAllRestaurant = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: limit,
  offset: offset,
  order:[['id', 'ASC']]
});
//Admin Query end
export const findByPk = (model, id) => model.findAll(
  {
    where:{id: id}, 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        association: "item",
        raw: true,
        nest: true,
        required: false,
        include: [
          {
            association: "category",
            attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
            required: false,
          },
          {
            association: "cuisine",
            attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
            required: false,
          },
        ]
      }
    ],
    raw: false,
    nest: true
  });
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({raw:true});
export const findAllFilter = (model, filter) => model.findAll({
  where: filter,
  raw:true
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { email: payload.email },
    defaults: {
      ...payload
    }
});

export const findById = (model, id) => model.findByPk(id);

