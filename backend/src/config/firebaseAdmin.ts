import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Asegúrate de que el archivo serviceAccountKey.json esté en la raíz de la carpeta 'backend'
const serviceAccountPath = path.join(__dirname, '..', '..', 'serviceAccountKey.json');

try {
  // Leemos y parseamos el JSON
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Inicializamos Firebase
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error("Error crítico: No se pudo cargar el archivo de credenciales en:", serviceAccountPath);
  console.error("Detalle del error:", error);
}

export const db = admin.firestore();