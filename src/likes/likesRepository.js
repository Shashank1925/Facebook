import postModel from "../posts/postsSchema.js";
import ErrorMiddleware from "../middlewares/errorMiddleware.js";
// this is for toggling like and dislike and showing the counts of likes on perticular post
export const likePostRepo = async (postId, userId, next) => {
    try {
        if (!postId) {
            throw new ErrorMiddleware("Invalid post id", 400);
        }
        const post = await postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        if (!Array.isArray(post.like)) {
            post.like = [];
        }
        const hasLiked = post.like.some(id => id.toString() === userId.toString());
        if (hasLiked) {
            post.like = post.like.filter(id => id.toString() !== userId);

        } else {
            post.like.push(userId);
        }
        await post.save();
        return {
            post,
            likesCount: post.like.length,
            hasLiked,
        };
    }
    catch (error) {
        next(error);
    }
};
// This is for getting all like of a specific post
export const getLikes = async (postId) => {
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        const likes = post.like;
        return likes;
    }
    catch (error) {
        throw new ErrorMiddleware("Post not found", 404);
    }
}
