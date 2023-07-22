// authRoute.js
import { Router } from "express";
const { verifySignUp } = require("../middlewares");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { authJwt } = require("../middlewares");
// const passport = require('passport');

const authRouter = Router();
// authRouter.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });
authRouter.post(
    "/signup",
    [
      verifySignUp.checkDuplicateUsernameOrPhone,
      verifySignUp.checkRolesExisted
    ],
    authController.signup
  );
  // authRouter.get('/facebook', authController.facebookOAuth);
  // authRouter.get('/google', passport.authenticate("google", { scope: ["email", "profile"] }));
  // authRouter.get('/google/callback', authController.googleOAuth);
  authRouter.post("/signin", authController.signin);
  authRouter.post("/otp/phone", authController.optPhoneOAuth);
  authRouter.post("/otp/verify", authController.verifyOtp);
  authRouter.post("/admin/signin", authController.signinadmin);
  authRouter.post("/user/signinvendor", authController.signinvendor);
  authRouter.post("/signinrider", authController.signinrider);
  authRouter.post("/refreshtoken", authController.refreshToken);

  authRouter.post("/check-phone-user", userController.checkPhoneForUser);
  authRouter.post("/check-email-user", userController.checkEmailForUser);
  authRouter.post("/register-restaurant", userController.registerRestaurant);

// authRouter.post("/signup", signup);
// authRouter.post("/signin", signinAuth, signin);
// authRouter.post("/signout", signoutController);

export default authRouter;