

const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



// Rutas

// Rutas principales
const usuarios = require('./src/routes/usuario.js');
// const ordenes = require("./src/routes/orden.js");
// const repuestos = require("./src/routes/repuestos.js");
// const distribuidores = require("./src/routes/distribuidores.js");


// Middleware de rutas
app.use('/api/usuario', usuarios);
// app.use('/api/orden', ordenes);
// app.use('/api/repuestos', repuestos);
// app.use('/api/distribuidores', distribuidores);


// Conexión y servidor
const PORT = process.env.PORT || 3462;


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Conectado a MongoDB ⚓ Compas y Atlas ⏬⛈️'))
        .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
}); 