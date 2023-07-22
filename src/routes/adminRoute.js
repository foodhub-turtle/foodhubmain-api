import { Router } from "express";
import { jwtProtect } from "../middlewares/jwtAuthMiddleware.js";
const { authJwt } = require("../middlewares");

const addressController = require("../controllers/admin/addressController.js");
const restaurantController = require("../controllers/admin/restaurantController.js");
const branchController = require("../controllers/admin/branchController.js");
const categoryController = require("../controllers/admin/categoryController.js");
const cuisineController = require("../controllers/admin/cuisineController.js");
const ingredientController = require("../controllers/admin/ingredientController.js");
const settingsController = require("../controllers/admin/settingsController.js");
const customerController = require("../controllers/admin/customerController.js");
const itemController = require("../controllers/admin/itemController.js");
const itemGroupController = require("../controllers/admin/itemGroupController.js");
const itemMappingController = require("../controllers/admin/itemMappingController.js");
const orderController = require("../controllers/admin/orderController.js");
const campaignController = require("../controllers/admin/campaignController.js");
const promotionController = require("../controllers/admin/promotionController.js");
const voucherController = require("../controllers/admin/voucherController.js");
const discountController = require("../controllers/admin/discountController.js");
const dashboardController = require("../controllers/admin/dashboardController.js");
const riderController = require("../controllers/admin/riderController.js");
const cmsController = require("../controllers/admin/cmsController.js");
const permissionController = require("../controllers/admin/permissionController.js");
const userController = require("../controllers/admin/userController.js");
const foodHubBoxController = require("../controllers/admin/foodHubBoxController.js");
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
const campaignUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 }
]);
const branchUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 }
]);
const cuisineUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mobile_banner', maxCount: 1 }
]);


const adminRouter = Router();

