import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  TipoEquipoTrabajo,
  TipoEquipoTrabajoRpta,
} from "./tipo-equipo-trabajo.model";

@Injectable({ providedIn: "root" })
export class TiposEquipoTrabajoRepository {
  private apiUrl = `${environment.urlBackend}/api/tipoequipotrabajo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoEquipoTrabajoRpta> {
    return this.http.get<TipoEquipoTrabajoRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<TipoEquipoTrabajoRpta> {
    return this.http.get<TipoEquipoTrabajoRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: TipoEquipoTrabajo): Observable<TipoEquipoTrabajoRpta> {
    return this.http.post<TipoEquipoTrabajoRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number,entidad: TipoEquipoTrabajo): Observable<TipoEquipoTrabajoRpta> {
    entidad.ideTipoEquipoTrabajo = id;
    return this.http.put<TipoEquipoTrabajoRpta>(
      `${this.apiUrl}/${id}`,
      entidad
    );
  }

  postForm(entidad: TipoEquipoTrabajo, id?: number) {
    if (id) {
      return this.update(id, entidad);
    } else {
      return this.create(entidad);
    }
  }

  delete(id: number): Observable<TipoEquipoTrabajoRpta> {
    return this.http.delete<TipoEquipoTrabajoRpta>(`${this.apiUrl}/${id}`);
  }
}
