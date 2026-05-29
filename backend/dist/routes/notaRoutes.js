"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notaController_1 = require("../controllers/notaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/:idAsignatura/notas', notaController_1.agregarNota);
router.get('/:idAsignatura/notas', notaController_1.obtenerNotas);
router.delete('/:idAsignatura/notas/:idNota', notaController_1.eliminarNota);
exports.default = router;
//# sourceMappingURL=notaRoutes.js.map