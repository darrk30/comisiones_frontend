import { computed, Injectable, signal } from "@angular/core";
import {
  TipoSesion,
  TipoSesionRpta,
} from "../data/tipo-sesion.model";
import { TiposSesionRepository } from "../data/tipos-sesion.repository";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class TiposSesionStateService {
  items = signal<TipoSesion[]>([]);
  item = signal<TipoSesion | null>(null);

  readonly itemsListado = computed(() =>
      this.items()
  );

  constructor(
    private TiposSesionRepository: TiposSesionRepository,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  loadItems() {
    this.spinner.show();
    this.TiposSesionRepository.getAll().subscribe({
      next: (data: TipoSesionRpta) => {
        this.items.set(data.datos);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  loadItemById(id: number) {
    this.spinner.show();
    this.TiposSesionRepository.getBydId(id).subscribe({
      next: (data) => {
        this.item.set(data.dato);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }
}
