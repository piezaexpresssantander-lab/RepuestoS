const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  ordenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orden', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  metodo: { type: String, enum: ['wompi', 'mercadopago', 'stripe'], required: true },
  totalPagado: { type: Number, required: true },
  estado: { type: String, enum: ['exitoso', 'fallido'], default: 'exitoso' },
  referencia: { type: String },
  comision: { type: Number, default: 0 },
  fechaPago: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pago', pagoSchema);