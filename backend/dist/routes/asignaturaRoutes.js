"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asignaturaController_1 = require("../controllers/asignaturaController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', asignaturaController_1.crearAsignatura);
router.get('/', asignaturaController_1.obtenerAsignaturas);
router.delete('/:id', asignaturaController_1.eliminarAsignatura);
exports.default = router;
//# sourceMappingURL=asignaturaRoutes.js.map