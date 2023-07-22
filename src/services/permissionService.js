const { Op } = require("sequelize");
//Admin query start
export const findAllPermission = (model) => model.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  });
export const findAllUser = (model) => model.findAll({
  attributes: { exclude: ['date_of_birth','email_verified_at','password','remember_token','verified','blocked','createdAt', 'updatedAt'] }, 
    raw:true, 
    nest: true
  });
export const findRole = (model, filters) => model.findOne({
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  });
export const findUser = (model, filters) => model.findOne({
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw:true, 
    nest: true
  });
export const findLinkedUser = (model, filters) => model.findAll({
    where: filters,
    raw:true, 
    nest: true
  });

export const bulkCreate = (model, payload) =>
  model.bulkCreate(payload);

export const deleteByPk = (model, filters) => model.destroy({where: filters});
export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { role_name: payload.role_name },
    defaults: {
      ...payload
    }
});
export const findRoles = (model, filters, limit, offset) => model.findAndCountAll({
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
export const findWithModelAndFilter = (model, filters) => model.findOne({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw:true, 
  nest: true
});
//Admin query end