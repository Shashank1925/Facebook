import express from "express";
import multer from "multer";
import { userRegistration, userLogin, userLogout, userLogoutAllDevices } from "./user.controller.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
const none = multer().none();
const authenticationRouter = express.Router();
authenticationRouter.post("/signup", none, (req, res, next) => {
    userRegistration(req, res, next);
});
authenticationRouter.post("/signin", none, (req, res, next) => {
    userLogin(req, res, next);
});
authenticationRouter.post("/logout", jwtAuth, (req, res, next) => {
    userLogout(req, res, next);
})
authenticationRouter.post("/logout-all-devices", jwtAuth, (req, res, next) => {
    userLogoutAllDevices(req, res, next);
})
export default authenticationRouter;