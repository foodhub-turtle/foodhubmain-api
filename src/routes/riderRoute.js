import { Router } from "express";
import { checkPhoneForUser } from "../controllers/userController.js";
const controller = require("../controllers/authController.js");
const riderController = require("../controllers/rider/riderController.js");
const orderController = require("../controllers/rider/orderController.js");
const paymentController = require("../controllers/rider/paymentController.js");

const { authJwt } = require("../middlewares");

const router = Router();

//Rider Auth
router.post("/check-phone-user", checkPhoneForUser);
router.put("/update-user-password?:id", [authJwt.verifyToken], controller.updateUserPassword);

//Rider Profile
router.get("/profile?:id", [authJwt.verifyToken], riderController.getRiderProfile);
//Rider
router.get("/active-order?:id", [authJwt.verifyToken, authJwt.isRider], riderController.getActiveRiderOrder);
router.get("/all-order?:id", [authJwt.verifyToken, authJwt.isRider], riderController.getAllDeliveries);
router.get("/get-active-shift?:id", [authJwt.verifyToken, authJwt.isRider], riderController.getOngoingShift);
router.get("/get-all-shift?:id", [authJwt.verifyToken, authJwt.isRider], riderController.getUpcomingShift);
router.get("/get-shift", [authJwt.verifyToken, authJwt.isRider], riderController.getAllShift);
router.post("/active-shift", [authJwt.verifyToken, authJwt.isRider], riderController.activeOngoingShift);
router.put("/deactive-shift", [authJwt.verifyToken, authJwt.isRider], riderController.deactiveOngoingShift);
router.post("/take-shift", [authJwt.verifyToken, authJwt.isRider], riderController.setRiderShift);
router.get("/get-absent-shifts", [authJwt.verifyToken, authJwt.isRider], riderController.getAbsentShift);
router.get("/get-non-taken-shifts", [authJwt.verifyToken, authJwt.isRider], riderController.getShiftNotTaken);
router.get("/get-rider-shifts", [authJwt.verifyToken, authJwt.isRider], riderController.getRiderShift);
router.get("/get-rider-shift-history", [authJwt.verifyToken, authJwt.isRider], riderController.getRiderShiftHistory);
//order
router.post("/accept-order", [authJwt.verifyToken, authJwt.isRider], orderController.acceptOrder);
router.post("/change-order-status", [authJwt.verifyToken, authJwt.isRider], orderController.orderStatusChange);
router.get("/orders/show/:id", [authJwt.verifyToken], orderController.getOrderDetail);
//Payment
router.get("/get-weekly-payment", [authJwt.verifyToken, authJwt.isRider], paymentController.getRiderMonthlyPayments);

export default router;