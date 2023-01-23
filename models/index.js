import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';


// Precio.hasOne(Propiedad);
// Categoria.hasOne(Propiedad);
// Usuario.hasMany(Propiedad);
Propiedad.belongsTo(Precio);
Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}