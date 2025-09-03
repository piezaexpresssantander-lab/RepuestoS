const mongoose = require('mongoose');

const distribuidorSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  ciudad: String,
  inventarioAPI: String, // URL para conectar con su catálogo si tienen API
  estado: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Distribuidor', distribuidorSchema);
