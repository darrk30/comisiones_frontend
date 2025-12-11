import { computed, Injectable, signal } from "@angular/core";
import {
  EstadoTiempo,
  EstadoTiempoRpta,
} from "../data/estado-tiempo.model";
import { EstadosComisionRepository } from "../data/estados-tiempo.repository";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class EstadosTiempoStateService {
  items = signal<EstadoTiempo[]>([]);
  item = signal<EstadoTiempo | null>(null);

  readonly itemsListado = computed(() =>
    this.items()
  );

  constructor(
    private EstadoTiempoRepository: EstadosComisionRepository,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  loadItems() {
    this.spinner.show();
    this.EstadoTiempoRepository.getAll().subscribe({
      next: (data: EstadoTiempoRpta) => {
        this.items.set(data.datos);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  loadItemById(id: number) {
    this.spinner.show();
    this.EstadoTiempoRepository.getBydId(id).subscribe({
      next: (data) => {
        this.item.set(data.dato);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
