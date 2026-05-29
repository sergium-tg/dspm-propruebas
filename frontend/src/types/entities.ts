export interface Usuario {
  uid: string;
  nombre: string;
  correo: string;
  rol: string;
  carrera?: string;
  codigo?: string;
}

export interface Estudiante {
  codigo: string;
  nombres: string;
  apellidos: string;
  beneficios_promedio: number;
  beneficios_cumple: boolean;
  promedio_semestral: number;
  usuario_uid: string;
  carrera?: string;
}

export interface CrearUsuarioResponse {
  message: string;
  data: Usuario;
}

export interface CrearEstudianteResponse {
  message: string;
  data: Estudiante;
}

export interface Asignatura {
  id: string;
  nombre: string;
  creditos: number;
  nota?: number;
  usuario_uid: string;
  semestre?: string;
}

export interface CrearAsignaturaResponse {
  message: string;
  data: Asignatura;
}
