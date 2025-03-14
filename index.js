import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import loggerMiddleware from "./src/middlewares/loggerMiddlerware.js";
import ErrorMiddleware from "./src/middlewares/errorMiddleware.js";
// These are the routes imports
import authenticationRouter from "./src/AuthenticationRoutes/authenticationRoutes.js";
import postsRouter from "./src/posts/postsRoutes.js";
import commentsRouter from "./src/comments/commentsRoutes.js";
import likesRouter from "./src/likes/likesRoutes.js";
import friendshipRouter from "./src/friendship/friendshipRoutes.js";
// This is for connecting to mongoDB
import connectToDb from "./src/mongoDB/mongoDb.js";
// This is for cors policy
import cors from 'cors';
// This is for parsing the body
import cookieParser from "cookie-parser";
// This is for creating server
const server = express();
// this is for cors policy middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// this is for logger middleware
server.use(loggerMiddleware);
server.use(cookieParser());
// this is for user router
server.use("/api/users", authenticationRouter);
// This is for posts router
server.use("/api/posts", postsRouter);
// This is for comments router
server.use("/api/comments", commentsRouter);
// This is for likes router
server.use("/api/likes", likesRouter);
// This is for friendship router
server.use("/api/friends", friendshipRouter);
// This is for global error handler
server.use(ErrorMiddleware.globalErrorHandler);
// this is port number 
const Port = 3000;
// this is server to listen port number 5000 
server.listen(Port, () => {
    connectToDb();
    console.log(`server is running on port ${Port}`);
});