import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Demo, DemoRpta } from './demo.model';
import { appendFormData } from 'src/app/core/helpers/clean-form';

@Injectable({ providedIn: 'root' })
export class DemosRepository {
	private apiUrl = `${environment.urlBackend}/api/demo`;

	constructor(
		private http: HttpClient
	) {}

	getAll(): Observable<DemoRpta> {
		return this.http.get<DemoRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<DemoRpta> {
		return this.http.get<DemoRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: Demo): Observable<DemoRpta> {
		return this.http.post<DemoRpta>(`${this.apiUrl}`, entidad);
	}

	update(id: number, entidad: Demo): Observable<DemoRpta> {
		entidad.ideDemo = id;
		return this.http.put<DemoRpta>(`${this.apiUrl}/${id}`, entidad);
	}

	postForm(entidad: Demo,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<DemoRpta> {
		return this.http.delete<DemoRpta>(`${this.apiUrl}/${id}`);
	}

}