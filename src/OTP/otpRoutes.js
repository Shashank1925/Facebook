import express from "express";
import multer from "multer";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
import { requestPasswordReset, resetPasswordController } from "./otpController.js";
const otpRouter = express.Router();
const none = multer().none();
otpRouter.post("/send", jwtAuth, none, (req, res, next) => {
    requestPasswordReset(req, res, next);
});
otpRouter.post("/verify", jwtAuth, none, (req, res, next) => {
    resetPasswordController(req, res, next);
});
export default otpRouter;