import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { addFriendRepo, acceptFriendRequestRepo, getPendingRequestsRepo } from "./friendshipRepository.js";
export const addFriendController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ErrorMiddleware("User id is required", 400);
        }
        const friendId = req.params.friendId;
        if (!friendId) {
            throw new ErrorMiddleware("  friend id is required", 400);
        }
        const result = await addFriendRepo(userId, friendId, next);
        if (!result) {
            throw new ErrorMiddleware("Something went wrong", 500);
        }
        res.status(200).json({
            status: result.status,
            UserId: result.friendId,
            FriendId: result.userId,
        })
    } catch (error) {
        next(error);
    }
};
// This is for accepting or rejecting a friend request
export const acceptFriendRequestController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ErrorMiddleware("User id is required", 400);
        }
        const friendId = req.params.friendId;
        if (!friendId) {
            throw new ErrorMiddleware("  friend id is required", 400);
        }
        const { action } = req.body;
        if (action !== "accept" && action !== "reject") {
            throw new ErrorMiddleware("Invalid action. Use 'accept' or 'reject'", 400);
        }
        const result = await acceptFriendRequestRepo(userId, friendId, action, next);
        if (!result) {
            throw new ErrorMiddleware("Something went wrong", 500);
        }
        res.status(200).json({
            status: result.status,
            result: result,
        })
    }
    catch (error) {
        next(error);
    }
};
// This is for getting pending requests of a user
export const getPendingRequestsController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ErrorMiddleware("User id is required", 400);
        }
        const pendingRequests = await getPendingRequestsRepo(userId, next);
        if (!pendingRequests) {
            throw new ErrorMiddleware("Something went wrong", 500);
        }
        res.status(200).json({
            status: "successfully get the pending requests",
            pendingRequests: pendingRequests,
        })
    }
    catch (error) {
        next(error);
    }
}