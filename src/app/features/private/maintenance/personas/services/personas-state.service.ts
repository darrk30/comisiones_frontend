import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';

import { PersonasRepository } from '../data/personas.repository';
import { Persona, PersonaRpta } from '../data/persona.model';


@Injectable({ providedIn: 'root' })
export class PersonasStateService {
    items = signal<Persona[]>([]);
    item = signal<Persona | null>(null);
    // totalItems = signal<number>(1);
    // currentPage = signal<number>(1);
    // pageSize = signal<number>(5);

    constructor(
        private personasRepository: PersonasRepository,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private paginationService: PaginationService
    ) {}

    loadItemsByOficina(ideOficina:number) {
        this.spinner.show();
        this.personasRepository.getAllByIdeOficina(ideOficina).subscribe({
            next: (data:PersonaRpta) => {
                this.items.set(data.datos);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    loadItems() {
        this.spinner.show();
        this.personasRepository.getAll().subscribe({
            next: (data:PersonaRpta) => {
                this.items.set(data.datos);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    loadItemById(id: number) {
        this.spinner.show();
        this.personasRepository.getBydId(id).subscribe({
            next: (data) => {
                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: Persona, onSuccess?: () => void) {
        this.spinner.show();
        this.personasRepository.create(item).subscribe({
            next: (data) => {
                this.loadItems();
                this.toastr.success('Persona registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Persona');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Persona, onSuccess?: () => void) {
        this.spinner.show();
        this.personasRepository.update(id, item).subscribe({
            next: () => {
                this.loadItems();
                this.toastr.success('Persona actualizado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al actualizar el Persona');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Persona, id?: number, onSuccess?: () => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number) {
        this.spinner.show();
        this.personasRepository.delete(id).subscribe({
            next: () => {
                this.loadItems();
                this.toastr.success('Persona eliminado correctamente');
                this.spinner.hide();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Persona');
                this.spinner.hide();
            }
        });
    }
}
