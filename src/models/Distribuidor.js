const mongoose = require('mongoose');

const distribuidorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: String,
  direccion: String,
  ciudad: String,
  inventarioAPI: String, // URL para conectar con su catálogo si tienen API
  estado: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Distribuidor', distribuidorSchema);
