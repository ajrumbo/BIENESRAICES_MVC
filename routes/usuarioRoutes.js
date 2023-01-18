import { Router } from "express";
import { confirmar, formularioLogin, formularioOlvidePassword, formularioRegistro, registrar } from "../controllers/usuarioController.js";

const router = Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);


export default router;