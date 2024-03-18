import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { CargarMedicos } from '../interfaces/cargar-medicos.interface';
import { CargarMedico } from '../interfaces/cargar-medico.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): Object {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  constructor(private http: HttpClient) {}

  cargarMedicos(): Observable<Medico[]> {
    const url = `${base_url}/medicos`;
    return this.http
      .get<CargarMedicos>(url, this.headers)
      .pipe(map((res: CargarMedicos) => res.medicos));
  }
  obtenerMedicoPorId(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    return this.http
      .get<CargarMedico>(url, this.headers)
      .pipe(map((res: CargarMedico) => res.medico));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  borrarMedico(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
