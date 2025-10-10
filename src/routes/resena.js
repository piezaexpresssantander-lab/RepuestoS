const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token.js');
const { httpResena } = require('../controllers/resena.js');
const router = express.Router();

// Crear reseña
router.post('/crear', [
  validarJWT,
  check('usuario', 'El usuario es obligatorio').isMongoId(),
  check('distribuidor', 'El distribuidor es obligatorio').isMongoId(),
  check('producto', 'El producto es obligatorio').isMongoId(),
  check('puntaje', 'El puntaje debe ser entre 1 y 5').isInt({ min: 1, max: 5 }),
  check('comentario').optional().isString().isLength({ max: 500 }),
  validarCampos
], httpResena.crearResena);

// Listar reseñas por producto
router.get('/producto/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpResena.listarResenasPorProducto);

// Listar reseñas por distribuidor
router.get('/distribuidor/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpResena.listarResenasPorDistribuidor);

// Listar reseñas por usuario
router.get('/usuario/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpResena.listarResenasPorUsuario);

module.exports = router;