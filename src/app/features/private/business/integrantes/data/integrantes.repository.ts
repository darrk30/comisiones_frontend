import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Integrante, IntegranteRpta } from './integrante.model';

@Injectable({ providedIn: 'root' })
export class IntegrantesRepository {
	private apiUrl = `${environment.urlBackend}/api/integrante`;

	constructor(
		private http: HttpClient
	) {}

	getAllByEquipoTrabajo(ideEquipoTrabajo:number): Observable<IntegranteRpta> {
		return this.http.get<IntegranteRpta>(`${this.apiUrl}/get-all-integrantes-by-equipo-trabajo/${ideEquipoTrabajo}`);
	}

	getAll(): Observable<IntegranteRpta> {
		return this.http.get<IntegranteRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<IntegranteRpta> {
		return this.http.get<IntegranteRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: Integrante): Observable<IntegranteRpta> {
		return this.http.post<IntegranteRpta>(`${this.apiUrl}`, entidad);
	}

	update(id: number, entidad: Integrante): Observable<IntegranteRpta> {
		entidad.ideIntegrante = id;
		return this.http.put<IntegranteRpta>(`${this.apiUrl}/${id}`, entidad);
	}

	postForm(entidad: Integrante,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<IntegranteRpta> {
		return this.http.delete<IntegranteRpta>(`${this.apiUrl}/${id}`);
	}

}
