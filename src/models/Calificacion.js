const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  distribuidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribuidor', required: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  puntaje: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model('Calificacion', calificacionSchema);

