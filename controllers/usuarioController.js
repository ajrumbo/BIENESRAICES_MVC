import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/token.js";
import { emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
        res.render('auth/login', {pagina: 'Iniciar Sesión'});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {pagina: 'Crear Cuenta'});
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {pagina: 'Olvidé Password'});
}

const registrar = async (req, res) => {
    const {nombre,email,password,repetir_password} = req.body;

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email es incorrecto').run(req);
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no  coinciden').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta', 
            errores: resultado.array(),
            usuario: {
                nombre,
                email
            }
        });
    }

    const existe = await Usuario.findOne({where: {email: req.body.email}});

    if(existe){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta', 
            errores: [{msg: 'El correo ya está registrado'}],
            usuario: {
                nombre,
                email
            }
        });
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    });

    //Enviando email
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    return res.render('templates/mensaje', {
        pagina: 'Usuario Reistrado Exitosamente', 
        mensaje: 'Hemos enviado un email de confirmación. Por favor, revise la bandeja de entrada del correo enviado y siga las instrucciones para la activación del usuario'
    });

    
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}