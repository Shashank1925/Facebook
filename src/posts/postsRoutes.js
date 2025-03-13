import express from "express";
import { getAllPostsController, createPostController, getUserAllPostsController, getPostByIdController, deletePostByIdController, updatePostByIdController } from "./postsController.js";
import multer from "multer";
import upload from "../middlewares/multerMiddleware.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
const postsRouter = express.Router();
const none = multer().none();
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
postsRouter.delete("/:postId", jwtAuth, (req, res, next) => {
    deletePostByIdController(req, res, next);
});
postsRouter.put("/:postId", jwtAuth, none, (req, res, next) => {
    updatePostByIdController(req, res, next);
});
export default postsRouter;