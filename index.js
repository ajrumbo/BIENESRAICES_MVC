import express from "express";
import db from "./config/db.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";


// conexión a la bd
try {
    await db.authenticate();
    db.sync();
    console.log('Conectado a la base de datos');
} catch (error) {
    console.log(error);
}

const app = express();

//Habilitar datos de formularios
app.use(express.urlencoded({extended: true}));

//Habilitar cookie parser
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({ cookie: true }));


app.use('/auth', usuarioRoutes);

//Habilitar PUG 
app.set('view engine', 'pug');
app.set('views','./views');

//Carpeta pública
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Corriendo');
});