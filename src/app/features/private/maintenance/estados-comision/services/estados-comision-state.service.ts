import { computed, Injectable, signal } from "@angular/core";
import {
  EstadoComision,
  EstadoComisionRpta,
} from "../data/estado-comision.model";
import { EstadosComisionRepository } from "../data/estados-comision.repository";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class EstadosComisionStateService {
  items = signal<EstadoComision[]>([]);
  item = signal<EstadoComision | null>(null);

  readonly itemsListado = computed(() =>
    this.items()
  );

  constructor(
    private EstadoComisionRepository: EstadosComisionRepository,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  loadItems() {
    this.spinner.show();
    this.EstadoComisionRepository.getAll().subscribe({
      next: (data: EstadoComisionRpta) => {
        this.items.set(data.datos);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  loadItemById(id: number) {
    this.spinner.show();
    this.EstadoComisionRepository.getBydId(id).subscribe({
      next: (data) => {
        this.item.set(data.dato);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
