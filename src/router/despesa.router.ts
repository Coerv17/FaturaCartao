import express from "express";
import { despesaPARCELADO } from "../controllers/despesa.controller";

const router = express.Router();

router.post("/", despesaPARCELADO);
//router.get("/", FindaAllDepesa);

export default router;
