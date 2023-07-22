import { Router } from "express";
import { jwtProtect } from "../middlewares/jwtAuthMiddleware.js";
const controller = require("../controllers/authController.js");
const orderController = require("../controllers/user/orderController.js");
const addressController = require("../controllers/user/addressController.js");
const restaurantController = require("../controllers/user/restaurantController.js");
const branchController = require("../controllers/user/branchController.js");
const storeController = require("../controllers/user/storeController.js");
const itemController = require("../controllers/user/itemController.js");
const promotionController = require("../controllers/user/promotionController.js");
const campaignController = require("../controllers/user/campaignController.js");
const settingsController = require("../controllers/user/settingsController.js");
const voucherController = require("../controllers/user/voucherController.js");
const searchController = require("../controllers/user/searchController.js");
const reviewController = require("../controllers/user/reviewController.js");
const foodHubBoxController = require("../controllers/user/foodHubBoxController.js");
// const cmsController = require("../controllers/user/cmsController.js");

const { authJwt } = require("../middlewares");

const router = Router();
//Setting
router.get("/settings", settingsController.getSettings);
router.put("/update-user-password?:id", [authJwt.verifyToken], controller.updateUserPassword);
router.put("/set-user-password?:phone", controller.setUserPassword);
router.put("/update-user-profile?:id", [authJwt.verifyToken], controller.updateUserProfile);
//Address
router.get("/addresses", [authJwt.verifyToken], addressController.getAllAddress);
router.get("/addresses/show?:id", [authJwt.verifyToken], addressController.getAddressById);
router.get("/addresses/active?:id", [authJwt.verifyToken], addressController.getActiveAddressById);
router.post("/addresses", [authJwt.verifyToken], addressController.createAddress);
router.put("/addresses?:id", [authJwt.verifyToken], addressController.updateAddress);
router.delete("/addresses?:id", [authJwt.verifyToken], addressController.deleteAddressById);
router.put("/addresses/status?:id", [authJwt.verifyToken], addressController.changeStatusAddress);
router.get("/addressetypes", [authJwt.verifyToken], addressController.getAllAddressType);
//Restaurant
router.get("/restaurants", restaurantController.getAllRestaurants);
router.get("/restaurants/show?:id", restaurantController.getRestaurantById);
//Branch
router.get("/restaurants/filter", branchController.getAllBranchsWithQueries);
router.get("/restaurants/query", branchController.getAllBranchsForCustomer);
router.post("/restaurants/favourite", branchController.setFavouriteBranch);
router.get("/restaurants/your?:customer_id", branchController.getAllYourBranchs);
router.get("/restaurants/favourite?:customer_id", branchController.getAllFavouriteBranchs);
router.get("/recommended-restaurants", branchController.getAllRecommandedBranchs);
router.get("/cuisines", branchController.getAllCuisines);
router.get("/business-categories", branchController.getAllBusinessCategories);
//Voucher
router.get("/vouchers", [authJwt.verifyToken], voucherController.getAllVouchers);
router.get("/vouchers/list", [authJwt.verifyToken], voucherController.getVoucherWithType);
router.get("/vouchers/check-voucher?:voucher", [authJwt.verifyToken], voucherController.checkVoucher);
//Store
router.get("/stores/filter", storeController.getAllStoresWithQueries);
//item
router.get("/items/restaurants?:id", itemController.getAllItemsByRestaurantId);
router.get("/items?:name", itemController.branchItemFilter);
router.get("/items/:itemid/:restaurantid", itemController.getItemByRestaurantId);
//Order
router.get("/orders/show/:id", [authJwt.verifyToken], orderController.getOrderDetail);
router.get("/orders/active?:id", [authJwt.verifyToken], orderController.getOrdersActive);
router.get("/orders/only-active?:id", [authJwt.verifyToken], orderController.getActiveOrdersOnly);
router.get("/orders/get-review-branch/:id/:order", [authJwt.verifyToken], orderController.checkUnreviewedOrder);
router.get("/orders/branch-reviews?:id", [authJwt.verifyToken], orderController.getAllUnreviewedOrder);
router.post("/orders", [authJwt.verifyToken], orderController.setCartToOrder);
router.put("/orders/:id", [authJwt.verifyToken], orderController.updateCart);
router.delete("/orders/:id", [authJwt.verifyToken], orderController.deleteOrderItemById);
// router.get("/orders/show/:id", [authJwt.verifyToken], orderController.getOrderDetail);

//Campaigns
router.get("/campaigns", campaignController.getAllCampaigns);
router.get("/campaigns/show?:id", campaignController.getCampaignById);
router.get("/campaigns/single?:key", campaignController.getCampaignByURLKEY);
//Promotions
router.get("/promotions", promotionController.getAllPromotions);
router.get("/promotions/show?:id", promotionController.getPromotionById);
//Search
router.get("/search", searchController.getPopularSearch);
router.get("/popularsearch", searchController.getSavedPopularSearch);
//cms
// router.get("/cms/page?url_key=:id", cmsController.getCMSPage);
//review
router.post("/reviews", [authJwt.verifyToken], reviewController.setReviewByCustomer);
//FoodhubBox
router.get("/get-foodhub-box-branches", foodHubBoxController.getFoodhubBoxBranches);


//rider

export default router;