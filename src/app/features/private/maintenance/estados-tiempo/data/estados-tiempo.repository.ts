import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  EstadoTiempo,
  EstadoTiempoRpta,
} from "./estado-tiempo.model";

@Injectable({ providedIn: "root" })
export class EstadosComisionRepository {
  private apiUrl = `${environment.urlBackend}/api/estado-tiempo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EstadoTiempoRpta> {
    return this.http.get<EstadoTiempoRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<EstadoTiempoRpta> {
    return this.http.get<EstadoTiempoRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: EstadoTiempo): Observable<EstadoTiempoRpta> {
    return this.http.post<EstadoTiempoRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number,entidad: EstadoTiempo): Observable<EstadoTiempoRpta> {
    entidad.ideEstadoTiempo = id;
    return this.http.put<EstadoTiempoRpta>(
      `${this.apiUrl}/${id}`,
      entidad
    );
  }

  postForm(entidad: EstadoTiempo, id?: number) {
    if (id) {
      return this.update(id, entidad);
    } else {
      return this.create(entidad);
    }
  }

  delete(id: number): Observable<EstadoTiempoRpta> {
    return this.http.delete<EstadoTiempoRpta>(`${this.apiUrl}/${id}`);
  }
}
