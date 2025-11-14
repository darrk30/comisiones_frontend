import { Injectable } from "@angular/core";
import { DemosRepository } from "../data/demos.repository";
import { saveAs } from "file-saver";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DemoStore {
    constructor(private entidadRepository: DemosRepository) {}
    
}
