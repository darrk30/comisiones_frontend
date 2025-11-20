import { computed, Injectable, signal } from "@angular/core";
import {
  TipoEquipoTrabajo,
  TipoEquipoTrabajoRpta,
} from "../data/tipo-equipo-trabajo.model";
import { TiposEquipoTrabajoRepository } from "../data/tipos-equipo-trabajo.repository";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class TiposEquipoTrabajoStateService {
  items = signal<TipoEquipoTrabajo[]>([]);
  item = signal<TipoEquipoTrabajo | null>(null);

  readonly itemsListado = computed(() =>
      this.items()
  );

  constructor(
    private tiposEquipoTrabajoRepository: TiposEquipoTrabajoRepository,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  loadItems() {
    this.spinner.show();
    this.tiposEquipoTrabajoRepository.getAll().subscribe({
      next: (data: TipoEquipoTrabajoRpta) => {
        this.items.set(data.datos);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  loadItemById(id: number) {
    this.spinner.show();
    this.tiposEquipoTrabajoRepository.getBydId(id).subscribe({
      next: (data) => {
        this.item.set(data.dato);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
