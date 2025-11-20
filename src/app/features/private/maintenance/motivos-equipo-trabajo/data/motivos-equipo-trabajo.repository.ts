import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  MotivoEquipoTrabajo,
  MotivoEquipoTrabajoRpta,
} from "./motivo-equipo-trabajo.model";

@Injectable({ providedIn: "root" })
export class MotivosEquipoTrabajoRepository {
  private apiUrl = `${environment.urlBackend}/api/motivo-equipo-trabajo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotivoEquipoTrabajoRpta> {
    return this.http.get<MotivoEquipoTrabajoRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<MotivoEquipoTrabajoRpta> {
    return this.http.get<MotivoEquipoTrabajoRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: MotivoEquipoTrabajo): Observable<MotivoEquipoTrabajoRpta> {
    return this.http.post<MotivoEquipoTrabajoRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number,entidad: MotivoEquipoTrabajo): Observable<MotivoEquipoTrabajoRpta> {
    entidad.ideMotivoEquipoTrabajo = id;
    return this.http.put<MotivoEquipoTrabajoRpta>(
      `${this.apiUrl}/${id}`,
      entidad
    );
  }

  postForm(entidad: MotivoEquipoTrabajo, id?: number) {
    if (id) {
      return this.update(id, entidad);
    } else {
      return this.create(entidad);
    }
  }

  delete(id: number): Observable<MotivoEquipoTrabajoRpta> {
    return this.http.delete<MotivoEquipoTrabajoRpta>(`${this.apiUrl}/${id}`);
  }
}
