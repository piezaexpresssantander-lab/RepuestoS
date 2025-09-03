const express = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const { httpDistribuidor } = require("../controllers/distribuidor.js");
const { distribuidorHelper } = require('../helpers/distribuidor');
const { validarJWT } = require('../middlewares/validar-token.js');
const router = express.Router();

router.post("/crear",
  [
    validarJWT,
    check('usuario', 'El usuario es obligatorio').isMongoId(),
    check('usuario').custom(distribuidorHelper.existeDistribuidorPorUsuario),
    check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
    validarCampos
  ],
  httpDistribuidor.crearDistribuidor
);

// Listar todos los distribuidores
router.get("/listarTodo", validarJWT, httpDistribuidor.listarDistribuidores);

// Obtener distribuidor por ID
router.get("/id/:id",
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
  ],
  httpDistribuidor.obtenerDistribuidor
);

// Actualizar distribuidor
router.put("/listarTodo/:id",
    
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('ciudad').optional().not().isEmpty(),
    check('inventarioAPI').optional().isString(),
    validarCampos
  ],
  httpDistribuidor.actualizarDistribuidor
);

// Eliminar distribuidor
router.delete("/delete/:id",
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
  ],
  httpDistribuidor.eliminarDistribuidor
);

router.put("/activar/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpDistribuidor.activarDistribuidor);

router.put("/desactivar/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpDistribuidor.desactivarDistribuidor);

module.exports = router;