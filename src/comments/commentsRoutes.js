import express from "express";
import multer from "multer";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
import { postCommentController, getAllCommentsController } from "./commentsController.js";
const commentsRouter = express.Router();
const none = multer().none();
commentsRouter.post("/:postId", jwtAuth, none, (req, res, next) => {
    postCommentController(req, res, next);
});
commentsRouter.get("/:postId", jwtAuth, (req, res, next) => {
    getAllCommentsController(req, res, next);
});
export default commentsRouter;