import express from "express";
import { createUserController, findALLUserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/", createUserController);
router.get("/", findALLUserController);

export default router;