adminRouter.get("/", (req, res) => {
    res.json({ message: "Welcome to foodhub admin." });
});
//Dashboard
adminRouter.get("/get-dashboard-detail", [authJwt.verifyToken, authJwt.isAdmin], dashboardController.getDashboardDataByBranchId);
//Settings
adminRouter.get("/settings", [authJwt.verifyToken, authJwt.isAdmin], settingsController.getSettings);
adminRouter.post("/settings", [authJwt.verifyToken, authJwt.isAdmin], settingsUpload, settingsController.updateSettings);
//Address
adminRouter.get("/addresses", [authJwt.verifyToken, authJwt.isAdmin], addressController.getAllAddress);
adminRouter.get("/addresses/show?:id", [authJwt.verifyToken, authJwt.isAdmin], addressController.getAddressById);
adminRouter.post("/addresses", [authJwt.verifyToken, authJwt.isAdmin], addressController.createAddress);
adminRouter.put("/addresses?:id", [authJwt.verifyToken, authJwt.isAdmin], addressController.updateAddress);
adminRouter.delete("/addresses?:id", [authJwt.verifyToken, authJwt.isAdmin], addressController.deleteAddressById);
adminRouter.put("/addresses/status?:id", [authJwt.verifyToken, authJwt.isAdmin], addressController.changeStatusAddress);
//Restaurant
adminRouter.get("/restaurants", [authJwt.verifyToken, authJwt.isAdmin], restaurantController.getAllRestaurants);
adminRouter.get("/restaurants/show?:id", [authJwt.verifyToken, authJwt.isAdmin], restaurantController.getRestaurantById);
adminRouter.post("/restaurants", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), restaurantController.createRestaurant);
adminRouter.put("/restaurants?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), restaurantController.updateRestaurant);
adminRouter.put("/restaurants/status?:id", [authJwt.verifyToken, authJwt.isAdmin], restaurantController.changeStatusRestaurant);
adminRouter.delete("/restaurants?:id", [authJwt.verifyToken, authJwt.isAdmin], restaurantController.deleteRestaurantById);
//Restaurant
adminRouter.get("/branches", [authJwt.verifyToken, authJwt.isAdmin], branchController.getAllBranches);
// adminRouter.post("/branches/upload/image", upload.single('image'), branchController.uploadImage);
adminRouter.get("/branches/get-branch-by-restaurant?:restaurant", [authJwt.verifyToken, authJwt.isAdmin],branchController. getBranchByRestaurant);
adminRouter.get("/branches/show?:id", [authJwt.verifyToken, authJwt.isAdmin],branchController. getBranchById);
adminRouter.post("/branches", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), branchController.createBranch);
adminRouter.put("/branches?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), branchController.updateBranch);
adminRouter.put("/branches/status?:id", [authJwt.verifyToken, authJwt.isAdmin], branchController.changeStatusBranch);
adminRouter.delete("/branches?:id", [authJwt.verifyToken, authJwt.isAdmin], branchController.deleteBranchById);
adminRouter.delete("/branches?:id", [authJwt.verifyToken, authJwt.isAdmin], branchController.deleteBranchById);
adminRouter.get("/opening?:id", [authJwt.verifyToken, authJwt.isAdmin], branchController.getOpeningHoursBranchById);
adminRouter.post("/opening", [authJwt.verifyToken, authJwt.isAdmin], branchController.insertOpeningHours);

//Voucher
adminRouter.get("/vouchers", [authJwt.verifyToken, authJwt.isAdmin], voucherController.getAllVouchers);
adminRouter.get("/vouchers/show?:id", [authJwt.verifyToken, authJwt.isAdmin],voucherController. getVoucherById);
adminRouter.post("/vouchers", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), voucherController.createVoucher);
adminRouter.put("/vouchers?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), voucherController.updateVoucher);
adminRouter.put("/vouchers/status?:id", [authJwt.verifyToken, authJwt.isAdmin], voucherController.changeStatusVoucher);
adminRouter.delete("/vouchers?:id", [authJwt.verifyToken, authJwt.isAdmin], voucherController.deleteVoucherById);
//Category
adminRouter.get("/categories", [authJwt.verifyToken, authJwt.isAdmin], categoryController.getAllCategories);
adminRouter.get("/categories/pending", [authJwt.verifyToken, authJwt.isAdmin], categoryController.getAllPendingCategories);
adminRouter.get("/categories/show?:id", [authJwt.verifyToken, authJwt.isAdmin], categoryController.getCategoryById);
adminRouter.post("/categories", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'),categoryController.createCategory);
adminRouter.post("/categories/update", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'),categoryController.updateNewCategory);
adminRouter.put("/categories?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), categoryController.updateCategory);
adminRouter.delete("/categories?:id", [authJwt.verifyToken, authJwt.isAdmin], categoryController.deleteCategoryById);
adminRouter.put("/categories/status?:id", [authJwt.verifyToken, authJwt.isAdmin], categoryController.changeStatusCategory);
adminRouter.put("/categories/status-update?:id", [authJwt.verifyToken, authJwt.isAdmin], categoryController.updateCategoryStatusById);
//Cuisine
adminRouter.get("/cuisines", [authJwt.verifyToken, authJwt.isAdmin], cuisineController.getAllCuisines);
adminRouter.get("/cuisines/show?:id", [authJwt.verifyToken, authJwt.isAdmin], cuisineController.getCuisineById);
adminRouter.post("/cuisines", [authJwt.verifyToken, authJwt.isAdmin], cuisineUpload, cuisineController.createCuisine);
adminRouter.put("/cuisines?:id", [authJwt.verifyToken, authJwt.isAdmin], cuisineUpload, cuisineController.updateCuisine);
adminRouter.delete("/cuisines?:id", [authJwt.verifyToken, authJwt.isAdmin], cuisineController.deleteCuisineById);
adminRouter.put("/cuisines/status?:id", [authJwt.verifyToken, authJwt.isAdmin], cuisineController.changeStatusCuisine);
adminRouter.put("/cuisines/status-update?:id", [authJwt.verifyToken, authJwt.isAdmin], cuisineController.updateCuisineStatusById);
//Campaign
adminRouter.get("/promotions", [authJwt.verifyToken, authJwt.isAdmin], promotionController.getAllPromotions);
adminRouter.get("/promotions/show?:id", [authJwt.verifyToken, authJwt.isAdmin], promotionController.getPromotionById);
adminRouter.post("/promotions", [authJwt.verifyToken, authJwt.isAdmin], promotionController.createPromotion);
adminRouter.put("/promotions?:id", [authJwt.verifyToken, authJwt.isAdmin], promotionController.updatePromotion);
adminRouter.delete("/promotions?:id", [authJwt.verifyToken, authJwt.isAdmin], promotionController.deletePromotionById);
adminRouter.put("/promotions/status?:id", [authJwt.verifyToken, authJwt.isAdmin], promotionController.changeStatusPromotion);
adminRouter.put("/promotions/status-update?:id", [authJwt.verifyToken, authJwt.isAdmin], promotionController.updatePromotionStatusById);
//Discount
adminRouter.get("/discounts", [authJwt.verifyToken, authJwt.isAdmin], discountController.getAllDiscounts);
adminRouter.get("/discounts/show?:id", [authJwt.verifyToken, authJwt.isAdmin], discountController.getDiscountById);
adminRouter.post("/discounts", [authJwt.verifyToken, authJwt.isAdmin], discountController.createDiscount);
adminRouter.put("/discounts?:id", [authJwt.verifyToken, authJwt.isAdmin], discountController.updateDiscount);
adminRouter.delete("/discounts?:id", [authJwt.verifyToken, authJwt.isAdmin], discountController.deleteDiscountById);
adminRouter.put("/discounts/status?:id", [authJwt.verifyToken, authJwt.isAdmin], discountController.changeStatusDiscount);
// adminRouter.put("/discounts/status-update?:id", [authJwt.verifyToken, authJwt.isAdmin], discountController.updateDiscountStatusById);
//Promotion
adminRouter.get("/campaigns", [authJwt.verifyToken, authJwt.isAdmin], campaignController.getAllCampaigns);
adminRouter.get("/campaigns/show?:id", [authJwt.verifyToken, authJwt.isAdmin], campaignController.getCampaignById);
adminRouter.post("/campaigns", [authJwt.verifyToken, authJwt.isAdmin], campaignUpload, campaignController.createCampaign);
adminRouter.put("/campaigns?:id", [authJwt.verifyToken, authJwt.isAdmin], campaignUpload, campaignController.updateCampaign);
adminRouter.delete("/campaigns?:id", [authJwt.verifyToken, authJwt.isAdmin], campaignController.deleteCampaignById);
adminRouter.put("/campaigns/status?:id", [authJwt.verifyToken, authJwt.isAdmin], campaignController.changeStatusCampaign);
adminRouter.put("/campaigns/status-update?:id", [authJwt.verifyToken, authJwt.isAdmin], campaignController.updateCampaignStatusById);
//Ingredient
adminRouter.get("/ingredients", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.getAllIngredients);
adminRouter.get("/ingredients/show?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.getIngredientById);
adminRouter.post("/ingredients", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.createIngredient);
adminRouter.put("/ingredients?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.updateIngredient);
adminRouter.delete("/ingredients?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.deleteIngredientById);
adminRouter.put("/ingredients/status?:id", [authJwt.verifyToken, authJwt.isAdmin], ingredientController.updateIngredientStatusById);
//Rider
adminRouter.get("/riders", [authJwt.verifyToken, authJwt.isAdmin], riderController.getAllRiders);
adminRouter.get("/riders/show?:id", [authJwt.verifyToken, authJwt.isAdmin], riderController.getRiderById);
adminRouter.post("/riders", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), riderController.createRider);
adminRouter.put("/riders?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), riderController.updateRider);
adminRouter.delete("/riders?:id", [authJwt.verifyToken, authJwt.isAdmin], riderController.deleteRiderById);
adminRouter.put("/riders/status?:id", [authJwt.verifyToken, authJwt.isAdmin], riderController.updateRiderStatusById);
adminRouter.get("/riders/active-riders", [authJwt.verifyToken, authJwt.isAdmin], riderController.getActiveRiders);
adminRouter.get("/riders/active-order?:id", [authJwt.verifyToken, authJwt.isAdmin], riderController.getActiveRiderOrder);
adminRouter.post("/riders/rider-log", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), riderController.createRiderLog);
adminRouter.post("/riders/set-shifts", [authJwt.verifyToken, authJwt.isAdmin], riderController.setRiderShiftNextWeek);

//Item
adminRouter.get("/items", [authJwt.verifyToken, authJwt.isAdmin], itemController.getAllItems);
adminRouter.get("/items/show?:id", [authJwt.verifyToken, authJwt.isAdmin], itemController.getItemById);
adminRouter.post("/items", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), itemController.createItem);
adminRouter.put("/items?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), itemController.updateItem);
adminRouter.delete("/items?:id", [authJwt.verifyToken, authJwt.isAdmin], itemController.deleteItemById);
adminRouter.put("/items/status?:id", [authJwt.verifyToken, authJwt.isAdmin], itemController.updateItemStatusById);
adminRouter.get("/item-variants", [authJwt.verifyToken, authJwt.isAdmin], itemController.getItemVariants);
adminRouter.post("/item-variants/update", [authJwt.verifyToken, authJwt.isAdmin], itemController.updateItemVariants);
adminRouter.post("/store-item-variants", [authJwt.verifyToken, authJwt.isAdmin], itemController.setItemVariants);
//Item Group
adminRouter.get("/groups", [authJwt.verifyToken, authJwt.isAdmin], itemGroupController.getAllItemGroups);
adminRouter.get("/groups/show?:id", [authJwt.verifyToken, authJwt.isAdmin], itemGroupController.getItemGroupById);
adminRouter.get("/groups/choice?:id", [authJwt.verifyToken, authJwt.isAdmin], itemGroupController.getItemGroupByIds);
adminRouter.post("/groups", [authJwt.verifyToken, authJwt.isAdmin], itemGroupController.createItemGroup);
adminRouter.put("/groups?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), itemGroupController.updateItemGroup);
adminRouter.delete("/groups?:id", [authJwt.verifyToken, authJwt.isAdmin], itemGroupController.deleteItemGroupById);
adminRouter.put("/groups/status?:id", [authJwt.verifyToken, authJwt.isAdmin], itemGroupController.updateItemGroupStatusById);

//Item Mapping
adminRouter.get("/item-mappings", [authJwt.verifyToken, authJwt.isAdmin], itemMappingController.getAllItemMappings);
adminRouter.post("/item-mappings", [authJwt.verifyToken, authJwt.isAdmin], itemMappingController.createItemMapping);
adminRouter.get("/item-mappings/show?:id", [authJwt.verifyToken, authJwt.isAdmin], itemMappingController.getItemMappingById);
adminRouter.put("/item-mappings/update?:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), itemMappingController.updateItemMapping);
adminRouter.put("/item-mappings/status?:id", [authJwt.verifyToken, authJwt.isAdmin], itemMappingController.updateItemMappingStatusById);


//Order
adminRouter.get("/orders", [authJwt.verifyToken, authJwt.isAdmin], orderController.getOrdersWithType);
adminRouter.get("/orders/show/:id", [authJwt.verifyToken, authJwt.isAdmin], orderController.getOrderDetail);
adminRouter.put("/orders/status?:id", [authJwt.verifyToken, authJwt.isAdmin], orderController.changeStatusOrder);
adminRouter.put("/orders/deliver?:id", [authJwt.verifyToken, authJwt.isAdmin], orderController.setDeliveryManOrder);
//Customer
adminRouter.get("/customers", [authJwt.verifyToken, authJwt.isAdmin], customerController.getAllCustomers);
adminRouter.get("/customers/get-customers", [authJwt.verifyToken, authJwt.isAdmin], customerController.getCustomers);
adminRouter.get("/customers/show?:id", [authJwt.verifyToken, authJwt.isAdmin], customerController.getCustomerById);
adminRouter.post("/customers", [authJwt.verifyToken, authJwt.isAdmin], customerController.createCustomer);
adminRouter.put("/customers?:id", [authJwt.verifyToken, authJwt.isAdmin], customerController.updateCustomer);
adminRouter.delete("/customers?:id", [authJwt.verifyToken, authJwt.isAdmin], customerController.deleteCustomerById);
adminRouter.put("/customers/status?:id", [authJwt.verifyToken, authJwt.isAdmin], customerController.updateCustomerStatusById);
//Cms page
adminRouter.get("/pages", [authJwt.verifyToken, authJwt.isAdmin], cmsController.getAllPages);
adminRouter.get("/pages/show?:id", [authJwt.verifyToken, authJwt.isAdmin], cmsController.getPageById);
adminRouter.post("/pages", [authJwt.verifyToken, authJwt.isAdmin], cuisineUpload, cmsController.createPage);
adminRouter.put("/pages?:id", [authJwt.verifyToken, authJwt.isAdmin], cuisineUpload, cmsController.updatePage);
adminRouter.delete("/pages?:id", [authJwt.verifyToken, authJwt.isAdmin], cmsController.deletePageById);
adminRouter.put("/pages/status?:id", [authJwt.verifyToken, authJwt.isAdmin], cmsController.changeStatusPage);
//Permission
adminRouter.get("/permissions", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getAllPermissions);
adminRouter.get("/get-users", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getAllAdminUser);
adminRouter.get("/get-linked-users?:phone", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getLinkToUser);
adminRouter.post("/set-linked-users?:phone", [authJwt.verifyToken, authJwt.isAdmin], permissionController.saveUserPermission);
adminRouter.get("/role", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getRoles);
adminRouter.get("/role/get-all-role", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getAllRoles);
adminRouter.post("/role", [authJwt.verifyToken, authJwt.isAdmin], permissionController.saveUserRole);
adminRouter.put("/role?:id", [authJwt.verifyToken, authJwt.isAdmin], permissionController.updateUserRole);
adminRouter.delete("/role?:id", [authJwt.verifyToken, authJwt.isAdmin], permissionController.deleteUserRole);
adminRouter.post("/save-or-update-permission", [authJwt.verifyToken, authJwt.isAdmin], permissionController.saveUpdateRoleWiseScreen);
//Submodule
adminRouter.get("/module/get-all-submodule", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getAllSubmodule);
//Screen
adminRouter.get("/screen/get-all-screen", [authJwt.verifyToken, authJwt.isAdmin], permissionController.getRoleWiseScreen);
//User
adminRouter.get("/user/get-all-users", [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers);
adminRouter.get("/user/get-associated-users", [authJwt.verifyToken, authJwt.isAdmin], userController.getAssociatedUsers);
adminRouter.post("/user/save-user", [authJwt.verifyToken, authJwt.isAdmin], userController.saveUser);
adminRouter.put("/user/update-user", [authJwt.verifyToken, authJwt.isAdmin], userController.updateUser);
adminRouter.put("/user/update-user-status?:id", [authJwt.verifyToken, authJwt.isAdmin], userController.updateUserStatus);
//Foodhub box
adminRouter.get("/foodhubbox/get-foodhub-box-branches", foodHubBoxController.getFoodhubBoxBranches);
adminRouter.get("/foodhubbox/get-foodhub-box-settings", foodHubBoxController.getFoodhubBoxSettings);
export default adminRouter;