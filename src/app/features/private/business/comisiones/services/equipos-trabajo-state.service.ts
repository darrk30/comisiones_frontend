import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { EquipoTrabajo, EquipoTrabajoRpta } from '../data/equipo-trabajo.model';
import { EquiposTrabajoRepository } from '../data/equipos-trabajo.repository';

@Injectable({ providedIn: 'root' })
export class EquiposTrabajoStateService {
    items = signal<EquipoTrabajo[]>([]);
    item = signal<EquipoTrabajo | null>(null);

    constructor(
        private equiposTrabajoRepository: EquiposTrabajoRepository,
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
        this.equiposTrabajoRepository.getAll().subscribe({
            next: (data:EquipoTrabajoRpta) => {
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
        this.equiposTrabajoRepository.getBydId(id).subscribe({
            next: (data) => {
                console.log('data:',data);

                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: EquipoTrabajo, onSuccess?: () => void) {
        this.spinner.show();
        this.equiposTrabajoRepository.create(item).subscribe({
            next: (data:EquipoTrabajoRpta) => {
                //this.loadItems();
                console.log(data)
                this.router.navigate([`negocio/comision/editar/${data.dato.ideEquipoTrabajo}`]);
                this.toastr.success('Equipo de Trabajo registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el EquipoTrabajo');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: EquipoTrabajo, onSuccess?: (updated?: EquipoTrabajo) => void) {
        this.spinner.show();
        this.equiposTrabajoRepository.update(id, item).subscribe({
            next: (updated: EquipoTrabajoRpta) => {
                //this.loadItems();

                this.toastr.success('EquipoTrabajo actualizado correctamente');
                this.spinner.hide();

                this.loadItemById(id);

                if (onSuccess) onSuccess(updated.dato);
            },
            error: () => {
                this.toastr.error('Error al actualizar el EquipoTrabajo');
                this.spinner.hide();
            }
        });
    }

    postForm(item: EquipoTrabajo, id?: number, onSuccess?: (updated?: EquipoTrabajo) => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number): Observable<void> {
        this.spinner.show();
        const subject = new Subject<void>();
        this.equiposTrabajoRepository.delete(id).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('EquipoTrabajo eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el EquipoTrabajo');
                this.spinner.hide();
            }
        });

        return subject.asObservable();
    }

}
