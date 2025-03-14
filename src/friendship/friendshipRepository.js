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
        const isFriend = user.friends.includes(friendId);
        if (isFriend) {
            user.friends = user.friends.filter(id => id.toString() !== friendId);
            friend.friends = friend.friends.filter(id => id.toString() !== userId);
        }
        else {
            user.friends.push(friendId);
            friend.friends.push(userId);
        }
        await user.save();
        await friend.save();
        return {
            user,
            friend,
            isFriend: !isFriend,
        };
    } catch (error) {
        next(error);
    }
}