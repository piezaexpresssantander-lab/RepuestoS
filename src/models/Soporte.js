const mongoose = require ('mongoose');
const usuario = require('./usuario');

const soporteSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  asunto: String,
  descripcion: String,
  estado: { type: String, enum: ['abierto', 'en_proceso', 'cerrado'], default: 'abierto' },
  fechaCreacion: { type: Date, default: Date.now } 
});


module.exports = mongoose.model('Soporte', soporteSchema);
