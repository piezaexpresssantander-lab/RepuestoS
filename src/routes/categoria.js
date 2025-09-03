const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { httpCategoria } = require("../controllers/categoria.js");
const { categoriaHelper } = require('../helpers/categoria');
const { validarJWT } = require('../middlewares/validar-token.js');
const router = express.Router();

// Crear categoría
router.post("/crear", [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
  check('nombre').custom(categoriaHelper.existeNombreCategoria),
  validarCampos
], httpCategoria.crearCategoria);

// Listar todas las categorías
router.get("/listarTodo", validarJWT, httpCategoria.listarCategorias);

// Obtener categoría por ID
router.get("/id/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(categoriaHelper.existeCategoriaID),
  validarCampos
], httpCategoria.obtenerCategoria);

// Actualizar categoría
router.put("/edit/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCategoria.actualizarCategoria);

// Eliminar categoría
router.delete("/delete/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCategoria.eliminarCategoria);

// Activar categoría
router.put("/activar/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCategoria.activarCategoria);

// Desactivar categoría
router.put("/desactivar/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCategoria.desactivarCategoria);

module.exports = router;