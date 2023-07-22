export const findByPk = (model, id) => model.findOne({
  where: {id: id},
  raw: true
});
export const deleteByPk = (model, id) => model.destroy({
  where: { id: id}
});

export const findAll = (model, filters) => model.findAll({
  where: filters,
  limit: 10,
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});
export const findAllSearch = model => model.findAll({
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});
export const findAllSavedSearch = model => model.findAll({
  attributes: ['search_content'],
  distinct: true,
  raw:true, 
  limit: 10
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);

export const findOrCreateSearch = (model, payload) =>
  model.findOrCreate({
    where: { search_content: payload.search_content },
    defaults: {
      ...payload
    }
});

export const createSearch = (model, payload) =>
  model.create({
      ...payload
});

