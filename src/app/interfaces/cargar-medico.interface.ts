import { Medico } from '../models/medico.model';

export interface CargarMedico {
  ok: boolean;
  medico: Medico;
}
