const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  distribuidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribuidor', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number,
    precioUnitario: Number
  }],
  pago: { type: mongoose.Schema.Types.ObjectId, ref: 'Pago' },
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'en_curso', 'completada', 'cancelada'], default: 'pendiente' }
}, { timestamps: true });


module.exports = mongoose.model('Orden', ordenSchema);
