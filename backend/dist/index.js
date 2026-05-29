"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const firebaseAdmin_1 = require("./config/firebaseAdmin");
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const asignaturaRoutes_1 = __importDefault(require("./routes/asignaturaRoutes"));
const notaRoutes_1 = __importDefault(require("./routes/notaRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', async (_req, res) => {
    try {
        await firebaseAdmin_1.db.collection('usuarios').limit(1).get();
        res.status(200).json({ status: 'OK', message: 'Backend conectado a Firestore correctamente' });
    }
    catch (error) {
        console.error('Error conectando a Firestore:', error);
        res.status(500).json({ status: 'ERROR', message: 'Fallo la conexión a Firestore', error });
    }
});
app.use('/api/usuarios', usuarioRoutes_1.default);
app.use('/api/asignaturas', asignaturaRoutes_1.default);
app.use('/api/asignaturas', notaRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
//# sourceMappingURL=index.js.map