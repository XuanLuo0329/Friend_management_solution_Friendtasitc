import express from "express";
import verifyJWT from "#middleware/JWTAuth";

const router = express.Router();

router.use(verifyJWT());

import event from "./event.js";
router.use('/event', event);

import friend from "./friend.js";
router.use('/friend', friend);

import recommendation from "./recommendation.js";
router.use('/recommend', recommendation);

import gift from "./gift.js";
router.use('/gift', gift);

import memoryRouter from"./memories.js";
router.use("/memories", memoryRouter);

import notification from "./notification.js";
router.use("/notification", notification);

export default router;
