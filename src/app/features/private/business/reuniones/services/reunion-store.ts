import { Injectable } from "@angular/core";
// import { ReunionesRepository } from "../data/archivos.repository";
import { saveAs } from "file-saver";
import { Observable } from "rxjs";
import { ReunionesRepository } from "../data/reuniones.repository";
import { HttpHeaders, HttpResponse } from "@angular/common/http";

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

    obtenerNombreArchivo(headers: HttpHeaders): string {
      const contentDisposition = headers.get("Content-Disposition");
      if (!contentDisposition) return "archivo.pdf";

      // Intentar filename* (UTF-8)
      const utf8Match = contentDisposition.match(/filename\*\=UTF-8''([^;]+)/);
      if (utf8Match && utf8Match[1]) {
        return decodeURIComponent(utf8Match[1]);
      }

      // Fallback a filename normal
      const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (normalMatch && normalMatch[1]) {
        return normalMatch[1];
      }

      return "archivo.pdf";
    }
}
