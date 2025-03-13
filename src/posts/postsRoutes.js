import express from "express";
import { getAllPostsController, createPostController, getUserAllPostsController, getPostByIdController } from "./postsController.js";
import upload from "../middlewares/multerMiddleware.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
const postsRouter = express.Router();
// This route is for get all posts
postsRouter.get("/all", (req, res, next) => {
    getAllPostsController(req, res, next);
});
// This route is for creating a post
postsRouter.post("/", jwtAuth, upload.single("image"), (req, res, next) => {
    createPostController(req, res, next);
});
postsRouter.get("/user/:id", jwtAuth, (req, res, next) => {
    getUserAllPostsController(req, res, next);
});
postsRouter.get("/:postId", jwtAuth, (req, res, next) => {
    getPostByIdController(req, res, next);
});
export default postsRouter;