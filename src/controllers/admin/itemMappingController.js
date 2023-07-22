import _ from "lodash";
import Model from "../../models/index.js";
import { findAll, findOrCreate, updateMappingStatus, create, findByPk, update, deleteByPk, findAllItemMappings, findItemMapByFilter,findMappingById, findOrCreateGroupMapping, updateGroupMapping, updateMapping } from "../../services/itemMappingService.js";
import { findAllItemGroupMappingByItemMapId, findAllItemVariants } from "../../services/itemService.js";
import { findGroups, findAllItemGroups, findItemGroupByPk} from "../../services/itemGroupService.js";
import catchAsync from "../../libs/catchAsync.js";
import { findByItemGroupId } from "../../services/ingredientMappingService.js";
import { getPagination, getPaginationData } from "../../libs/commomLibs";
import { findIngredientByPk } from "../../services/ingredientService.js";
import { Op } from 'sequelize';
import { uploadImage } from "../../libs/globalUpload.js";


const { item_mapping, item_group_mapping, item_group, ingredient_mapping, ingredient, item_variant } = Model;

export const getAllItemMappings = catchAsync(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page, req.query.size);
  let where = {};
  let orAttributes = [];
  let andAttributes = [];
  const searchTerm = JSON.parse(req.query.searchTerm);
  
  if (searchTerm.restaurant_id) {
    andAttributes.push({restaurant_id: parseInt(searchTerm.restaurant_id)});
  }
  if (searchTerm.branch_id) {
    andAttributes.push({branch_id: parseInt(searchTerm.branch_id)});
  }
  if (searchTerm.status) {
    andAttributes.push({status: parseInt(searchTerm.status)});
  }
  orAttributes.push({status: {[Op.in]: [0, 1]}});
  
  orAttributes.push({createdAt: {[Op.not]: null}});

  where = {
    [Op.or]: orAttributes,
    [Op.and]: andAttributes
  };
  
  let itemMappings = await findAllItemMappings(item_mapping, where, limit, offset);
  for (let indexMapping = 0; indexMapping < itemMappings.rows.length; indexMapping++) {
    let elementMapping = itemMappings.rows[indexMapping];
    if (elementMapping.is_hasVariants) {
        elementMapping.priceVariants = await findAllItemVariants(item_variant, {item_id: elementMapping.item_id, branch_id: elementMapping.branch_id});
    }
    if (elementMapping) {
      let itemMappingGroups = await findAllItemGroupMappingByItemMapId(item_group_mapping, {item_mapping_id: elementMapping.id, status: 1});
      let item_groups = [];
      for (let index = 0; index < itemMappingGroups.length; index++) {
        let element = itemMappingGroups[index];
        item_groups.push(await findAllItemGroups(item_group, {id: element.item_group_id}));
      }
      for (let groupIndex = 0; groupIndex < item_groups.length; groupIndex++) {
        let elementGroup = item_groups[groupIndex];
        
        let ingredients_mappings = await findByItemGroupId(ingredient_mapping, {item_group_id: elementGroup.id, status: 1}); 
        for (let ingredientIndex = 0; ingredientIndex < ingredients_mappings.length; ingredientIndex++) {
          let elementIngredient = ingredients_mappings[ingredientIndex];
          let ingredientObj = await findIngredientByPk(ingredient, elementIngredient.ingredient_id);
          ingredients_mappings[ingredientIndex].name = ingredientObj.name;
        }
        item_groups[groupIndex].ingredients = ingredients_mappings;
      }
      
      // itemMappingGroups.item_groups = item_groups;
      
      itemMappings.rows[indexMapping].itemMappingGroups = item_groups;
    }else{
      itemMappings.rows[indexMapping].itemMappingGroups = null;
    }
    console.log(itemMappings.rows[indexMapping]);
  };
  itemMappings = getPaginationData(itemMappings, req.query.page, limit);

  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: itemMappings
  });
});

