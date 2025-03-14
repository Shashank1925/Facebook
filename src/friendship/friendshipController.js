import ErrorMiddleware from "../middlewares/errorMiddleware.js";
import { addFriendRepo } from "./friendshipRepository.js";
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
            status: result.isFriend ? "Friend added successfully" : "Unfriended successfully",
            data: result
        })
    } catch (error) {
        next(error);
    }
}