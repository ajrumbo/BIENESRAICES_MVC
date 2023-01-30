import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Categoria, Precio, Propiedad, Usuario } from "../models/index.js";


const admin = async (req, res) => {
    const {id} = req.usuario;
    const { pagina: paginaActual } = req.query; 

    const regExp = /^[0-9]$/;

    if(!regExp.test(paginaActual)) return res.redirect('/mis-propiedades?pagina=1');

    try {

        const limit = 5;
        const offset = ((paginaActual * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                }, 
                include: [
                    { model: Categoria },
                    { model: Precio }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                } 
            })
        ]);

    
        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual,
            limit,
            offset,
            total
        });
    } catch (error) {
        console.log(error);
    }
    
}

const crear = async (req, res) => {

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
            imagen: 'placeholder.jpg',
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

const editar = async (req, res) => {

    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad || (propiedad.usuarioId.toString() !== req.usuario.id.toString())) return res.redirect('/mis-propiedades');

    const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
     ]);
     
    res.render('propiedades/editar', {
        pagina: 'Editar Propiedad', 
        precios, 
        categorias,
        csrfToken: req.csrfToken(),
        datos: propiedad
    });
}

const guardarCambios = async (req, res) => {

    const resultado = validationResult(req);

    if(!resultado.isEmpty()){

        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ]);

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad', 
            precios, 
            categorias,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body
        });
    }


    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad || (propiedad.usuarioId.toString() !== req.usuario.id.toString())) return res.redirect('/mis-propiedades');

    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, categoriaId, precioId } = req.body;

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            categoriaId,
            precioId
        });

        await propiedad.save();

        return res.redirect('/mis-propiedades');

    } catch (error) {
        console.log(error)
    }
}

const eliminar = async (req, res) => {
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad || (propiedad.usuarioId.toString() !== req.usuario.id.toString())) return res.redirect('/mis-propiedades');

    if(!propiedad.imagen.toString() === 'placeholder.jpg'){
        await unlink(`public/uploads/${propiedad.imagen}`);
    }

    propiedad.destroy();

    return res.redirect('/mis-propiedades');
}

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria },
            { model: Precio }
        ]
    });

    if(!propiedad) return res.redirect('/404');

    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo
    });
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}