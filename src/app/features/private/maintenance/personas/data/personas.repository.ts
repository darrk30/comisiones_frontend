import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Persona, PersonaRpta } from './persona.model';

@Injectable({ providedIn: 'root' })
export class PersonasRepository {
	private apiUrl = `${environment.urlBackend}/api/persona`;

	constructor(
		private http: HttpClient
	) {}

	getAllByIdeOficina(ideOficina): Observable<PersonaRpta> {
		return this.http.get<PersonaRpta>(`${this.apiUrl}/get-all-persona-by-oficina/${ideOficina}`);
	}

	getAll(): Observable<PersonaRpta> {
		return this.http.get<PersonaRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<PersonaRpta> {
		return this.http.get<PersonaRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: Persona): Observable<PersonaRpta> {
		return this.http.post<PersonaRpta>(`${this.apiUrl}`, entidad);
	}

	update(id: number, entidad: Persona): Observable<PersonaRpta> {
		entidad.idePersona = id;
		return this.http.put<PersonaRpta>(`${this.apiUrl}/${id}`, entidad);
	}

	postForm(entidad: Persona,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<PersonaRpta> {
		return this.http.delete<PersonaRpta>(`${this.apiUrl}/${id}`);
	}

}