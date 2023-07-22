//Admin Query start
export const findAllVouchers = (model, filters, limit, offset) => model.findAndCountAll({
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
export const findByBranchId = (model, id) => model.findOne(
  {
    where:{id: id}, 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: false
  });
export const findRating = (model, filter) => model.findOne(
  {
    where:filter, 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: true
  });
export const deleteByPk = (model, id) => model.destroy({where: { id: id}});

export const findAll = (model, filters) => model.findAll({
  where: filters,
  raw:true, 
  nest:true
});

export const findAllFilterRecommended = (model, filter) => model.findAll({
  where: filter,
  limit: 10,
  include: [
    {
      association: "branch",
      attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
      required: false,
    }
  ],
  raw:true,
  nest: true
});
export const findAllFilter = (model, filter) => model.findAll({
  where: filter,
  include: [
    {
      association: "branch",
      attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
      required: false,
    }
  ],
  raw:true,
  nest: true
});
export const findAllReview = (model, filter) => model.findAll({
  where: filter,
  raw:true
});
export const findAllStoreFilter = (model, filter) => model.findAll({
  where: filter,
  include: [
    {
      association: "store",
      attributes: { exclude: ['created_by','createdAt', 'updatedAt', 'status'] }, raw: true,
      required: false,
    }
  ],
  raw:true,
  nest: true
});

export const update = (model, payload) =>
  model.update(
    {...payload},
    {where: { id: payload.id}}
);
export const updateVoucherById = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);

export const findOrCreate = (model, filters,payload) =>
  model.findOrCreate({
    where: filters,
    defaults: {
      ...payload
    }
});

export const findById = (model, id) => model.findOne({where:{id:id}, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, nest: true});
export const findBranchByUserId = (model, filter) => model.findOne({where:filter, include: ['branch','created_user']});
export const findVoucherBranch = (model, filter) => model.findOne({
  where:filter,
  attributes: { exclude: ['createdAt', 'updatedAt'] },  
  raw:true
});
export const findVoucherByCode = (model, filter) => model.findOne({
  where:filter,
  attributes: { exclude: ['createdAt', 'updatedAt'] },  
  raw:true
});

export const findAllBusinessCategories = (model, filters) => model.findAll({
  where: filters,
  attributes: { exclude: ['created_by','status','createdAt', 'updatedAt'] }, 
  raw:true, 
  nest: true
});

export const createOpening = (model, payload) =>
  model.create({
      ...payload
});

export const deleteOpeningByBranch = (model, filter) => model.destroy(
  {
    where: filter
  }
);



