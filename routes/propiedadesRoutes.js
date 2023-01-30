import { Router } from "express";
import { 
    admin, 
    agregarImagen, 
    almacenarImagen, 
    crear, 
    editar, 
    eliminar, 
    guardar, 
    guardarCambios 
} from "../controllers/propiedadController.js";
import { body } from "express-validator";
import auth from "../middleware/auth.js";
import upload from "../middleware/subirImagen.js";

const router = Router();

router.get('/mis-propiedades', auth, admin);

router.route('/propiedades/crear').get(auth, crear).post(
    body('titulo')
        .notEmpty().withMessage('El título del anuncio es obligatorio')
        .isLength({min: 10}).withMessage('el título es demasiado corto'),
    body('descripcion')
        .notEmpty().withMessage('La descripción de la propiedad en venta es obligatoria')
        .isLength({min: 10}).withMessage('La descripción es demasiado corta'),
    body('categoria').notEmpty().withMessage('Debe seleccionar una categoría'),
    body('precio').notEmpty().withMessage('Debe indicar un rango de precios'),
    body('habitaciones').notEmpty().withMessage('Debe indicar la cantidad de habitaciones'),
    body('estacionamiento').notEmpty().withMessage('Debe indicar la cantidad de estacionamientos'),
    body('wc').notEmpty().withMessage('Debe indicar la cantidad de baño'),
    body('calle').notEmpty().withMessage('Debe indicar la ubicación de la propiedad'),
    auth,
    guardar
);

router.route('/propiedades/agregar-imagen/:id').get(auth, agregarImagen).post(auth, upload.single('imagen'), almacenarImagen);

router.route('/propiedades/editar/:id').get(auth, editar).post(
    body('titulo')
        .notEmpty().withMessage('El título del anuncio es obligatorio')
        .isLength({min: 10}).withMessage('el título es demasiado corto'),
    body('descripcion')
        .notEmpty().withMessage('La descripción de la propiedad en venta es obligatoria')
        .isLength({min: 10}).withMessage('La descripción es demasiado corta'),
    body('categoriaId').notEmpty().withMessage('Debe seleccionar una categoría'),
    body('precioId').notEmpty().withMessage('Debe indicar un rango de precios'),
    body('habitaciones').notEmpty().withMessage('Debe indicar la cantidad de habitaciones'),
    body('estacionamiento').notEmpty().withMessage('Debe indicar la cantidad de estacionamientos'),
    body('wc').notEmpty().withMessage('Debe indicar la cantidad de baño'),
    body('calle').notEmpty().withMessage('Debe indicar la ubicación de la propiedad'),
    auth,
    guardarCambios
);

router.post('/propiedades/eliminar/:id', auth, eliminar);

export default router;