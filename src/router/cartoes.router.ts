import express from "express";
import { createController, findALL } from "../controllers/cartoes.controller";

const router = express.Router();

router.get("/", findALL);
router.post("/", createController);

export default router;
