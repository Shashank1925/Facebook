import postModel from "../posts/postsSchema.js";
import ErrorMiddleware from "../middlewares/errorMiddleware.js";
export const postCommentRepo = async (postId, comment, next) => {
    try {
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const post = await postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        const newComment = {
            userId: comment.userId,
            Comments: comment.Caption,
        }
        post.Comment.push(newComment);
        await post.save();
        return post;
    } catch (error) {
        next(error);
    }
};
export const getAllCommentsRepo = async (postId, next) => {
    try {
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const post = await postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        const comments = post.Comment;
        return comments;
    } catch (error) {
        next(error);
    }
};
// This is for updating a comment by a user
export const updateCommentRepo = async (postId, commentId, comment, next) => {
    try {
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const post = await postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        const commentIndex = post.Comment.findIndex((comment) => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            throw new ErrorMiddleware("Comment not found", 404);
        }
        post.Comment[commentIndex].Comments = comment.Caption;
        await post.save();
        return post;
    }
    catch (error) {
        next(error);
    }
};
// This is for deleting a comment by a user or comment owner
export const deleteCommentRepo = async (postId, commentId, userId, next) => {
    try {
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const post = await postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        const commentIndex = post.Comment.findIndex((comment) => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            throw new ErrorMiddleware("Comment not found", 404);
        }
        const commentOwnerId = post.Comment[commentIndex].userId.toString();
        const postOwnerId = post.userId.toString();

        if (commentOwnerId !== userId && postOwnerId !== userId) {
            throw new ErrorMiddleware("Not authorized to delete this comment", 403);
        }

        post.Comment.splice(commentIndex, 1);
        await post.save();

        return post;
    } catch (error) {
        next(error);
    }
};
