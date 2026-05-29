import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseAdmin';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Error de seguridad:', error);
    res.status(401).json({ error: 'Acceso denegado. Token inválido o expirado.' });
  }
};

/** @deprecated Usar authMiddleware */
export const verificarToken = authMiddleware;
