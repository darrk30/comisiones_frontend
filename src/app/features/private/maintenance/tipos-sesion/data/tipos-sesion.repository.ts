import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  TipoSesion,
  TipoSesionRpta,
} from "./tipo-sesion.model";

@Injectable({ providedIn: "root" })
export class TiposSesionRepository {
  private apiUrl = `${environment.urlBackend}/api/tipo-sesion`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoSesionRpta> {
    return this.http.get<TipoSesionRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<TipoSesionRpta> {
    return this.http.get<TipoSesionRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: TipoSesion): Observable<TipoSesionRpta> {
    return this.http.post<TipoSesionRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number,entidad: TipoSesion): Observable<TipoSesionRpta> {
    entidad.ideTipoSesion = id;
    return this.http.put<TipoSesionRpta>(
      `${this.apiUrl}/${id}`,
      entidad
    );
  }

  postForm(entidad: TipoSesion, id?: number) {
    if (id) {
      return this.update(id, entidad);
    } else {
      return this.create(entidad);
    }
  }

  delete(id: number): Observable<TipoSesionRpta> {
    return this.http.delete<TipoSesionRpta>(`${this.apiUrl}/${id}`);
  }
}
