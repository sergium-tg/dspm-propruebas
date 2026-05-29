import { Router } from 'express';
import { agregarNota, obtenerNotas, eliminarNota } from '../controllers/notaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/:idAsignatura/notas', agregarNota);
router.get('/:idAsignatura/notas', obtenerNotas);
router.delete('/:idAsignatura/notas/:idNota', eliminarNota);

export default router;
