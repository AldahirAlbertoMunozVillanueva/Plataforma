import express from "express";
import {
  getPersonal,
  createPersonal,
  deletePersonal
} from '../controllers/personalController.js';

const router = express.Router();

router.get("/", getPersonal);
router.post("/", createPersonal);
router.delete("/:id", deletePersonal);

export default router;
