import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.middleware.js';
import { addFriendController } from './friendshipController.js';
const friendshipRouter = express.Router();
friendshipRouter.post("/toggle-friendship/:friendId", jwtAuth, (req, res, next) => {
    addFriendController(req, res, next);
});
export default friendshipRouter;