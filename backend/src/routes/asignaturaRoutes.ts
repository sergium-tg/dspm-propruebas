import { Router } from 'express';
import {
  crearAsignatura,
  obtenerAsignaturas,
  obtenerAsignaturaPorId,
  eliminarAsignatura,
  actualizarAsignatura,
} from '../controllers/asignaturaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', crearAsignatura);
router.get('/', obtenerAsignaturas);
router.get('/:id', obtenerAsignaturaPorId);
router.patch('/:id', actualizarAsignatura);
router.delete('/:id', eliminarAsignatura);

export default router;
