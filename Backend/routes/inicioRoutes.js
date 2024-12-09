import express from "express";
import { getInicio, createInicio } from '../controllers/inicioController.js';

const router = express.Router();

router.get("/", getInicio);
router.post("/", createInicio);

export default router;