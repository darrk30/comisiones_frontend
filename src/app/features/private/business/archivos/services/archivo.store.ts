import { Injectable } from "@angular/core";
import { ArchivosRepository } from "../data/archivos.repository";
import { saveAs } from "file-saver";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ArchivoStore {
    constructor(private archivosRepository: ArchivosRepository) {}
    
}
