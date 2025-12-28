import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipoTrabajo, EquipoTrabajoRpta } from './equipo-trabajo.model';
import { appendFormData } from '@/app/core/helpers/clean-form';

@Injectable({providedIn: 'root'})
export class EquiposTrabajoRepository {
	private apiUrl = `${environment.urlBackend}/api/equipo-trabajo`;

  	constructor(
		private http: HttpClient
	) {}

	getAll(): Observable<EquipoTrabajoRpta> {
		return this.http.get<EquipoTrabajoRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<EquipoTrabajoRpta> {
		return this.http.get<EquipoTrabajoRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: EquipoTrabajo): Observable<EquipoTrabajoRpta> {
		const body = new FormData();
		appendFormData(body, entidad);
		return this.http.post<EquipoTrabajoRpta>(`${this.apiUrl}`, body);
	}

  update(id: number, entidad: EquipoTrabajo): Observable<EquipoTrabajoRpta> {
		entidad.ideEquipoTrabajo = id;
		const body = new FormData();
		appendFormData(body, entidad);
		return this.http.put<EquipoTrabajoRpta>(`${this.apiUrl}/${id}`, body);
	}

	postForm(entidad: EquipoTrabajo,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<EquipoTrabajoRpta> {
		return this.http.delete<EquipoTrabajoRpta>(`${this.apiUrl}/${id}`);
	}

  descargar(uuid: string): Observable<Blob> {
		return this.http.get(`${this.apiUrl}/descargar/${uuid}`, { responseType: 'blob' });
	}

  descargarExcel(filterData: any): Observable<Blob> {
		const urlParams = this.convertToURLParams(filterData);
		return this.http.get(`${this.apiUrl}/exportar-excel?${urlParams}`, { responseType: 'blob' });
	}

  convertToURLParams(filterData: any){
		const urlParams = Object.keys(filterData).map((key) => {
				const value = filterData[key];
				if (!Array.isArray(value))	return `${key}=${value}`;
				return value.map((val)=>`${key}=${val}`).join("&");
			}
		).join("&");
		return urlParams;
	}

}
