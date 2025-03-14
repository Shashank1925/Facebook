import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.middleware.js';
import multer from 'multer';
import { addFriendController, acceptFriendRequestController, getPendingRequestsController, getAllFriendsController } from './friendshipController.js';
const friendshipRouter = express.Router();
const none = multer().none();
friendshipRouter.post("/toggle-friendship/:friendId", jwtAuth, (req, res, next) => {
    addFriendController(req, res, next);
});
friendshipRouter.post("/response-to-request/:friendId", jwtAuth, none, (req, res, next) => {
    acceptFriendRequestController(req, res, next);
});
friendshipRouter.get("/get-pending-requests", jwtAuth, (req, res, next) => {
    getPendingRequestsController(req, res, next);
});
friendshipRouter.get("/get-friends/:userId", jwtAuth, (req, res, next) => {
    getAllFriendsController(req, res, next);
});
export default friendshipRouter;