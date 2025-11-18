import { Injectable, signal } from "@angular/core";
import {
  EstadoTrazabilidad,
  EstadoTrazabilidadRpta,
} from "../data/estado-trazabilidad.model";
import { EstadosTrazabilidadRepository } from "../data/estados-trazabilidad.repository";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class EstadosTrazabilidadStateService {
  items = signal<EstadoTrazabilidad[]>([]);
  item = signal<EstadoTrazabilidad | null>(null);

  constructor(
    private EstadoTrazabilidadRepository: EstadosTrazabilidadRepository,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  loadItems() {
    this.spinner.show();
    this.EstadoTrazabilidadRepository.getAll().subscribe({
      next: (data: EstadoTrazabilidadRpta) => {
        this.items.set(data.datos);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  loadItemById(id: number) {
    this.spinner.show();
    this.EstadoTrazabilidadRepository.getBydId(id).subscribe({
      next: (data) => {
        this.item.set(data.dato);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
