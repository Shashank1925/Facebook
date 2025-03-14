import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { requestPasswordResetRepo, verifyOtp } from "./otpRepository.js";
export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await requestPasswordResetRepo(email, next);
        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        res.status(200).json({
            status: "OTP sent successfully",
            user: user,
        });
    } catch (error) {
        next(error);
    }
};
// This method is for reset Password 
export const resetPasswordController = async (req, res, next) => {
    try {
        const { email, password, otp } = req.body;
        if (!email || !password || !otp) {
            throw new ErrorMiddleware("All fields are required", 400);
        }
        const user = await verifyOtp(email, otp, password, next);
        if (!user) {
            throw new ErrorMiddleware("User not found", 404);
        }
        res.status(200).json({
            status: "Password reset successfully",
            user: user
        })
    } catch (error) {
        next(error);
    }
}