const Orden = require('../models/Orden.js');
const Pago = require('../models/Pago.js');

const httpPago = {
  crearPago: async (req, res) => {
    try {
      const { ordenId, usuarioId, metodo, totalPagado, referencia, comision } = req.body;
      const pago = new Pago({ ordenId, usuarioId, metodo, totalPagado, referencia, comision });
      await pago.save();

      // Actualizar la orden con el pago y cambiar estado según resultado
      await Orden.findByIdAndUpdate(
        ordenId,
        { pago: pago._id, estado: pago.estado === 'exitoso' ? 'completada' : 'pendiente' }
      );

      res.status(201).json({ msg: 'Pago registrado exitosamente', pago });
    } catch (error) {
      res.status(500).json({ msg: 'Error al registrar el pago', error: error.message });
    }
  },

  listarPagos: async (req, res) => {
    try {
      const pagos = await Pago.find().populate('ordenId').populate('usuarioId');
      res.json(pagos);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar pagos', error: error.message });
    }
  },

  obtenerPago: async (req, res) => {
    try {
      const { id } = req.params;
      const pago = await Pago.findById(id).populate('ordenId').populate('usuarioId');
      if (!pago) {
        return res.status(404).json({ msg: "Pago no encontrado" });
      }
      res.json(pago);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener el pago', error: error.message });
    }
  },

  actualizarPago: async (req, res) => {
    try {
      const { id } = req.params;
      const { metodo, totalPagado, referencia, comision, estado } = req.body;
      const pago = await Pago.findByIdAndUpdate(
        id,
        { metodo, totalPagado, referencia, comision, estado },
        { new: true }
      );
      if (!pago) {
        return res.status(404).json({ msg: "Pago no encontrado" });
      }
      res.json({ msg: "Pago actualizado", pago });
    } catch (error) {
      res.status(500).json({ msg: 'Error al actualizar el pago', error: error.message });
    }
  },

  eliminarPago: async (req, res) => {
    try {
      const { id } = req.params;
      const pago = await Pago.findByIdAndDelete(id);
      if (!pago) {
        return res.status(404).json({ msg: "Pago no encontrado" });
      }
      res.json({ msg: "Pago eliminado" });
    } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar el pago', error: error.message });
    }
  }
};

module.exports = { httpPago };