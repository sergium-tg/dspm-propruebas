import { Router } from 'express';
import { agregarNota, obtenerNotas, eliminarNota, actualizarNota } from '../controllers/notaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/:idAsignatura/notas', agregarNota);
router.get('/:idAsignatura/notas', obtenerNotas);
router.patch('/:idAsignatura/notas/:idNota', actualizarNota);
router.delete('/:idAsignatura/notas/:idNota', eliminarNota);

export default router;
