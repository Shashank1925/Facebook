import express from "express";
import multer from "multer";
import { userRegistration, userLogin, userLogout, userLogoutAllDevices, updateUserInformation, getAllUsers, getSpecificUser } from "./user.controller.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
import upload from "../middlewares/multerMiddleware.js";
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
authenticationRouter.put("/update-details/:userId", jwtAuth, upload.single("profilePicture"), (req, res, next) => {
    updateUserInformation(req, res, next);
})
authenticationRouter.get("/get-all-details", (req, res, next) => {
    getAllUsers(req, res, next);
});
authenticationRouter.get("/get-details/:userId", jwtAuth, (req, res, next) => {
    getSpecificUser(req, res, next);
});
export default authenticationRouter;