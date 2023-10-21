//Admin query start
export const findAllWithModel = (model) => model.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  });
  export const findAllWithModelAndFilter = (model, filters) => model.findAll({
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  });
  export const findAllWithModelAndOptions = (model, options) => model.findAll({
    ...options
  });
  export const findAndCountAllWithModelAndOptions = (model, options) => model.findAndCountAll({
    ...options
  });
  export const findWithModelAndOptions = (model, options) => model.findOne({
    ...options
  });
  export const findWithModelAndFilter = (model, filters) => model.findOne({
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  });
  export const findOrCreateModel = (model, payload) =>
  model.findOrCreate({
    where: { id: payload.id },
    defaults: {
      ...payload
    }
});
  export const create = (model, payload) =>
    model.create({
      ...payload
  });
  export const updateModel = (model, payload, id) =>
    model.update(
      {...payload},
      {where: { id: id}}
  );
  export const updateModelAndFilter = (model, payload, filters) =>
    model.update(
      {...payload},
      {where: filters}
  );
  export const deleteModelByPk = (model, id) => model.destroy({where: { id: id}});

  //Admin query end