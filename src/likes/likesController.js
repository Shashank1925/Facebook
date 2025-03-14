import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { likePostRepo, getLikes } from "./likesRepository.js";
export const likePostController = async (req, res, next) => {
    try {
        const postId = req.params.id;
        console.log(postId);
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const userId = req.userId;
        console.log(userId);
        if (!userId) {
            throw new ErrorMiddleware("Invalid user id", 400);
        }
        const post = await likePostRepo(postId, userId, next);
        console.log(post);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        res.status(200).json({
            status: post.hasLiked ? "Post unliked successfully" : "Post liked successfully",
            likesCount: post.likesCount.length,
            post
        });

    }
    catch (error) {
        next(error);
    }
};
// This is for getting all like of a specific post
export const getLikesController = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const likes = await getLikes(postId);
        if (!likes) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        res.status(200).json({
            status: "successfully get all likes of the post",
            likes: likes.length,
        });
    } catch (error) {
        next(error);
    }
}