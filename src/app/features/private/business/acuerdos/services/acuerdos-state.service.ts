import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Acuerdo, AcuerdoRpta } from '../data/acuerdo.modal';
import { AcuerdosRepository } from '../data/acuerdos.repository';

@Injectable({ providedIn: 'root' })
export class AcuerdosStateService {
    items = signal<Acuerdo[]>([]);
    item = signal<Acuerdo | null>(null);

    constructor(
        private reunionesRepository: AcuerdosRepository,
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
            next: (data:AcuerdoRpta) => {
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

    loadItemsByFilter(ideEquipoTrabajo,ideReunion,txtTemaReunion ,ideEstadoTiempo): Observable<void> {
        const subject = new Subject<void>();
        this.spinner.show();
        this.reunionesRepository.getAllByFilter(ideEquipoTrabajo, ideReunion, txtTemaReunion,ideEstadoTiempo).subscribe({
            next: (data:AcuerdoRpta) => {
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

    addItem(item: Acuerdo, onSuccess?: () => void) {
        this.spinner.show();
        this.reunionesRepository.create(item).subscribe({
            next: (data:AcuerdoRpta) => {
                //this.loadItems();
                console.log(data)
                this.router.navigate([`negocio/reunion/editar/${data.dato.ideAcuerdo}`]);
                this.toastr.success('Acuerdo registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Acuerdo');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Acuerdo, onSuccess?: (updated?: Acuerdo) => void) {
        this.spinner.show();
        this.reunionesRepository.update(id, item).subscribe({
            next: (updated: AcuerdoRpta) => {
                //this.loadItems();

                this.toastr.success('Acuerdo actualizado correctamente');
                this.spinner.hide();

                this.loadItemById(id);

                if (onSuccess) onSuccess(updated.dato);
            },
            error: () => {
                this.toastr.error('Error al actualizar el Acuerdo');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Acuerdo, id?: number, onSuccess?: (updated?: Acuerdo) => void){
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
                this.toastr.success('Acuerdo eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Acuerdo');
                this.spinner.hide();
            }
        });

        return subject.asObservable();
    }

}
