import { Router } from 'express';
import {
  crearAsignatura,
  obtenerAsignaturas,
  eliminarAsignatura,
} from '../controllers/asignaturaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', crearAsignatura);
router.get('/', obtenerAsignaturas);
router.delete('/:id', eliminarAsignatura);

export default router;