export const getItemMappingById = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  var result = await findMappingById(item_mapping, {id: id});
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item Mapping not found"
    });
  }
  var itemMappingGroups = await findAllItemGroupMappingByItemMapId(item_group_mapping, {item_mapping_id: result.id, status: 1});
  var item_groups = [];
  for (let index = 0; index < itemMappingGroups.length; index++) {
    var elementitemMapping = itemMappingGroups[index];
    item_groups.push(elementitemMapping);
  }
  for (let groupIndex = 0; groupIndex < item_groups.length; groupIndex++) {
    var elementGroup = item_groups[groupIndex];
    let itemGroupObj = await findItemGroupByPk(item_group, elementGroup.item_group_id);
    item_groups[groupIndex].item_group = itemGroupObj;
  }
  console.log(itemMappingGroups);
  result.mapping = itemMappingGroups;
  return res.status(200).json({
    status: "success", 
    statusCode: 200,
    payload: result
  });
});

export const createItemMapping = catchAsync(async (req, res, next) => {
  if (req.body.item_id.length > 0) {
    for (let index = 0; index < req.body.item_id.length; index++) {
      const element = req.body.item_id[index];
      const itemMapping = await create(item_mapping, {
        item_id: element,
        restaurant_id: req.body.restaurant_id,
        branch_id: req.body.branch_id,
        category_id: req.body.category_id,
        created_by: req.body.created_by
      });
      // if (!created) {
      //   return res.status(400).json({
      //     status: "fail",
      //     statusCode: 400,
      //     message: "Item group already exist"
      //   });
      // }
      
      const groups = req.body.item_group_id;
      const result = _.omit(itemMapping.toJSON(), ["updatedAt", "createdAt"]);
      
      groups.forEach(async (value, index) => {
    
        let item_group = {
          item_mapping_id: itemMapping.id,
          item_group_id: value,
          created_by: req.body.created_by
        };
    
        const itemGroupMapping = await create(item_group_mapping, {
          ...item_group
        });
      });
    }
  }


  return res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Item Mapping with ingredients created successfully",
  });
});

export const updateItemMapping = catchAsync(async (req, res, next) => {
  const id = req.query.id;

  if (!_.isEmpty(req.file)) {
    req.body.image = await uploadImage(req.file);
  }
  let mappingPayload = {
    image: req.body.image,
    description: req.body.description
  }
  const result = await updateGroupMapping(item_mapping, {...mappingPayload}, id);
  if (!result) {
    return res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: "Item Mapping not updated"
    });
  }
  let groups = [];
  req.body.item_group_id.split(',').forEach(group => {
    groups.push(parseInt(group));
  });
  groups.forEach(async (value, index) => {
      let item_group_id = value;
      let item_group = {
        item_mapping_id: id,
        item_group_id: item_group_id,
        created_by: req.body.created_by
      };

    const [groupObj, created] = await findOrCreateGroupMapping(item_group_mapping, {
      ...item_group
    });


  });

  let item_group_mappings = await findAll(item_group_mapping, {item_mapping_id: id});
  let existingMapping = item_group_mappings.map(mapping => {
    return { item_group_id: mapping.item_group_id, group_mapping_id: mapping.id};
  });
  for (let index = 0; index < existingMapping.length; index++) {
    const element = existingMapping[index];
    if (!_.includes(groups, element.item_group_id)) {
      let updatePayload = {
        item_group_id: element.item_group_id,
        created_by: req.body.created_by,
        status: 0
      }
      const result = await updateGroupMapping(item_group_mapping, {...updatePayload}, element.group_mapping_id);
    }else if(_.includes(groups, element.item_group_id)){
      let updatePayload = {
        item_group_id: element.item_group_id,
        created_by: req.body.created_by,
        status: 1
      }
      const result = await updateGroupMapping(item_group_mapping, {...updatePayload}, element.group_mapping_id);
    }
  }

  return res.status(200).json({
    status: "success",
    message: "Item group updated successfully",
    statusCode: 200
  });
});

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
  const result = await updateMappingStatus(item_mapping, {
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