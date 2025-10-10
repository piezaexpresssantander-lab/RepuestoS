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
  estado: { 
    type: String, 
    enum: [
      'pendiente_pago', 'pagado', 'preparando', 'enviado', 
      'en_camino', 'entregado', 'cancelada'
    ], 
    default: 'pendiente_pago' 
  },
  historialEnvio: [{
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    comentario: String
  }],
  
  trackingNumber: String,
  urlTracking: String,
  transportadora: String
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
