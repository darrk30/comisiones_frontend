import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oficina, OficinaRpta } from './oficina.model';

@Injectable({ providedIn: 'root' })
export class OficinasRepository {
	private apiUrl = `${environment.urlBackend}/api/oficina`;

	constructor(
		private http: HttpClient
	) {}

	getAll(): Observable<OficinaRpta> {
		return this.http.get<OficinaRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<OficinaRpta> {
		return this.http.get<OficinaRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: Oficina): Observable<OficinaRpta> {
		return this.http.post<OficinaRpta>(`${this.apiUrl}`, entidad);
	}

	update(id: number, entidad: Oficina): Observable<OficinaRpta> {
		entidad.ideOficina = id;
		return this.http.put<OficinaRpta>(`${this.apiUrl}/${id}`, entidad);
	}

	postForm(entidad: Oficina,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<OficinaRpta> {
		return this.http.delete<OficinaRpta>(`${this.apiUrl}/${id}`);
	}

}