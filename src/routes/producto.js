const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { httpProducto } = require("../controllers/producto.js");
const { productoHelper } = require('../helpers/producto');
const { validarJWT } = require('../middlewares/validar-token.js');
const upload = require('../middlewares/upload.js');
const cloudinary = require("../utils/cloudinary.js");
const streamifier = require("streamifier");
const router = express.Router();

// Crear producto
router.post("/crear",
  [
    validarJWT,
    upload.single('imagen'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').isString().withMessage('El nombre debe ser texto'),
    check('nombre').custom(productoHelper.existeNombreProducto),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser numérico y mayor a 0').isFloat({ min: 0.01 }),
    check('stock', 'El stock debe ser un número entero mayor o igual a 0').optional().isInt({ min: 0 }),
    check('distribuidor', 'El distribuidor es obligatorio').isMongoId(),
    check('categoria', 'La categoría es obligatoria').isMongoId(),
    check('marca').optional().isString(),
    check('modeloMoto').optional().isString(),
    // check('imagen').optional().isString(),
    validarCampos
  ],
  httpProducto.crearProducto
);

// Listar todos los productos
router.get("/listarTodo", validarJWT, httpProducto.listarProductos);

// Obtener producto por ID
router.get("/id/:id",
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productoHelper.existeProductoID),
    validarCampos
  ],
  httpProducto.obtenerProducto
);

// Actualizar producto
router.put("/edit/:id",
  [
    validarJWT,
    upload.single('imagen'),
    check('id', 'No es un ID válido').isMongoId(),
    check('nombre').optional().isString().not().isEmpty(),
    check('precio').optional().isFloat({ min: 0.01 }),
    check('stock').optional().isInt({ min: 0 }),
    check('distribuidor').optional().isMongoId(),
    check('categoria').optional().isMongoId(),
    check('marca').optional().isString(),
    check('modeloMoto').optional().isString(),
    validarCampos
  ],
  httpProducto.actualizarProducto
);

// Eliminar producto
router.delete("/delete/:id",
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
  ],
  httpProducto.eliminarProducto
);

// Activar producto
router.put("/activar/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpProducto.activarProducto);

// Desactivar producto
router.put("/desactivar/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpProducto.desactivarProducto);

module.exports = router;