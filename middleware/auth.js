import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';


const auth = async (req, res, next) => {
    //Leer la cookie
    const {_token} = req.cookies;

    if(!_token){
        return res.redirect('/auth/login');
    }

    //buscar al usuario
    try {
        const decoded = jwt.verify(_token, process.env.SECRET);

        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        if(usuario){
            req.usuario = usuario;
        }else{
            return res.redirect('/auth/login');
        }
        
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }

}

export default auth;