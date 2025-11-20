import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Oficina, OficinaRpta } from '../data/oficina.model';
import { OficinasRepository } from '../data/oficinas.repository';


@Injectable({ providedIn: 'root' })
export class OficinasStateService {
    items = signal<Oficina[]>([]);
    item = signal<Oficina | null>(null);
    // totalItems = signal<number>(1);
    // currentPage = signal<number>(1);
    // pageSize = signal<number>(5);

    constructor(
        private oficinasRepository: OficinasRepository,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private paginationService: PaginationService
    ) {}

    loadItems(page: number = 1) {
        this.spinner.show();
        this.oficinasRepository.getAll().subscribe({
            next: (data:OficinaRpta) => {
                this.items.set(data.datos);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    loadItemById(id: number) {
        this.spinner.show();
        this.oficinasRepository.getBydId(id).subscribe({
            next: (data) => {
                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: Oficina, onSuccess?: () => void) {
        this.spinner.show();
        this.oficinasRepository.create(item).subscribe({
            next: (data) => {
                this.loadItems();
                this.toastr.success('Oficina registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Oficina');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Oficina, onSuccess?: () => void) {
        this.spinner.show();
        this.oficinasRepository.update(id, item).subscribe({
            next: () => {
                this.loadItems();
                this.toastr.success('Oficina actualizado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al actualizar el Oficina');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Oficina, id?: number, onSuccess?: () => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number) {
        this.spinner.show();
        this.oficinasRepository.delete(id).subscribe({
            next: () => {
                this.loadItems();
                this.toastr.success('Oficina eliminado correctamente');
                this.spinner.hide();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Oficina');
                this.spinner.hide();
            }
        });
    }
}
