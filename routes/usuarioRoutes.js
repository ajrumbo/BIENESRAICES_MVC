import { Router } from "express";
import { 
    comprobarToken,
    confirmar,
    formularioLogin,
    formularioOlvidePassword,
    formularioRegistro,
    login,
    nuevoPassword,
    olvidePassword,
    registrar
} from "../controllers/usuarioController.js";

const router = Router();

router.route('/login').get(formularioLogin).post(login);

router.route('/registro').get(formularioRegistro).post(registrar);

router.get('/confirmar/:token', confirmar);

router.route('/olvide-password').get(formularioOlvidePassword).post(olvidePassword);

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


export default router;