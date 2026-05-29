"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// POST: Registro inicial del perfil en Firestore (sin token, tras crear cuenta en Firebase Auth)
router.post('/', usuarioController_1.crearUsuario);
// GET: Perfil del usuario autenticado
router.get('/perfil', authMiddleware_1.authMiddleware, usuarioController_1.obtenerPerfil);
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map