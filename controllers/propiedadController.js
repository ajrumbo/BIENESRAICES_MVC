import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Categoria, Precio, Propiedad, Usuario } from "../models/index.js";


const admin = (req, res) => {
    res.render('propiedades/admin', {pagina: 'Mis Propiedades'});
}

const crear = async (req, res) => {
    // const precios = await Precio.findAll();
    // const categorias = await Categoria.findAll();

     const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
     ]);
     
    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad', 
        precios, 
        categorias,
        csrfToken: req.csrfToken(),
        datos: {}
    });
}

const guardar = async (req, res) => {

    const resultado = validationResult(req);

    if(!resultado.isEmpty()){

        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad', 
            precios, 
            categorias,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, categoria: categoriaId, precio: precioId } = req.body;

    const usuarioId = req.usuario.id;

    try {

        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            categoriaId,
            precioId,
            imagen: '',
            usuarioId
        });

        const {id} = propiedadGuardada;


        res.redirect(`/propiedades/agregar-imagen/${id}`);

    } catch (error) {
        console.log(error);
    }
}

const agregarImagen = async (req, res) => {

    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad || propiedad.publicado || (propiedad.usuarioId.toString() !== req.usuario.id.toString())) return res.redirect('/mis-propiedades');


    res.render('propiedades/agregar-imagen',{
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        propiedad,
        csrfToken: req.csrfToken()
    });
}

const almacenarImagen  = async (req, res, next) => {
    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad || propiedad.publicado || (propiedad.usuarioId.toString() !== req.usuario.id.toString())) return res.redirect('/mis-propiedades');

    try {
        
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;

        await propiedad.save();

        next();

    } catch (error) {
        console.log(error);
    }

}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}