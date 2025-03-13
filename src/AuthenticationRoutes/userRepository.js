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
        const token = jwtToken({ email: user.email, id: user._id });
        user.tokens.push({ token });
        await user.save();

        return { success: true, res: user, token };
    } catch (error) {
        next(error);
    }
};


