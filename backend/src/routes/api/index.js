import express from "express";

const router = express.Router();

import user from "./user/index.js";
router.use('/user', user);

import auth from "./auth.js";
router.use('/auth', auth);

import testApi from "./testApi.js";
router.use('/test', testApi);

export default router;
