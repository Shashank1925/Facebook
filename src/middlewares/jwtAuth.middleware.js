import jwt from "jsonwebtoken";
import ErrorMiddleware from "./errorMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
export default function jwtAuth(req, res, next) {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            throw new ErrorMiddleware("Token not found", 401);
        }
        const privateKey = process.env.JWT__SECRET;
        const decodedToken = jwt.verify(token, privateKey);
        if (!decodedToken) {
            throw new ErrorMiddleware("Token verification failed", 401);
        }
        req.userId = decodedToken.userId;
        req.userEmail = decodedToken.userEmail;
        next();
    } catch (error) {
        next(error);
    }
}