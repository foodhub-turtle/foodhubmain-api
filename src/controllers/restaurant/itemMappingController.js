import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, create, findByPk, update, deleteByPk } from "../../services/itemMappingService.js";
import catchAsync from "../../libs/catchAsync.js";


const { item_mapping, item_group_mapping } = Model;

export const getAllItemMappings = catchAsync(async (req, res, next) => {
  const itemMappings = await findAll(item_mapping);

  const results = _.map(itemMappings, itemgroupObj => _.omit(itemgroupObj, ['updatedAt', 'createdAt']));

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: results
  });
});

export const getItemMappingById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await findByPk(item_mapping, id);

  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item Mapping not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: _.omit(result.toJSON(), ["updatedAt", "createdAt"])
  });
});

export const createItemMapping = catchAsync(async (req, res, next) => {

  const itemMapping = await create(item_mapping, {
    item_id: req.body.item_id,
    created_by: req.body.created_by
  });
  // if (!created) {
  //   return res.status(400).json({
  //     status: "fail",
  //     statusCode: 400,
  //     message: "Item group already exist"
  //   });
  // }
  
  const groups = req.body.groups;
  const result = _.omit(itemMapping.toJSON(), ["updatedAt", "createdAt"]);
  
  groups.forEach(async (value, index) => {

    let item_group = {
      item_mapping_id: itemMapping.id,
      item_group_id: value.item_group_id,
      created_by: req.body.created_by
    };

    const itemGroupMapping = await create(item_group_mapping, {
      ...item_group
    });
  });
  const resultItemMapping = await findByPk(item_mapping, result.id);

  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Item Mapping with ingredients created successfully",
    payload: resultItemMapping
  });
});

// export const updateItemMapping = catchAsync(async (req, res, next) => {
//   const id = req.query.id;
//   const slug = req.body.name.toLowerCase().replace(/ /g, "_");
//   const result = await update(item_mapping, {
//     ...req.body,
//     id,
//     slug
//   });

//   if (!result[0]) {
//     return res.status(400).json({
//       status: "fail",
//       statusCode: 404,
//       message: "Item group didn't updated"
//     });
//   }

//   const resultData = await findByPk(item_mapping, id);

//   return res.status(201).json({
//     status: "success",
//     message: "Item group updated successfully",
//     statusCode: 200,
//     payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
//   });
// });

export const deleteItemMappingById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await deleteByPk(item_mapping, id);

  if (!result[0]) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item group not found"
    });
  }

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    message: "Item group deleted successfully"
  });
});

export const updateItemMappingStatusById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  const result = await update(item_mapping, {
      ...req.body,
      id
  });
  if (!result[0]) {
      return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item group not found"
      });
  }
  const resultData = await findByPk(item_mapping, id);
  return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: "Item group status updated successfully",
      payload: _.omit(resultData.toJSON(), ["updatedAt", "createdAt"])
  });
});