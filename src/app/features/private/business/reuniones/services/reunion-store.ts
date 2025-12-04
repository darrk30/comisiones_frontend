import { Injectable } from "@angular/core";
// import { ReunionesRepository } from "../data/archivos.repository";
import { saveAs } from "file-saver";
import { Observable } from "rxjs";
import { ReunionesRepository } from "../data/reuniones.repository";
import { HttpResponse } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ReunionStore {
    constructor(private archivosRepository: ReunionesRepository) {}

    descargar(uuid: string): Observable<Blob> {
        return this.archivosRepository.descargar(uuid);
    }

    // descargarById(id: number): Observable<Blob> {
    //     return this.archivosRepository.descargarById(id);
    // }

     descargarById(id: number): Observable<HttpResponse<Blob>> {
        return this.archivosRepository.descargarById(id);
    }
}
