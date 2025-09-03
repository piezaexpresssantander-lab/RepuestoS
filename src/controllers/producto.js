const Producto = require('../models/Producto.js');
const cloudinary = require("../utils/cloudinary.js");
const streamifier = require("streamifier");

const httpProducto = {
  crearProducto: async (req, res) => {
    try {
      const { nombre, descripcion, precio, stock, marca, modeloMoto, distribuidor, categoria } = req.body;

      let imagenUrl = '';
      if (req.file) {
        const subirACloudinary = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
              { folder: 'productos' },
              (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
              }
            );
            streamifier.createReadStream(fileBuffer).pipe(upload_stream);
          });
        };
        imagenUrl = await subirACloudinary(req.file.buffer);
      }

      const nuevoProducto = new Producto({
        nombre,
        descripcion,
        precio,
        stock,
        marca,
        modeloMarca,
        distribuidor,
        categoria,
        imagen: imagenUrl ? [imagenUrl] : []
      });

      await nuevoProducto.save();

      res.status(201).json({
        msg: 'Producto creado exitosamente',
        producto: nuevoProducto
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  listarProductos: async (req, res) => {
    try {
      const productos = await Producto.find().populate('distribuidor').populate('categoria');
      res.json(productos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  obtenerProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findById(id).populate('distribuidor').populate('categoria');
      if (!producto) {
        return res.status(404).json({ msg: "Producto no encontrado" });
      }
      res.json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  actualizarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock, marca, modeloMoto, distribuidor, categoria, estado } = req.body;
      const producto = await Producto.findByIdAndUpdate(
        id,
        { nombre, descripcion, precio, stock, marca, modeloMarca, distribuidor, categoria, estado },
        { new: true }
      );
      if (!producto) {
        return res.status(404).json({ msg: "Producto no encontrado" });
      }
      res.json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  eliminarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndDelete(id);
      if (!producto) {
        return res.status(404).json({ msg: "Producto no encontrado" });
      }
      res.json({ msg: "Producto eliminado" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  activarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      if (!producto) {
        return res.status(404).json({ msg: "Producto no encontrado" });
      }
      res.json({ msg: "Producto activado", producto });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  desactivarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      if (!producto) {
        return res.status(404).json({ msg: "Producto no encontrado" });
      }
      res.json({ msg: "Producto desactivado", producto });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = { httpProducto };