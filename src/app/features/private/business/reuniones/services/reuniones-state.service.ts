import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Reunion, ReunionRpta } from '../data/reunion.model';
import { ReunionesRepository } from '../data/reuniones.repository';

@Injectable({ providedIn: 'root' })
export class ReunionesStateService {
    items = signal<Reunion[]>([]);
    item = signal<Reunion | null>(null);

    constructor(
        private reunionesRepository: ReunionesRepository,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private paginationService: PaginationService,
        private router : Router
    ) {
        this.clearState();
    }

    clearState() {
        this.item.set(null);
        this.items.set([]);
    }

    loadItems(): Observable<void> {
        const subject = new Subject<void>();
        this.spinner.show();
        this.reunionesRepository.getAll().subscribe({
            next: (data:ReunionRpta) => {
                this.items.set(data.datos);
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.spinner.hide();
                subject.error('Error');
            },
        });

        return subject.asObservable();
    }

    loadItemById(id: number) {
      console.log("id:",id);

        this.spinner.show();
        this.reunionesRepository.getBydId(id).subscribe({
            next: (data) => {
                console.log('data:',data);

                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: Reunion, onSuccess?: () => void) {
        this.spinner.show();
        this.reunionesRepository.create(item).subscribe({
            next: (data:ReunionRpta) => {
                //this.loadItems();
                console.log(data)
                this.router.navigate([`negocio/comision/editar/${data.dato.ideReunion}`]);
                this.toastr.success('Equipo de Trabajo registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Reunion');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Reunion, onSuccess?: (updated?: Reunion) => void) {
        this.spinner.show();
        this.reunionesRepository.update(id, item).subscribe({
            next: (updated: ReunionRpta) => {
                //this.loadItems();

                this.toastr.success('Reunion actualizado correctamente');
                this.spinner.hide();

                this.loadItemById(id);

                if (onSuccess) onSuccess(updated.dato);
            },
            error: () => {
                this.toastr.error('Error al actualizar el Reunion');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Reunion, id?: number, onSuccess?: (updated?: Reunion) => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number): Observable<void> {
        this.spinner.show();
        const subject = new Subject<void>();
        this.reunionesRepository.delete(id).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('Reunion eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Reunion');
                this.spinner.hide();
            }
        });

        return subject.asObservable();
    }

}
