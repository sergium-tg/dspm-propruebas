import { Router } from 'express';
import { crearUsuario, obtenerPerfil } from '../controllers/usuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// POST: Registro inicial del perfil en Firestore (sin token, tras crear cuenta en Firebase Auth)
router.post('/', crearUsuario);

// GET: Perfil del usuario autenticado
router.get('/perfil', authMiddleware, obtenerPerfil);

export default router;
