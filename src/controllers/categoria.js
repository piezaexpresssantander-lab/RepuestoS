const Categoria = require('../models/Categoria.js');

const httpCategoria = {
  crearCategoria: async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      const categoria = new Categoria({ nombre, descripcion });
      await categoria.save();
      res.status(201).json({ msg: 'Categoría creada exitosamente', categoria });
    } catch (error) {
      res.status(500).json({ msg: 'Error al crear la categoría', error: error.message });
    }
  },

  listarCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.find();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar categorías', error: error.message });
    }
  },

  obtenerCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findById(id);
      if (!categoria) {
        return res.status(404).json({ msg: "Categoría no encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener la categoría', error: error.message });
    }
  },

  actualizarCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, estado } = req.body;
      const categoria = await Categoria.findByIdAndUpdate(
        id,
        { nombre, descripcion, estado },
        { new: true }
      );
      if (!categoria) {
        return res.status(404).json({ msg: "Categoría no encontrada" });
      }
      res.json({ msg: "Categoría actualizada", categoria });
    } catch (error) {
      res.status(500).json({ msg: 'Error al actualizar la categoría', error: error.message });
    }
  },

  eliminarCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByIdAndDelete(id);
      if (!categoria) {
        return res.status(404).json({ msg: "Categoría no encontrada" });
      }
      res.json({ msg: "Categoría eliminada" });
    } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar la categoría', error: error.message });
    }
  },

  activarCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      if (!categoria) {
        return res.status(404).json({ msg: "Categoría no encontrada" });
      }
      res.json({ msg: "Categoría activada", categoria });
    } catch (error) {
      res.status(500).json({ msg: 'Error al activar la categoría', error: error.message });
    }
  },

  desactivarCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      if (!categoria) {
        return res.status(404).json({ msg: "Categoría no encontrada" });
      }
      res.json({ msg: "Categoría desactivada", categoria });
    } catch (error) {
      res.status(500).json({ msg: 'Error al desactivar la categoría', error: error.message });
    }
  }
};

module.exports = { httpCategoria };