import { Op, Sequelize } from 'sequelize';
//Admin Query start
export const findAllItems = (model, filters, limit, offset) => model.findAndCountAll({
  where: filters,
  include: [
    {
      association: "category",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {  
      association: "cuisine",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "created_user",
      attributes: { exclude: ["email_verified_at","remember_token","password", "updatedAt", "createdAt"] }, raw: true,
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
export const findAllItemsByBranch = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "category",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {  
      association: "cuisine",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "created_user",
      attributes: { exclude: ["email_verified_at","remember_token","password", "updatedAt", "createdAt"] }, raw: true,
      required: false,
    }
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  order:[['id', 'ASC']]
});
export const findByPk = (model, id) => model.findOne({where: {id:id}, include: ['restaurant','category','cuisine'],attributes: { exclude: ['createdAt', 'updatedAt', 'role'] },raw: true,nest: true});
export const findOneMapping = (model, id) => model.findOne(
  {
    where: {item_id:id}, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, nest: true
  });
export const findOneItem = (model, id) => model.findOne(
  {
    where: {id:id}, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, nest: true
  });
export const findByFilter = (model, filters) => model.findOne({
  include: [
      {
        association: "discount",
        attributes: { exclude: ['createdAt', 'updatedAt'] }, 
        raw: true,
        required: false,
        nest: true,
      }
    ],
    where: filters,
    nest: true,
    raw: true
});
export const findByOrderItem = (model, filters) => model.findOne({
    where: filters,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    nest: true,
    raw: true
});
export const findItemByRestaurantId = (model, item_id, branch_id) => 
model.findOne(
  {
    where: {id:item_id, branch_id: branch_id, approve_status: 1, status: 1},
    attributes: { exclude: ['created_by','approve_status','status','createdAt', 'updatedAt'] }, raw: true,
    include: [
      {
        association: "item_mapping",
        attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
        required: false,
        include: [
          {
            association: "item_group_mapping",
            required: false,
            attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
            include: [
              {
                association: "item_group",
                attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true, nest: true,
                include: [
                  {
                    association: "a",
                    include: [
                      {
                        association: "b",
                        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] }, nest: true
                      }
                    ],
                    required: false,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'status'] }, nest: true
                    
                  }
                ]
              }
            ]
          }
        ]
      }
  ], 
  raw: false, 
  nest: true
});
export const findItemDetailsByRestaurantId = (model, filters) => 
model.findOne(
  {
    where: filters,
    attributes: { exclude: ['created_by','approve_status','status','createdAt', 'updatedAt'] }, raw: true,
  raw: false, 
  nest: true
});


export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = model => model.findAll({
  include: [
    {
      association: "category",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {  
      association: "cuisine",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
    {
      association: "created_user",
      attributes: { exclude: ["email_verified_at","remember_token","password", "updatedAt", "createdAt"] }, raw: true,
      required: false,
    }
  ], 
  raw: true, 
  nest: true
});
export const findAllItemVariants = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true
});
export const findAllByCategoryId = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true, 
  nest: true
});
export const findAllPopular = (model, branch_id) => model.findAll({
  where: {is_popular: 1, branch_id: branch_id, status: 1},
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true, 
  nest: true
});
export const findBranchItemFilter = (model, filter) => model.findAll({
  where: filter,
  attributes: { exclude: ['createdAt', 'updatedAt'] },
  raw: true, 
  nest: true
});
export const findAllBranchesByItem = (model, filter) => model.findAll({
  where: filter,
  attributes: [
    [Sequelize.fn('DISTINCT', Sequelize.col('branch_id')), 'branch_id'],
    'branch_id'
  ],
  raw: true, 
  nest: true
});
export const findBoughtTogether = (model, filters) => model.findAll({
  where: filters,
  include: [
    {
      association: "item",
      attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true,
      required: false,
    },
  ],
  attributes: { exclude: ['createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true,
  limit: 10,
});
export const findAllByRestaurantId = (model, restaurent_id) => model.findAll({where:{restaurant_id: restaurent_id} ,include: ['category','cuisine'], attributes: { exclude: ['createdAt', 'updatedAt'] },raw: true,nest: true});
export const findAllItemGroupMappingByItemMapId = (model, filters) => model.findAll({where: filters, attributes: { exclude: ['createdAt', 'updatedAt'] },raw: true,nest: true});
export const findItemGroupByItemGroupId = (model, id) => model.findOne(
  {
    where: {id:id}, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, nest: true
});

export const update = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);
export const updateFromBranch = (model, payload, filters) =>
  model.update(
    payload,
    {where: filters}
);

export const findOrCreate = (model, payload) =>
  model.findOrCreate({
    where: { name: payload.name,  },
    defaults: {
      ...payload
    }
});

export const create = (model, payload) =>
  model.create({
      ...payload
});

