import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { postCommentRepo, getAllCommentsRepo } from "./commentsRepository.js";
export const postCommentController = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const { comment } = req.body;
        if (!comment) {
            throw new ErrorMiddleware("Please provide comment", 400);
        }
        const userId = req.userId;
        if (!userId) {
            throw new ErrorMiddleware("Invalid user id", 400);
        }
        const commentData = {
            userId: userId,
            Caption: comment
        };
        const postedComment = await postCommentRepo(postId, commentData, next);
        if (!postedComment) {
            throw new ErrorMiddleware("Comment not posted", 400);
        }
        res.status(200).json({
            status: "Comment posted successfully",
            postedComment
        });
    } catch (error) {
        next(error);
    }
};
// This is for getting all comments
export const getAllCommentsController = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const comments = await getAllCommentsRepo(postId, next);
        if (!comments) {
            throw new ErrorMiddleware("No comments found", 404);
        }
        res.status(200).json({
            status: "Comments fetched successfully",
            comments: comments
        });
    }
    catch (error) {
        next(error);
    }
}