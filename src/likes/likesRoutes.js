import express from "express";
import { likePostController, getLikesController } from "./likesController.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
const likesRouter = express.Router();
likesRouter.post("/toggle/:id", jwtAuth, (req, res, next) => {
    likePostController(req, res, next);
});
likesRouter.get("/:id", jwtAuth, (req, res, next) => {
    getLikesController(req, res, next);
});
export default likesRouter;