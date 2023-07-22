export const updateById = (model, id,payload) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

export const findOne = model => model.findOne({
  where: {status: 1},
  attributes: {exclude: ['createdAt', 'updatedAt', 'status']},
  raw:true,
  nest: true
});

export const createSettings = (model, payload) =>
  model.create({
      ...payload
});
