import bcrypt from "bcrypt";
import ErrorMiddleware from "../middlewares/errorMiddleware.js";
export const hashPassword = async (password, next) => {
    try {
        return await bcrypt.hash(password, 12);
    } catch (error) {
        next(new ErrorMiddleware("encounterd error in hashing password", 400));
    }
};
export const compareHashedPassword = async (password, hashPassword, next) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        next(
            new ErrorMiddleware(
                "encounterd error in comparing hashed password",
                400
            )
        );
    }
};
