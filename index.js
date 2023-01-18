import express from "express";
import db from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";




// conexión a la bd
try {
    await db.authenticate();
    console.log('Conectado a la base de datos');
} catch (error) {
    console.log(error);
}



const app = express();



app.use('/auth', usuarioRoutes);

//Habilitar PUG 
app.set('view engine', 'pug');
app.set('views','./views');

//Carpeta pública
app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
    console.log('Corriendo');
});