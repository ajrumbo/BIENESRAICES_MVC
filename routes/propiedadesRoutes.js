import { Router } from "express";
import { admin, crear } from "../controllers/propiedadController.js";

const router = Router();

router.get('/mis-propiedades', admin);

router.route('/propiedades/crear').get(crear);

export default router;