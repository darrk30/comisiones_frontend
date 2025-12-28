import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EquiposTrabajoRepository } from "../data/equipos-trabajo.repository";

@Injectable({ providedIn: 'root' })
export class EquipoTrabajoStore {
    constructor(private equipoTrabajosRepository: EquiposTrabajoRepository) {}

    descargar(uuid: string): Observable<Blob> {
        return this.equipoTrabajosRepository.descargar(uuid);
    }

    descargarExcel(filterData: any): Observable<Blob> {
        return this.equipoTrabajosRepository.descargarExcel(filterData);
    }

    // descargarExcelResumen(filterData: any): Observable<Blob> {
    //     return this.equipoTrabajosRepository.descargarExcelResumen(filterData);
    // }

    // descargarPdfResumen(filterData: any): Observable<Blob> {
    //     return this.equipoTrabajosRepository.descargarPdfResumen(filterData);
    // }
}
