import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import bcrypt from 'bcrypt';
import { userRegisterationRepository, userLoginRepository, updateUserProfile, getAllUsersRepository, getSpecificUserRepository } from './userRepository.js';
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
        const userUpdate = await UserModel.findOne({ email });
        const user = await userLoginRepository(email, password, next);
        if (!user.success) { throw new ErrorMiddleware("User not found", 404); }
        console.log(user._id);
        res.status(200).json({
            success: true,
            msg: "Congratulation! login successful",
            token: user.token,
            user: userUpdate._id,
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
// This method is for updating user Information 
export const updateUserInformation = async (req, res, next) => {
    try {
        const { gender } = req.body;
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ErrorMiddleware("Invalid User ID", 400);
        }
        const profilePicture = req.file ? req.file.path : null;
        const result = await updateUserProfile(userId, gender, profilePicture, next);

        res.status(200).json({
            result,
            success: true,
            msg: "User information updated successfully",
        });
    } catch (error) {
        next(error);
    }
};
// this is for getting all users
export const getAllUsers = async (req, res, next) => {
    try {
        const result = await getAllUsersRepository(next);
        res.status(200).json({
            result,
            success: true,
            msg: "All users",
        });
    } catch (error) {
        next(error);
    }
};
// This is for getting specific user
export const getSpecificUser = async (req, res, next) => {
    try {
        const id = req.params.userId;
        const result = await getSpecificUserRepository(id, next);
        res.status(200).json({
            result,
            success: true,
            msg: "User",
        });
    } catch (error) {
        next(error);
    }
};


