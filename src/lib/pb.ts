import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Types for our database records
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'docente' | 'd_carrera' | 'd_escuela' | 'daa' | 'gestion' | 'visualizador';
  carrera?: string;
  escuela?: string;
}

export interface Asignatura {
  id: string;
  codigo: string;
  nombre: string;
  carrera: string;
  escuela?: string;
  horas_interaccion_pedagogica: number;
}

export interface Notification {
  id: string;
  created: string;
  docente: string; // user ID
  expand?: {
    docente?: User;
    asignatura?: Asignatura[];
  };
  asignatura: string[]; // asignatura IDs
  tipo: 'lineal' | 'no_lineal';
}

export interface ProgramRevision {
  fecha: string;
  usuario: string;
  rol: string;
  accion: 'presentar' | 'aceptar' | 'observar' | 'crear';
  mensaje: string;
}

export interface HistorialRevisiones {
  aprobaciones_carrera?: string[]; // career names
  aprobaciones_escuela?: string[]; // school names
  historial?: ProgramRevision[];
}

export interface ProgramaAnalitico {
  id: string;
  created: string;
  updated: string;
  docente_id: string;
  asignatura_id: string[]; // relation array
  expand?: {
    docente_id?: User;
    asignatura_id?: Asignatura[];
  };
  estado: 'borrador' | 'revision_carrera' | 'revision_escuela' | 'revision_daa' | 'observado' | 'aceptado';
  horas_distancia: number;
  horas_teoricas: number;
  horas_practicas: number;
  horas_autonomas: number;
  fundamentacion: string;
  propositos: string;
  metodologia: string;
  perspectiva_genero: boolean;
  descripcion_genero: string;
  actividades_extension: boolean;
  descripcion_extension: string;
  propuesta_evaluacion: string;
  requisitos_acreditacion: string;
  promocionable: boolean;
  escala_promocionable: 'escala_1_10' | 'escala_aprobado_reprobado' | 'escala_letras' | 'ninguna';
  rendirse_libre: boolean;
  historial_revisiones?: HistorialRevisiones;
}

export interface Unidad {
  id: string;
  pa_id: string;
  titulo: string;
  semanas_dictado: number[]; // e.g. [1, 2]
  actividades: string;
  biblio_obligatoria: string;
  biblio_complementaria: string;
}

export interface VentanaActualizacion {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  anio_lectivo: string;
  activa: boolean;
}
