import Model from "../models/index.js";
import _ from "lodash"; // lodash import
import { findOrCreate } from "./index.js";
import { hashPassword } from "../libs/passwordOp.js";
import catchAsync from "../libs/catchAsync.js";

const { user } = Model;

export const signupService = catchAsync(async (req, res, next) => {
  const password = await hashPassword(req.body.password);
  const email = req.body.email.toLowerCase();
  const [resultUser, created] = await findOrCreate(user, {
    ...req.body,
    password,
    email
  });
  if (!created) {
    return res.status(400).json({
      status: "fail",
      message: "user already exist"
    });
  }
  return res.status(201).json({
    status: "success",
    message: "user successfully created",
    payload: _.omit(resultUser.toJSON(), ["email_verified_at","remember_token","password", "updatedAt", "createdAt"])
  });
});