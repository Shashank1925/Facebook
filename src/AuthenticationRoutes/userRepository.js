import mongoose from "mongoose";
import userSchema from "./userSchema.js";
import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { compareHashedPassword } from "../utility/hashPassword.js";
import jwtToken from "../middlewares/jwtTokenGeneration.js";

const UserModel = mongoose.model("User", userSchema);

export const userRegisterationRepository = async (name, email, password, gender, next) => {
    try {
        if (!name || !email || !password || !gender) { throw new ErrorMiddleware("All fields are required", 400); }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new ErrorMiddleware("User already exists", 409);
        }
        else {
            const newUser = new UserModel({ name, email, password, gender });
            await newUser.save();
            return { success: true, res: newUser };
        }
    } catch (error) {
        next(error);
    }
};

export const userLoginRepository = async (email, password, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        const passwordMatched = await compareHashedPassword(password, user.password);
        if (!passwordMatched) {
            throw new ErrorMiddleware("Password does not match", 400);
        }
        console.log(user._id);
        const token = jwtToken({ email: user.email, id: user._id.toString() });
        user.tokens.push({ token });
        await user.save();

        return { success: true, res: user, token };
    } catch (error) {
        next(error);
    }
};
export const updateUserProfile = async (id, gender, profilePicture, next) => {
    try {
        const user = await UserModel.findById(id);

        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        //  Update Only If Values Are Provided
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = profilePicture;
        await user.save();
        return { success: true, profilePicture: user.profilePicture };
    } catch (error) {
        next(error);
    }
};
// This method is for getting all users 
export const getAllUsersRepository = async (next) => {
    try {
        const users = await UserModel.find().select("-password").lean();
        return { users };
    } catch (error) {
        next(error);
    }
};
export const getSpecificUserRepository = async (id, next) => {
    try {
        const user = await UserModel.findById(id).select("-password").lean();
        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        console.log(user);
        return user;
    } catch (error) {
        next(error);
    }
};
