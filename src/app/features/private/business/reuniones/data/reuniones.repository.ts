import { environment } from '@/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { appendFormData } from '@/app/core/helpers/clean-form';
import { Reunion, ReunionRpta } from './reunion.model';

@Injectable({providedIn: 'root'})
export class ReunionesRepository {
  private apiUrl = `${environment.urlBackend}/api/reunion`;

    constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<ReunionRpta> {
    return this.http.get<ReunionRpta>(`${this.apiUrl}`);
  }

  getBydId(id: number): Observable<ReunionRpta> {
    return this.http.get<ReunionRpta>(`${this.apiUrl}/${id}`);
  }

  create(entidad: Reunion): Observable<ReunionRpta> {
    // const body = new FormData();
    // appendFormData(body, entidad);
    // return this.http.post<ReunionRpta>(`${this.apiUrl}`, body);
    return this.http.post<ReunionRpta>(`${this.apiUrl}`, entidad);
  }

  update(id: number, entidad: Reunion): Observable<ReunionRpta> {
    entidad.ideReunion = id;
    // const body = new FormData();
    // appendFormData(body, entidad);
    // return this.http.put<ReunionRpta>(`${this.apiUrl}/${id}`, body);
    return this.http.put<ReunionRpta>(`${this.apiUrl}/${id}`, entidad);
  }

  postForm(entidad: Reunion,id?: number){
    if(id){
      return this.update(id,entidad)
    }else{
      return this.create(entidad)
    }
  }

  delete(id: number): Observable<ReunionRpta> {
    return this.http.delete<ReunionRpta>(`${this.apiUrl}/${id}`);
  }

  descargar(uuid: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${uuid}`, { responseType: 'blob' });
  }

  // descargarById(id: number): Observable<Blob> {
	// 	return this.http.get(`${this.apiUrl}/descargar-acta/${id}`, { responseType: 'blob' });
	// }


//  descargarById(id: number): Observable<Blob> {
// 		return this.http.get(`${this.apiUrl}/acta/${id}/pdf`, { responseType: 'blob' });
// 	}

 descargarById(id: number): Observable<HttpResponse<Blob>> {
		return this.http.get(`${this.apiUrl}/acta/${id}/pdf`, { observe:'response', responseType: 'blob'
    });
	}

}
