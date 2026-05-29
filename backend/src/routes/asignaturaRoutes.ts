import { Router } from 'express';
import {
  crearAsignatura,
  obtenerAsignaturas,
  eliminarAsignatura,
  actualizarAsignatura,
} from '../controllers/asignaturaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', crearAsignatura);
router.get('/', obtenerAsignaturas);
router.patch('/:id', actualizarAsignatura);
router.delete('/:id', eliminarAsignatura);

export default router;
