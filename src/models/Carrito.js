const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      unique: true,
    },
    productos: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: { type: Number, default: 1, min: 1 },
      },
    ],
    estado: {
      type: String,
      default: "activo",
      enum: ["activo", "ordenado", "abandonado"],
    },
    actualizado: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carrito", CarritoSchema);
