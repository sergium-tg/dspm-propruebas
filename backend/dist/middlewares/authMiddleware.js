"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.authMiddleware = void 0;
const firebaseAdmin_1 = require("../config/firebaseAdmin");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de autenticación.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Acceso denegado. Token malformado.' });
            return;
        }
        const decodedToken = await firebaseAdmin_1.auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Error de seguridad:', error);
        res.status(401).json({ error: 'Acceso denegado. Token inválido o expirado.' });
    }
};
exports.authMiddleware = authMiddleware;
/** @deprecated Usar authMiddleware */
exports.verificarToken = exports.authMiddleware;
//# sourceMappingURL=authMiddleware.js.map