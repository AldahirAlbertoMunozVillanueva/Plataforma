import express from "express";
import {   
  getCartelera,   
  createCartelera,   
  deleteCartelera, 
} from '../controllers/carteleraController.js';

const router = express.Router();

router.get("/", getCartelera);
router.post("/", createCartelera);
router.delete("/:id", deleteCartelera);

export default router;
