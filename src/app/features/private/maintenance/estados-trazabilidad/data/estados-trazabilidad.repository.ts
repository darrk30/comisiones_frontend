import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  EstadoTrazabilidad,
  EstadoTrazabilidadRpta,
} from "./estado-trazabilidad.model";

@Injectable({ providedIn: "root" })
export class EstadosTrazabilidadRepository {
  private apiUrl = `${environment.urlBackend}/api/estadotrazabilidad`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EstadoTrazabilidadRpta> {
    return this.http.get<EstadoTrazabilidadRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<EstadoTrazabilidadRpta> {
    return this.http.get<EstadoTrazabilidadRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: EstadoTrazabilidad): Observable<EstadoTrazabilidadRpta> {
    return this.http.post<EstadoTrazabilidadRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number,entidad: EstadoTrazabilidad): Observable<EstadoTrazabilidadRpta> {
    entidad.ideEstadoTrazabilidad = id;
    return this.http.put<EstadoTrazabilidadRpta>(
      `${this.apiUrl}/${id}`,
      entidad
    );
  }

  postForm(entidad: EstadoTrazabilidad, id?: number) {
    if (id) {
      return this.update(id, entidad);
    } else {
      return this.create(entidad);
    }
  }

  delete(id: number): Observable<EstadoTrazabilidadRpta> {
    return this.http.delete<EstadoTrazabilidadRpta>(`${this.apiUrl}/${id}`);
  }
}
