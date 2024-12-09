import express from "express";
import {
  getBibliotecas,
  createBiblioteca,
  deleteBiblioteca
} from '../controllers/bibliotecasController.js';

const router = express.Router();

router.get("/", getBibliotecas);
router.post("/", createBiblioteca);
router.delete("/:id", deleteBiblioteca);

export default router;
