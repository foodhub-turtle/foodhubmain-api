import { Router } from "express";
import { jwtProtect } from "../middlewares/jwtAuthMiddleware.js";
import { checkEmailForUser, registerRestaurant } from "../controllers/userController.js";
const controller = require("../controllers/authController.js");
const orderController = require("../controllers/restaurant/orderController.js");
// const addressController = require("../controllers/restaurant/addressController.js");
// const restaurantController = require("../controllers/restaurant/restaurantController.js");
const branchController = require("../controllers/restaurant/branchController.js");
const categoryController = require("../controllers/restaurant/categoryController.js");
const cuisineController = require("../controllers/restaurant/cuisineController.js");
const itemController = require("../controllers/restaurant/itemController.js");
const itemGroupController = require("../controllers/restaurant/itemGroupController.js");
const itemMappingController = require("../controllers/restaurant/itemMappingController.js");
const invoiceController = require("../controllers/restaurant/invoiceController.js");
const dashboardController = require("../controllers/restaurant/dashboardController.js");
const notificationController = require("../controllers/restaurant/notificationController.js");
const ingredientController = require("../controllers/restaurant/ingredientController.js");
// const storeController = require("../controllers/restaurant/storeController.js");
// import {
//     getAllItemsByRestaurantId,
//     getItemByRestaurantId
// } from "../controllers/user/itemController.js";
const settingsController = require("../controllers/restaurant/settingsController.js");
const upload = require("../middlewares/upload");
const settingsUpload = upload.fields([
    { name: 'site_logo_mobile', maxCount: 1 }, 
    { name: 'site_logo_tablet', maxCount: 1 }, 
    { name: 'site_logo', maxCount: 1 },
    { name: 'site_fav_icon', maxCount: 1 }
]);
const promotionUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 }
]);
const { authJwt } = require("../middlewares");

const router = Router();

router.post("/check-email-user", checkEmailForUser);
router.post("/register-restaurant", registerRestaurant);
router.put("/update-user-password?:id", [authJwt.verifyToken], controller.updateUserPassword);
router.put("/update-user-profile?:id", [authJwt.verifyToken], controller.updateUserProfile);
//Dashboard
router.get("/get-dashboard-detail?:id", [authJwt.verifyToken], dashboardController.getDashboardDataByBranchId);
//Setting
router.get("/settings", [authJwt.verifyToken], settingsController.getSettings);
//Branch
router.put("/branches/status?:id", [authJwt.verifyToken], branchController.changeStatusBranch);
router.get("/restaurants/show?:id", [authJwt.verifyToken], branchController.getBranchById);
router.get("/opening?:id", [authJwt.verifyToken], branchController.getOpeningHoursBranchById);
router.post("/opening", [authJwt.verifyToken], branchController.insertOpeningHours);

// Order
router.get("/orders", [authJwt.verifyToken], orderController.getOrdersWithType);
router.get("/orders/show/:id", [authJwt.verifyToken], orderController.getOrderDetail);
router.put("/orders/status?:id", [authJwt.verifyToken], orderController.changeStatusOrder);
// Invoice
router.get("/invoices?:id", [authJwt.verifyToken], invoiceController.getInvoicesWithBranch);
router.get("/invoices/show/:id", [authJwt.verifyToken], invoiceController.getInvoiceDetail);

//Category
router.get("/categories", [authJwt.verifyToken], categoryController.getAllCategories);
router.get("/categories/pending?:id", [authJwt.verifyToken], categoryController.getAllPendingCategories);
router.get("/categories/rejected?:id", [authJwt.verifyToken], categoryController.getAllRejectedCategories);
router.get("/categories/types", [authJwt.verifyToken], categoryController.getAllCategoriesTypes);
router.get("/categories/show?:id", [authJwt.verifyToken], categoryController.getCategoryById);
// router.post("/categories", [authJwt.verifyToken], createCategory);
router.post("/categories", [authJwt.verifyToken], upload.single('image'),categoryController.createCategory);
router.put("/categories?:id", [authJwt.verifyToken], upload.single('image'), categoryController.updateCategory);
router.delete("/categories?:id", [authJwt.verifyToken], categoryController.deleteCategoryById);
router.put("/categories/status?:id", [authJwt.verifyToken], categoryController.changeStatusCategory);
router.put("/categories/status-update?:id", [authJwt.verifyToken], categoryController.updateCategoryStatusById);
//Cuisine
router.get("/cuisines", [authJwt.verifyToken], cuisineController.getAllCuisines);
router.get("/cuisines/show?:id", [authJwt.verifyToken], cuisineController.getCuisineById);
router.post("/cuisines", [authJwt.verifyToken], upload.single('image'), cuisineController.createCuisine);
router.put("/cuisines?:id", [authJwt.verifyToken], upload.single('image'), cuisineController.updateCuisine);
router.delete("/cuisines?:id", [authJwt.verifyToken], cuisineController.deleteCuisineById);
router.put("/cuisines/status?:id", [authJwt.verifyToken], cuisineController.changeStatusCuisine);
router.put("/cuisines/status-update?:id", [authJwt.verifyToken], cuisineController.updateCuisineStatusById);
//Item
router.get("/items", [authJwt.verifyToken], itemController.getAllItems);
router.get("/items/show?:id", [authJwt.verifyToken], itemController.getItemById);
router.post("/items", [authJwt.verifyToken], upload.single('image'), itemController.createItem);
router.put("/items?:id", [authJwt.verifyToken], upload.single('image'), itemController.updateItem);
router.delete("/items?:id", [authJwt.verifyToken], itemController.deleteItemById);
router.put("/items/status?:id", [authJwt.verifyToken], itemController.updateItemStatusById);
router.put("/items/price-change-request?:id", [authJwt.verifyToken], itemController.setItemPrice);
router.get("/items/variants/pending", [authJwt.verifyToken], itemController.getPendingItemVariantPrice);
//Item Group
router.get("/groups?:id", [authJwt.verifyToken], itemGroupController.getAllItemGroups);
router.get("/groups/show?:id", [authJwt.verifyToken], itemGroupController.getItemGroupById);
router.get("/groups/pending?:id", [authJwt.verifyToken], itemGroupController.getAllPendingItemGroups);
router.post("/groups", [authJwt.verifyToken], itemGroupController.createItemGroup);
router.put("/groups?:id", [authJwt.verifyToken], itemGroupController.updateItemGroup);
router.delete("/groups?:id", [authJwt.verifyToken], itemGroupController.deleteItemGroupById);
//Ingredient
router.get("/ingredients", [authJwt.verifyToken], ingredientController.getAllIngredients);
// adminRouter.get("/ingredients/show?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.getIngredientById);
// adminRouter.post("/ingredients", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.createIngredient);
// adminRouter.put("/ingredients?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.updateIngredient);
// adminRouter.delete("/ingredients?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.deleteIngredientById);
// adminRouter.put("/ingredients/status?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.updateIngredientStatusById);
//Item Mapping
router.get("/item-mappings", [authJwt.verifyToken], itemMappingController.getAllItemMappings);
router.post("/item-mappings", [authJwt.verifyToken], itemMappingController.createItemMapping);
//Restaurant Notification
router.get("/notifications?:id", [authJwt.verifyToken], notificationController.getAllNotifications);
router.post("/notifications/approve", [authJwt.verifyToken], notificationController.approveNotification);
router.post("/notifications/reject", [authJwt.verifyToken], notificationController.rejectNotification);
export default router;