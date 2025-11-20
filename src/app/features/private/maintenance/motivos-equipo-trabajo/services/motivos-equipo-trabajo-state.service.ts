import { computed, Injectable, signal } from "@angular/core";
import {
  MotivoEquipoTrabajo,
  MotivoEquipoTrabajoRpta,
} from "../data/motivo-equipo-trabajo.model";
import { MotivosEquipoTrabajoRepository } from "../data/motivos-equipo-trabajo.repository";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class MotivosEquipoTrabajoStateService {
  items = signal<MotivoEquipoTrabajo[]>([]);
  item = signal<MotivoEquipoTrabajo | null>(null);

   readonly itemsListado = computed(() =>
        // this.items().filter(e => e.ideMotivoEquipoTrabajo != 2)
        this.items()
    );

  constructor(
    private MotivosEquipoTrabajoRepository: MotivosEquipoTrabajoRepository,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  loadItems() {
    this.spinner.show();
    this.MotivosEquipoTrabajoRepository.getAll().subscribe({
      next: (data: MotivoEquipoTrabajoRpta) => {
        this.items.set(data.datos);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  loadItemById(id: number) {
    this.spinner.show();
    this.MotivosEquipoTrabajoRepository.getBydId(id).subscribe({
      next: (data) => {
        this.item.set(data.dato);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
