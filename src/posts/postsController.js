import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { createPostRepo, getAllPostsRepo, getUserAllPostsRepo, getPostByIdRepo } from "./postsRepository.js";
export const getAllPostsController = async (req, res, next) => {
    try {
        const result = getAllPostsRepo(next);
        if (!result) {
            throw new ErrorMiddleware.AppError("No posts found", 404);
        }
        res.status(200).json({
            status: "success",
            data: result
        })
    } catch (error) {
        next(error);
    }
};
// This is for creating post in controller 
export const createPostController = async (req, res, next) => {
    try {
        const { caption } = req.body;
        console.log(caption);
        const image = req.file ? req.file.path : null;
        console.log(image);
        const userId = req.userId;
        console.log(userId);
        console.log("==========================");
        const result = await createPostRepo(userId, caption, image, next);
        if (!result) {
            throw new ErrorMiddleware("Post not created", 400);
        }
        res.status(200).json({
            status: "success",
            data: result
        })
    } catch (error) {
        next(error);
    }
}
// This is for getting all posts of a specific user
export const getUserAllPostsController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const result = await getUserAllPostsRepo(userId, next);
        if (!result) {
            throw new ErrorMiddleware("No posts found", 404);
        }
        res.status(200).json({
            status: "success",
            data: result
        })
    } catch (error) {
        next(error);
    }
};
export const getPostByIdController = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const result = await getPostByIdRepo(postId, next);
        if (!result) {
            throw new ErrorMiddleware("No posts found", 404);
        }
        res.status(200).json({
            status: "success",
            data: result
        })
    } catch (error) {
        next(error);
    }
};
