import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento, TipoDocumentoRpta } from './tipo-documento.model';

@Injectable({ providedIn: 'root' })
export class TiposDocumentosRepository {
	private apiUrl = `${environment.urlBackend}/api/tipo-documento`;

	constructor(
		private http: HttpClient
	) {}

	getAll(): Observable<TipoDocumentoRpta> {
		return this.http.get<TipoDocumentoRpta>(`${this.apiUrl}`);
	}

	getBydId(id: number): Observable<TipoDocumentoRpta> {
		return this.http.get<TipoDocumentoRpta>(`${this.apiUrl}/${id}`);
	}

	create(entidad: TipoDocumento): Observable<TipoDocumentoRpta> {
		return this.http.post<TipoDocumentoRpta>(`${this.apiUrl}`, entidad);
	}

	update(id: number, entidad: TipoDocumento): Observable<TipoDocumentoRpta> {
		entidad.ideTipoDocumento = id;
		return this.http.put<TipoDocumentoRpta>(`${this.apiUrl}/${id}`, entidad);
	}

	postForm(entidad: TipoDocumento,id?: number){
		if(id){
			return this.update(id,entidad)
		}else{
			return this.create(entidad)
		}
	}

	delete(id: number): Observable<TipoDocumentoRpta> {
		return this.http.delete<TipoDocumentoRpta>(`${this.apiUrl}/${id}`);
	}

}