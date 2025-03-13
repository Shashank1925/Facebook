import mongoose from "mongoose";
import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import postModel from "./postsSchema.js";
// This is for getting all posts from database
export const getAllPostsRepo = async (next) => {
    try {
        const allPosts = await postModel.find();
        if (!allPosts) {
            throw new ErrorMiddleware.AppError("No posts found", 404);
        }
        return allPosts;
    } catch (error) {
        next(error);
    }
};
// This is for creating a post in database
export const createPostRepo = async (userId, caption, image, next) => {
    try {
        console.log(userId);
        if (!userId) {
            throw new ErrorMiddleware("Invalid user id", 400);
        }
        if (!caption || !image) {
            throw new ErrorMiddleware("Please provide caption and image", 400);
        }
        const existingPost = await postModel.findOne({ caption });
        if (existingPost) {
            throw new ErrorMiddleware("Post already exists", 409);
        }
        const newPost = new postModel({
            userId,
            caption,
            image,
            like: null,
            Comment: []
        });
        await newPost.save();
        return newPost;
    }
    catch (error) {
        next(error);
    }
}
// This is for getting all posts of a specific user from database
export const getUserAllPostsRepo = async (userId, next) => {
    try {
        const userPosts = await postModel.find({ userId });
        if (!userPosts) {
            throw new ErrorMiddleware("No posts found", 404);
        }
        return userPosts;
    }
    catch (error) {
        next(error);
    }
}
// This is for getting a specfic post by postId
export const getPostByIdRepo = async (postId, next) => {
    try {
        const post = postModel.findById(postId);
        if (!post) {
            throw new ErrorMiddleware("Post not found", 404);
        }
        return post;
    }
    catch (error) {
        next(error);
    }
}
