import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'ajrumbo',
        email: 'correo@correo.com',
        confirmado: 1,
        password: bcrypt.hashSync('111111', 10)
    }
]

export default usuarios;