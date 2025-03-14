import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import postModel from "../posts/postsSchema.js";
import { postCommentRepo, getAllCommentsRepo, updateCommentRepo, deleteCommentRepo } from "./commentsRepository.js";
// This is for posting comment on a perticular post
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
};
// This is for updating a comment by a user
export const updateCommentController = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new ErrorMiddleware("Invalid comment id", 400);
        }
        const { comment } = req.body;
        if (!comment) {
            throw new ErrorMiddleware("Please provide comment", 400);
        }
        const userId = req.userId;
        if (!userId) {
            throw new ErrorMiddleware("Invalid user id", 400);
        }
        const post = await postModel.findOne({ "Comment._id": commentId });
        if (!post) {
            throw new ErrorMiddleware("Post not found for this comment", 404);
        }
        const postId = post._id;
        const commentData = {
            userId: userId,
            Caption: comment
        };
        const updatedComment = await updateCommentRepo(postId, commentId, commentData, next);
        if (!updatedComment) {
            throw new ErrorMiddleware("Comment not updated", 400);
        }
        res.status(200).json({
            status: "Comment updated successfully",
            updatedComment
        });
    } catch (error) {
        next(error);
    }
};
// This is for deleting a comment by a user or comment owner
export const deleteCommentController = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new ErrorMiddleware("Invalid comment id", 400);
        }

        const userId = req.userId;
        if (!userId) {
            throw new ErrorMiddleware("Invalid user id", 400);
        }
        const post = await postModel.findOne({ "Comment._id": commentId });
        if (!post) {
            throw new ErrorMiddleware("Post not found for this comment", 404);
        }
        const postId = post._id;
        const deletedComment = await deleteCommentRepo(postId, commentId, userId, next);
        if (!deletedComment) {
            throw new ErrorMiddleware("Comment not deleted", 400);
        }

        res.status(200).json({
            status: "Comment deleted successfully",
            deletedComment
        });
    } catch (error) {
        next(error);
    }
};
