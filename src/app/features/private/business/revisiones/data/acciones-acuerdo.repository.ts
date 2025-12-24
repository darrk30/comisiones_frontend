import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appendFormData } from '@/app/core/helpers/clean-form';
import { AccionAcuerdo, AccionAcuerdoRpta } from './accion-acuerdo.model';
import { AcuerdoRpta } from '../../acuerdos/data/acuerdo.model';

@Injectable({providedIn: 'root'})
export class AccionesAcuerdoRepository {
  private apiUrl = `${environment.urlBackend}/api/acuerdo-accion`;

    constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<AccionAcuerdoRpta> {
    return this.http.get<AccionAcuerdoRpta>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<AccionAcuerdoRpta> {
    return this.http.get<AccionAcuerdoRpta>(`${this.apiUrl}/${id}`);
  }

  getByIdeAcuerdo(ideAcuerdo: number): Observable<AccionAcuerdoRpta> {
    return this.http.get<AccionAcuerdoRpta>(`${this.apiUrl}/get-acuerdo-accion-by-acuerdo/${ideAcuerdo}`);
  }

  create(entidad: AccionAcuerdo): Observable<AccionAcuerdoRpta> {
    // const body = new FormData();
    //    appendFormData(body, entidad);
    return this.http.post<AccionAcuerdoRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number, entidad: AccionAcuerdo): Observable<AccionAcuerdoRpta> {
    entidad.ideAcuerdoAccion = id;
    // const body = new FormData();
    // appendFormData(body, entidad);
    return this.http.put<AccionAcuerdoRpta>(`${this.apiUrl}/${id}`, entidad);
  }

  postForm(entidad: AccionAcuerdo,id?: number){
    if(id){
      return this.update(id,entidad)
    }else{
      return this.create(entidad)
    }
  }

  delete(id: number): Observable<AccionAcuerdoRpta> {
    return this.http.delete<AccionAcuerdoRpta>(`${this.apiUrl}/${id}`);
  }

  deleteByAcuerdo(id: number): Observable<AcuerdoRpta> {
    return this.http.delete<AcuerdoRpta>(`${this.apiUrl}/delete-by-acuerdo/${id}`);
  }

  descargar(uuid: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${uuid}`, { responseType: 'blob' });
  }

}
