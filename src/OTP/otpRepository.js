import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import userSchema from "../AuthenticationRoutes/userSchema.js";
import nodemailer from "nodemailer";
import { hashPassword } from "../utility/hashPassword.js";
const UserModel = mongoose.model("User", userSchema);
// here is function for generaing otp 
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};
// Here is the function for sending otp to user email
const sentOtpEmail = async (email, otp, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorMiddleware.CustomError("User not found", 404);
        }
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "OTP for password reset",
            text: `Your OTP is ${otp}`,
        });
    } catch (error) {
        next(error);
    }
};

// Here is the function for requesting password reset
export const requestPasswordResetRepo = async (email, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        const otp = generateOtp();
        user.resetOTP = otp;
        // this is otp expiray time for 5 minutes
        user.otpExpiry = Date.now() + 300000;
        await user.save();
        await sentOtpEmail(email, otp, next);
        return user;
    } catch (error) {
        next(error);
    }
};
// Here is the function for verifying otp
export const verifyOtp = async (email, otp, newPassword, next) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        if (user.resetOTP !== otp) {
            throw new ErrorMiddleware("Invalid OTP", 400);
        }
        if (user.otpExpiry < Date.now()) {
            throw new ErrorMiddleware("OTP expired", 400);
        }
        const hashedPassword = await hashPassword(newPassword, next);
        user.password = hashedPassword;
        user.resetOTP = null;
        user.otpExpiry = null;
        await user.save();
        return user;
    }
    catch (error) {
        next(error);
    }
}