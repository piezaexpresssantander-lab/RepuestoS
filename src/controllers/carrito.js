const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

const httpCarrito = {
  // Crear carrito

  postCrearCarrito: async (req, res) => {
    try {
      let { productos } = req.body;
      if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ msg: 'Debes enviar productos' });
      }

      // Asigna cantidad = 1 si no viene en el body
      productos = productos.map(prod => ({
        ...prod,
        cantidad: prod.cantidad ? Number(prod.cantidad) : 1
      }));

      let carrito = await Carrito.findOne({ estado: "activo" });

      if (!carrito) {
        carrito = new Carrito({ productos });
      } else {
        productos.forEach(nuevoProd => {
          const existente = carrito.productos.find(p => p.productoId.toString() === nuevoProd.productoId);
          if (existente) {
            existente.cantidad += nuevoProd.cantidad;
          } else {
            carrito.productos.push(nuevoProd);
          }
        });
      }

      await carrito.save();
        // Calcular el valor total del carrito
        let total = 0;
        for (const item of carrito.productos) {
          const producto = await Producto.findById(item.productoId);
          if (producto) {
            total += producto.precio * item.cantidad;
          }
        }
        total_formateado = '$' + total.toLocaleString('es-CO')
        res.status(201).json({ 
          msg: 'Añadido, Carrito actualizado ', 
          carrito, 
          total: '$' + total.toLocaleString('es-CO')
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  // Listar carritos del usuario
getCarritosUsuario: async (req, res) => {
  try {
    // Esto trae los datos completos del producto
    const carritos = await Carrito.find().populate('productos.productoId');
    res.json(carritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

  // Obtener carrito por ID
  getCarritoPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const carrito = await Carrito.findById(id);
      if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });
      res.json(carrito);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
    // Validar stock de productos en el carrito
getValidarStock : async (req, res) => {
  try {
    const { id } = req.params;
    const carrito = await Carrito.findById(id);
    if (!carrito) {
      return res.status(404).json({ msg: 'Carrito no encontrado' });
    }

    for (const item of carrito.productos) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ msg: `Producto no encontrado: ${item.productoId}` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          msg: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, solicitado: ${item.cantidad}`
        });
      }
    }

    res.json({ msg: 'Stock suficiente para todos los productos' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

// Editar carrito
putEditarCarrito: async (req, res) => {
    try {
      const { id } = req.params;
      const { productos } = req.body;

      if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ msg: 'Debes enviar productos' });
      }

      const carrito = await Carrito.findById(id);
      if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });

      productos.forEach(prodEdit => {
        const existente = carrito.productos.find(p => p.productoId.toString() === prodEdit.productoId);
        if (existente) {
          if (prodEdit.accion === 'sumar') {
            existente.cantidad += 1;
          } else if (prodEdit.accion === 'restar') {
            existente.cantidad -= 1;
            if (existente.cantidad <= 0) {
              carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== prodEdit.productoId);
            }
          } else {
            // Si no hay acción, se asume quitar el producto
            carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== prodEdit.productoId);
          }
        } else {
          // Si no existe y la acción es 'sumar', agregar el producto con cantidad 1
          if (prodEdit.accion === 'sumar') {
            carrito.productos.push({ productoId: prodEdit.productoId, cantidad: 1 });
          }
        }
      });

      await carrito.save();

      // Calcular el total
      let total = 0;
      for (const item of carrito.productos) {
        const producto = await Producto.findById(item.productoId);
        if (producto) {
          total += producto.precio * item.cantidad;
        }
      }

      res.json({
        msg: 'Carrito actualizado',
        carrito,
        total: '$' + total.toLocaleString('es-CO')
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
    // Limpiar carritos abandonados (manual o por cron)
  deleteLimpiarAbandonados : async (req, res) => {
  try {
    const dias = Number(req.query.dias) || 7; // Por defecto, 7 días
    const fechaLimite = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
    const result = await Carrito.deleteMany({
      estado: 'abandonado',
      actualizado: { $lt: fechaLimite }
    });
    res.json({ msg: `Carritos abandonados eliminados: ${result.deletedCount}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

  // Eliminar carrito
  deleteCarrito: async (req, res) => {
    try {
      const { id } = req.params;
      const carrito = await Carrito.findByIdAndDelete(id);
      if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });
      res.json({ msg: 'Carrito eliminado', color: 'red' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Activar
  putActivar: async (req, res) => {
    try {
      const carrito = await Carrito.findById(req.params.id);
      if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });
      carrito.estado = 1;
      await carrito.save();
      res.json({ msg: 'Carrito activado', carrito });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Desactivar
  putDesactivar: async (req, res) => {
    try {
      const carrito = await Carrito.findById(req.params.id);
      if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });
      carrito.estado = 0;
      await carrito.save();
      res.json({ msg: 'Carrito desactivado', carrito });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { httpCarrito };