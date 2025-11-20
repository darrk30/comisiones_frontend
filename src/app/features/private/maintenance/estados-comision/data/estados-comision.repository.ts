import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  EstadoComision,
  EstadoComisionRpta,
} from "./estado-comision.model";

@Injectable({ providedIn: "root" })
export class EstadosComisionRepository {
  private apiUrl = `${environment.urlBackend}/api/estado-comision`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EstadoComisionRpta> {
    return this.http.get<EstadoComisionRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<EstadoComisionRpta> {
    return this.http.get<EstadoComisionRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: EstadoComision): Observable<EstadoComisionRpta> {
    return this.http.post<EstadoComisionRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number,entidad: EstadoComision): Observable<EstadoComisionRpta> {
    entidad.ideEstadoComision = id;
    return this.http.put<EstadoComisionRpta>(
      `${this.apiUrl}/${id}`,
      entidad
    );
  }

  postForm(entidad: EstadoComision, id?: number) {
    if (id) {
      return this.update(id, entidad);
    } else {
      return this.create(entidad);
    }
  }

  delete(id: number): Observable<EstadoComisionRpta> {
    return this.http.delete<EstadoComisionRpta>(`${this.apiUrl}/${id}`);
  }
}
