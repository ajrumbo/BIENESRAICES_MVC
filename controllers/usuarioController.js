import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/token.js";
import { emailRegistro, emailRecuperacion } from "../helpers/emails.js";


const formularioLogin = (req, res) => {
        res.render('auth/login', {pagina: 'Iniciar Sesión'});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Olvidé mi contraseña',
        csrfToken: req.csrfToken()
    });
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
            },
            csrfToken: req.csrfToken()
        });
    }

    const existe = await Usuario.findOne({where: {email}});

    if(existe){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta', 
            errores: [{msg: 'El correo ya está registrado'}],
            usuario: {
                nombre,
                email
            },
            csrfToken: req.csrfToken()
        });
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
        confirmado: false
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

const confirmar = async (req, res) => {
    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}});

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Token no válido',
            error: true
        });
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    
    res.render('auth/confirmar-cuenta', {
        pagina: 'Confirmar Cuenta',
        mensaje: 'Cuenta confirmada exitosamente'
    });

}



const olvidePassword = async (req, res) => {
    const {email} = req.body;

    await check('email').isEmail().withMessage('El email es incorrecto').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/olvide-password', {
            pagina: 'Olvidé mi contraseña', 
            errores: resultado.array(),
            email,
            csrfToken: req.csrfToken()
        });
    }

    const usuario = await Usuario.findOne({where: {email}});

    if(!usuario || !usuario.confirmado){
        return res.render('auth/olvide-password', {
            pagina: 'Olvidé mi contraseña', 
            errores: [{msg: 'El usuario no existe'}],
            email,
            csrfToken: req.csrfToken()
        });
    }

    usuario.token = generarId();
    await usuario.save();
    
    emailRecuperacion({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    res.render('templates/mensaje',{
        pagina: 'Restablece tu Contraseña',
        mensaje: 'Hemos enviado un email de recuperación. Por favor, revisa la bandeja de entrada del correo enviado y sigue las instrucciones para la activación del usuario'
    });

}

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}});

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al restablecer tu cuenta',
            mensaje: 'Token no válido',
            error: true
        });
    }

    res.render('auth/nuevo-password', {
        pagina: 'Nueva Contraseña',
        csrfToken: req.csrfToken()
    });
}

const nuevoPassword = async (req, res) => {
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/nuevo-password', {
            pagina: 'Nueva Contraseña', 
            errores: resultado.array(),
            csrfToken: req.csrfToken()
        });
    }

    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({where: {token}});

    usuario.token = null;
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    await usuario.save();

    return res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Restablecida',
        mensaje: 'Contraseña restablecida correctamente',
        error: false
    });

}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}