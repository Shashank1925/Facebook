import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import ErrorMiddleware from "./src/middlewares/errorMiddleware.js";
import authenticationRouter from "./src/AuthenticationRoutes/authenticationRoutes.js";
import connectToDb from "./src/mongoDB/mongoDb.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
const server = express();
// this is for cors policy 
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
// this is for user router
server.use("/api/users", authenticationRouter);
server.use(ErrorMiddleware.globalErrorHandler);
// this is port number 
const Port = 3000;
// this is server to listen port number 5000 
server.listen(Port, () => {
    connectToDb();
    console.log(`server is running on port ${Port}`);
});