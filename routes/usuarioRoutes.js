import { Router } from "express";
import { 
    comprobarToken,
    confirmar,
    formularioLogin,
    formularioOlvidePassword,
    formularioRegistro,
    nuevoPassword,
    olvidePassword,
    registrar
} from "../controllers/usuarioController.js";

const router = Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', olvidePassword);

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


export default router;