import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';

import { TiposDocumentosRepository } from '../data/tipos-documentos.repository';
import { TipoDocumento, TipoDocumentoRpta } from '../data/tipo-documento.model';


@Injectable({ providedIn: 'root' })
export class TiposDocumentosStateService {
    items = signal<TipoDocumento[]>([]);
    item = signal<TipoDocumento | null>(null);
    // totalItems = signal<number>(1);
    // currentPage = signal<number>(1);
    // pageSize = signal<number>(5);

    constructor(
        private tiposDocumentosRepository: TiposDocumentosRepository,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
    ) {}

    loadItems() {
        this.spinner.show();
        this.tiposDocumentosRepository.getAll().subscribe({
            next: (data:TipoDocumentoRpta) => {
                this.items.set(data.datos);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    loadItemById(id: number) {
        this.spinner.show();
        this.tiposDocumentosRepository.getBydId(id).subscribe({
            next: (data) => {
                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: TipoDocumento, onSuccess?: () => void) {
        this.spinner.show();
        this.tiposDocumentosRepository.create(item).subscribe({
            next: (data) => {
                this.loadItems();
                this.toastr.success('Modalidad Convenio registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Modalidad Convenio');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: TipoDocumento, onSuccess?: () => void) {
        this.spinner.show();
        this.tiposDocumentosRepository.update(id, item).subscribe({
            next: () => {
                this.loadItems();
                this.toastr.success('Modalidad Convenio actualizado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al actualizar el Modalidad Convenio');
                this.spinner.hide();
            }
        });
    }

    postForm(item: TipoDocumento, id?: number, onSuccess?: () => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number) {
        this.spinner.show();
        this.tiposDocumentosRepository.delete(id).subscribe({
            next: () => {
                this.loadItems();
                this.toastr.success('Modalidad Convenio eliminado correctamente');
                this.spinner.hide();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Modalidad Convenio');
                this.spinner.hide();
            }
        });
    }
}