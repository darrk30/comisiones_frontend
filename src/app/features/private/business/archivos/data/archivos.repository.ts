import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Archivo, ArchivoRpta } from './archivo.model';
import { appendFormData } from 'src/app/core/helpers/clean-form';

@Injectable({ providedIn: 'root' })
export class ArchivosRepository {
	private apiUrl = `${environment.urlBackend}/api/archivo`;

	constructor(
		private http: HttpClient
	) {}

	getAllByEquipoTrabajo(ideEquipoTrabajo:number): Observable<ArchivoRpta> {
		return this.http.get<ArchivoRpta>(`${this.apiUrl}/get-all-archivos-by-equipo-trabajo/${ideEquipoTrabajo}`);
	}

	getAll(): Observable<ArchivoRpta> {
		return this.http.get<ArchivoRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<ArchivoRpta> {
		return this.http.get<ArchivoRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: Archivo): Observable<ArchivoRpta> {
		// const body = new FormData();
		// appendFormData(body, entidad);
		// return this.http.post<ArchivoRpta>(`${this.apiUrl}`, body);
		return this.http.post<ArchivoRpta>(`${this.apiUrl}`, entidad);
	}

	update(id: number, entidad: Archivo): Observable<ArchivoRpta> {
		entidad.ideArchivo = id;
		return this.http.put<ArchivoRpta>(`${this.apiUrl}/${id}`, entidad);
	}

	postForm(entidad: Archivo,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<ArchivoRpta> {
		return this.http.delete<ArchivoRpta>(`${this.apiUrl}/${id}`);
	}

	descargar(uuid: string): Observable<Blob> {
		return this.http.get(`${this.apiUrl}/descargar/${uuid}`, { responseType: 'blob' });
	}

  descargarById(id: number): Observable<Blob> {
		return this.http.get(`${this.apiUrl}/descargar/${id}`, { responseType: 'blob' });
	}

}
