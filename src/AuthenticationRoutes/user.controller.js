import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import bcrypt from 'bcrypt';
import { userRegisterationRepository, userLoginRepository } from './userRepository.js';
import jwtToken from "../middlewares/jwtTokenGeneration.js";
import { sentEmail } from "../middlewares/nodeMailer.Middleware.js";
import mongoose from "mongoose";
import userSchema from "./userSchema.js";
const UserModel = mongoose.model("User", userSchema);

export const userRegistration = async (req, res, next) => {
    try {
        let { name, email, password, gender } = req.body;
        password = await bcrypt.hash(password, 12);
        const registeredUser = await userRegisterationRepository(name, email, password, gender, next);
        if (!registeredUser.success)
            return;
        sentEmail(email);
        if (!sentEmail)
            throw new ErrorMiddleware("Email not sent", 400);
        res.status(201).json({
            success: true,
            msg: `Congratulation! ${name.toUpperCase()} registration successful`,
        });
    }
    catch (error) {
        next(error);
    }
};
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userLoginRepository(email, password, next);
        if (!user.success) { throw new ErrorMiddleware("User not found", 404); }
        res.status(200).json({
            success: true,
            msg: "Congratulation! login successful",
            token: user.token,
        });
    }
    catch (error) {
        next(error);
    }
};
// this method is for logout 
export const userLogout = async (req, res, next) => {
    try {
        const userEmail = req.userEmail;
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }

        const token = req.headers["authorization"];
        if (!token) {
            throw new ErrorMiddleware("Token not found", 401);
        }

        user.tokens = user.tokens.filter((storedToken) => storedToken.token !== token);
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Successfully logged out",
        });
    } catch (error) {
        next(error);
    }
};
// This is for user logout From all Devices
export const userLogoutAllDevices = async (req, res, next) => {
    try {
        const email = req.userEmail;
        const userAllDevices = await UserModel.findOne({ email: email });
        if (!userAllDevices) {
            throw new ErrorMiddleware("User not found", 404);
        }
        userAllDevices.tokens = [];
        await userAllDevices.save();
        res.status(200).json({
            success: true,
            msg: "Logout from all devices",
        });
    }
    catch (error) {
        next(error);
    }
}

