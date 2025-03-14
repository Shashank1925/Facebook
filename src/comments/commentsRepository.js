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
