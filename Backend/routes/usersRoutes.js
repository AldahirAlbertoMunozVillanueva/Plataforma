import express from "express";
import {
  listUsers,
  createUser,
  deleteUser,
  updateUserRole,
} from '../controllers/usersController.js';

const router = express.Router();

router.get("/", listUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUserRole);

export default router;
