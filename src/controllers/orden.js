const Orden = require('../models/Orden.js');

const httpOrden = {

  crearOrden: async (req, res) => {
    try {
      const { cliente, distribuidor, productos, total } = req.body;
      const orden = new Orden({ cliente, distribuidor, productos, total });
      await orden.save();
      res.status(201).json({ msg: 'Orden creada exitosamente', orden });
    } catch (error) {
      res.status(500).json({ msg: 'Error al crear la orden', error: error.message });
    }
  },

 actualizarTracking : async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, urlTracking, transportadora } = req.body;

    const orden = await Orden.findById(id);
    if (!orden) return res.status(404).json({ msg: 'Orden no encontrada' });

    orden.trackingNumber = trackingNumber;
    orden.urlTracking = urlTracking;
    orden.transportadora = transportadora;

    // Opcional: actualiza el estado e historial
    orden.estado = 'enviado';
    orden.historialEnvio.push({
      estado: 'enviado',
      comentario: `Enviado por ${transportadora} - Guía: ${trackingNumber}`
    });

    await orden.save();
    res.json({ msg: 'Tracking actualizado', orden });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
  listarOrdenes: async (req, res) => {
    try {
      const ordenes = await Orden.find()
        .populate('cliente')
        .populate('distribuidor')
        .populate('productos.producto')
        .populate('pago');
      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar órdenes', error: error.message });
    }
  },

  obtenerOrden: async (req, res) => {
    try {
      const { id } = req.params;
      const orden = await Orden.findById(id)
        .populate('cliente')
        .populate('distribuidor')
        .populate('productos.producto')
        .populate('pago');
      if (!orden) {
        return res.status(404).json({ msg: "Orden no encontrada" });
      }
      res.json(orden);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener la orden', error: error.message });
    }
  },

  actualizarOrden: async (req, res) => {
    try {
      const { id } = req.params;
      const { productos, total, estado, pago } = req.body;
      const orden = await Orden.findByIdAndUpdate(
        id,
        { productos, total, estado, pago },
        { new: true }
      );
      if (!orden) {
        return res.status(404).json({ msg: "Orden no encontrada" });
      }
      res.json({ msg: "Orden actualizada", orden });
    } catch (error) {
      res.status(500).json({ msg: 'Error al actualizar la orden', error: error.message });
    }
  },

  eliminarOrden: async (req, res) => {
    try {
      const { id } = req.params;
      const orden = await Orden.findByIdAndDelete(id);
      if (!orden) {
        return res.status(404).json({ msg: "Orden no encontrada" });
      }
      res.json({ msg: "Orden eliminada" });
    } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar la orden', error: error.message });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const orden = await Orden.findByIdAndUpdate(
        id,
        { estado },
        { new: true }
      );
      if (!orden) {
        return res.status(404).json({ msg: "Orden no encontrada" });
      }
      res.json({ msg: `Estado actualizado a ${estado}`, orden });
    } catch (error) {
      res.status(500).json({ msg: 'Error al cambiar el estado', error: error.message });
    }
  }
};

module.exports = { httpOrden };