const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  distribuidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribuidor', required: true },
  productos: [{
    repuesto: { type: mongoose.Schema.Types.ObjectId, ref: 'Repuesto' },
    cantidad: Number,
    precioUnitario: Number
  }],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'], default: 'pendiente' },
  metodoPago: { type: String, enum: ['wompi', 'mercadopago', 'stripe'], default: 'wompi' }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
