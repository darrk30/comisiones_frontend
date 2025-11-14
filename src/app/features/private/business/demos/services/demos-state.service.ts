import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { DemosRepository } from '../data/demos.repository';
import { Demo, DemoRpta } from '../data/demo.model';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DemosStateService {
    items = signal<Demo[]>([]);
    item = signal<Demo | null>(null);
    

    constructor(
        private entidadRepository: DemosRepository,
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
        this.entidadRepository.getAll().subscribe({
            next: (data:DemoRpta) => {
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
        this.spinner.show();
        this.entidadRepository.getBydId(id).subscribe({
            next: (data) => {
                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: Demo, onSuccess?: () => void) {
        this.spinner.show();
        this.entidadRepository.create(item).subscribe({
            next: (data:DemoRpta) => {
                //this.loadItems();
                console.log(data)
                //this.router.navigate([`negocio/Demo/editar/${data.dato.ideDemo}`]);
                this.toastr.success('Demo registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Demo');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Demo, onSuccess?: () => void) {
        this.spinner.show();
        this.entidadRepository.update(id, item).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('Demo actualizado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al actualizar el Demo');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Demo, id?: number, onSuccess?: () => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number): Observable<void> {
        this.spinner.show();
        const subject = new Subject<void>();
        this.entidadRepository.delete(id).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('Demo eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Demo');
                this.spinner.hide();
            }
        });

        return subject.asObservable();
    }

}