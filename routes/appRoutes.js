import { Router } from "express";
import { inicio, categoria, noEncontrado, buscador } from "../controllers/appController.js";

const router = Router();

//Página inicio
router.get('/', inicio);

//Categorías
router.get('/categorias/:id', categoria);

//404
router.get('/404', noEncontrado);

//Buscador
router.get('/buscador', buscador);

export default router;