import express from 'express';
import cors from 'cors';
import { db } from './config/firebaseAdmin';

import usuarioRoutes from './routes/usuarioRoutes';
import asignaturaRoutes from './routes/asignaturaRoutes';
import notaRoutes from './routes/notaRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await db.collection('usuarios').limit(1).get();
    res.status(200).json({ status: 'OK', message: 'Backend conectado a Firestore correctamente' });
  } catch (error) {
    console.error('Error conectando a Firestore:', error);
    res.status(500).json({ status: 'ERROR', message: 'Fallo la conexión a Firestore', error });
  }
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/asignaturas', notaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
