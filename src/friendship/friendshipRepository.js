import mongoose from "mongoose";
import userSchema from "../AuthenticationRoutes/userSchema.js";
import ErrorMidleware from "../middlewares/errorMiddleware.js";
const UserModel = mongoose.model("User", userSchema);

// This is for toggling  friendship
export const addFriendRepo = async (userId, friendId, next) => {
    try {
        // This is for checking user is exist or not
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ErrorMidleware("User not found", 404);
        }
        // This is for checking friend is exist or not
        const friend = await UserModel.findById(friendId);
        if (!friend) {
            throw new ErrorMidleware("Friend not found", 404);
        }
        if (user.friends.includes(friendId)) {
            return { status: "Already friends, request not sent" };
        }
        if (friend.pendingRequests.includes(userId)) {
            // Cancel friend request
            friend.pendingRequests = friend.pendingRequests.filter(id => id.toString() !== userId);
            await friend.save();
            return { status: "Friend request canceled" };
        } else {
            // Send friend request
            friend.pendingRequests.push(userId);
            await friend.save();
            return { status: "Friend request sent", friendId: friend._id, userId: userId };
        }
    } catch (error) {
        next(error);
    }
};
// This is for accepting or rejecting a friend request
export const acceptFriendRequestRepo = async (userId, friendId, action, next) => {
    try {
        // This is for checking user is exist or not
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ErrorMidleware("User not found", 404);
        }
        // This is for checking friend is exist or not
        const friend = await UserModel.findById(friendId);
        if (!friend) {
            throw new ErrorMidleware("Friend not found", 404);
        }
        // This is for checking friend request is exist or not
        if (!user.pendingRequests.includes(friendId)) {
            throw new ErrorMidleware("No friend request found", 404);
        }
        // Remove request from pending list
        user.pendingRequests = user.pendingRequests.filter(id => id.toString() !== friendId);

        if (action === "accept") {
            user.friends.push(friendId);
            friend.friends.push(userId);
        }
        await user.save();
        await friend.save();

        return {
            status: action === "accept" ? "Friend request accepted" : "Friend request rejected",
        };
    }
    catch (error) {
        next(error);
    }
};
// This is for getting all pending request to a specific user
export const getPendingRequestsRepo = async (userId, next) => {
    try {
        // This is for checking user is exist or not
        const user = await UserModel.findById(userId).populate("pendingRequests", "_id name");;
        if (!user) {
            throw new ErrorMidleware("User not found", 404);
        }
        return user.pendingRequests;
    }
    catch (error) {
        next(error);
    }
};
