import express from "express";
import multer from "multer";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
import { postCommentController, getAllCommentsController, updateCommentController, deleteCommentController } from "./commentsController.js";
const commentsRouter = express.Router();
const none = multer().none();
commentsRouter.post("/:postId", jwtAuth, none, (req, res, next) => {
    postCommentController(req, res, next);
});
commentsRouter.get("/:postId", jwtAuth, (req, res, next) => {
    getAllCommentsController(req, res, next);
});
commentsRouter.put("/:commentId", jwtAuth, none, (req, res, next) => {
    updateCommentController(req, res, next);
});
commentsRouter.delete("/:commentId", jwtAuth, (req, res, next) => {
    deleteCommentController(req, res, next);
});
export default commentsRouter;