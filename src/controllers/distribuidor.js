const Distribuidor = require('../models/Distribuidor.js');

const httpDistribuidor = {
  // Crear distribuidor
  crearDistribuidor: async (req, res) => {
    try {
      const { usuario, ciudad, inventarioAPI } = req.body;
      const distribuidor = new Distribuidor({ usuario, ciudad, inventarioAPI });
      await distribuidor.save();
      res.json({ distribuidor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar todos los distribuidores
  listarDistribuidores: async (req, res) => {
    try {
      const distribuidores = await Distribuidor.find().populate('usuario');
      res.json(distribuidores);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener distribuidor por ID
  obtenerDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const distribuidor = await Distribuidor.findById(id).populate('usuario');
      if (!distribuidor) {
        return res.status(404).json({ msg: "Distribuidor no encontrado" });
      }
      res.json(distribuidor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Actualizar distribuidor
  actualizarDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const { ciudad, inventarioAPI, estado } = req.body;
      const distribuidor = await Distribuidor.findByIdAndUpdate(
        id,
        { ciudad, inventarioAPI, estado },
        { new: true }
      );
      if (!distribuidor) {
        return res.status(404).json({ msg: "Distribuidor no encontrado" });
      }
      res.json(distribuidor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar distribuidor
  eliminarDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const distribuidor = await Distribuidor.findByIdAndDelete(id);
      if (!distribuidor) {
        return res.status(404).json({ msg: "Distribuidor no encontrado" });
      }
      res.json({ msg: "Distribuidor eliminado" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Activar distribuidor
  activarDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const distribuidor = await Distribuidor.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      if (!distribuidor) {
        return res.status(404).json({ msg: "Distribuidor no encontrado" });
      }
      res.json({ msg: "Distribuidor activado", distribuidor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Desactivar distribuidor
  desactivarDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const distribuidor = await Distribuidor.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      if (!distribuidor) {
        return res.status(404).json({ msg: "Distribuidor no encontrado" });
      }
      res.json({ msg: "Distribuidor desactivado", distribuidor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = { httpDistribuidor };