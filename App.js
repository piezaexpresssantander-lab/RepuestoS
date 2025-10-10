

const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



// Rutas

// Rutas principales
const carritos= require('./src/routes/carrito.js');
const categorias = require('./src/routes/categoria.js');
const distribuidores = require("./src/routes/distribuidor.js");
const ordenes = require("./src/routes/orden.js");
const repuestos = require("./src/routes/producto.js");
const pagos= require("./src/routes/pago.js");
const soportes= require ('./src/routes/soporte.js');
const usuarios = require('./src/routes/usuario.js');

// Middleware de rutas
app.use('/api/carrito', carritos);
app.use('/api/categoria', categorias);
app.use('/api/distribuidor', distribuidores);
app.use('/api/orden', ordenes);
app.use('/api/pago', pagos);
app.use('/api/producto', repuestos);
app.use('/api/soporte', soportes);
app.use('/api/usuario', usuarios);

// Conexión y servidor
const PORT = process.env.PORT || 3462;


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Conectado a MongoDB ⚓ Compas y Atlas ⏬⛈️'))
        .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
}); 