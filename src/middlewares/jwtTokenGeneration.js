import jwt from 'jsonwebtoken';
import ErrorMiddleware from "./errorMiddleware.js";
import dotenv from 'dotenv';
dotenv.config();
export default function jwtToken(info) {
    try {
        const { email, id } = info;
        if (!email || !id) {
            throw new ErrorMiddleware("User ID and email missing for token generation", 400);
        }
        const payload = {
            userId: id.toString(),
            userEmail: email,
        }
        // this is private Key which is used to generate the token
        const privateKey = process.env.JWT__SECRET;
        const token = jwt.sign(payload, privateKey, { expiresIn: "24h" });
        if (!token) {
            throw new ErrorMiddleware("Token generation failed", 500);
        }
        return token;
    } catch (error) {
        throw error;
    }
}