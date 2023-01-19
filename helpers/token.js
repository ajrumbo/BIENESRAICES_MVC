import jwt from "jsonwebtoken"


const generarToken = id => jwt.sign({id},process.env.SECRET, {expiresIn: '60'});



const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarId,
    generarToken
}