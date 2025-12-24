import { environment } from '@/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { appendFormData } from '@/app/core/helpers/clean-form';
import { Acuerdo, AcuerdoRpta } from './acuerdo.model';

@Injectable({providedIn: 'root'})
export class AcuerdosRepository {
  private apiUrl = `${environment.urlBackend}/api/acuerdo`;

    constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<AcuerdoRpta> {
    return this.http.get<AcuerdoRpta>(`${this.apiUrl}`);
  }

   getAllByFilter(ideEquipoTrabajo, ideReunion, txtTemaReunion ,ideEstadoTiempo): Observable<AcuerdoRpta> {

    console.log('datos-filtro:',{ideEquipoTrabajo,ideReunion,txtTemaReunion,ideEstadoTiempo});

    let filter = "";

     filter = `ideEquipoTrabajo=${ideEquipoTrabajo}&ideReunion=${ideReunion??''}&txtTemaReunion=${txtTemaReunion??''}&ideEstadoTiempo=${ideEstadoTiempo??''}`
    // filter = `ideEquipoTrabajo=${ideEquipoTrabajo}`;

    // if (ideReunion) {
    //   filter.concat(`&ideReunion=${ideReunion}`);
    // }
    // if (txtTemaReunion) {
    //   filter.concat(`&txtTemaReunion=${txtTemaReunion}`);
    // }
    // if (ideEstadoTiempo) {
    //   filter.concat(`&ideEstadoTiempo=${ideEstadoTiempo}`);
    // }

    console.log('filter: ', filter);

    return this.http.get<AcuerdoRpta>(`${this.apiUrl}/filtro?${filter}`);
  }

  getBydId(id: number): Observable<AcuerdoRpta> {
    return this.http.get<AcuerdoRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: Acuerdo): Observable<AcuerdoRpta> {
    // const body = new FormData();
    // appendFormData(body, entidad);
    // return this.http.post<AcuerdoRpta>(`${this.apiUrl}`, body);
    return this.http.post<AcuerdoRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number, entidad: Acuerdo): Observable<AcuerdoRpta> {
    entidad.ideAcuerdo = id;
    // const body = new FormData();
    // appendFormData(body, entidad);
    // return this.http.put<AcuerdoRpta>(`${this.apiUrl}/${id}`, body);
    return this.http.put<AcuerdoRpta>(`${this.apiUrl}/${id}`, entidad);
  }

  postForm(entidad: Acuerdo,id?: number){
    if(id){
      return this.update(id,entidad)
    }else{
      return this.create(entidad)
    }
  }

  delete(id: number): Observable<AcuerdoRpta> {
    return this.http.delete<AcuerdoRpta>(`${this.apiUrl}/${id}`);
  }

  notificar(id: number): Observable<AcuerdoRpta> {
    const body = {ideAcuerdos: [id]}
    return this.http.post<AcuerdoRpta>(`${this.apiUrl}/notificar`,body);
  }

  // notificar(id: number): Observable<AcuerdoRpta> {
  //   return this.http.delete<AcuerdoRpta>(`${this.apiUrl}/notificar/${id}`);
  // }

  descargar(uuid: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${uuid}`, { responseType: 'blob' });
  }

}
