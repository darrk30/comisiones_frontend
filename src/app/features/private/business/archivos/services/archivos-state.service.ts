import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { ArchivosRepository } from '../data/archivos.repository';
import { Archivo, ArchivoRpta } from '../data/archivo.model';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArchivosStateService {
    items = signal<Archivo[]>([]);
    item = signal<Archivo | null>(null);


    constructor(
        private archivosRepository: ArchivosRepository,
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

    loadItemsByEquipoTrabajo(ideEquipoTrabajo:number): Observable<void> {
        const subject = new Subject<void>();
        this.spinner.show();
        this.archivosRepository.getAllByEquipoTrabajo(ideEquipoTrabajo).subscribe({
            next: (data:ArchivoRpta) => {
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

    loadItems(): Observable<void> {
        const subject = new Subject<void>();
        this.spinner.show();
        this.archivosRepository.getAll().subscribe({
            next: (data:ArchivoRpta) => {
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
        this.archivosRepository.getBydId(id).subscribe({
            next: (data) => {
                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: Archivo, onSuccess?: () => void) {
        this.spinner.show();
        this.archivosRepository.create(item).subscribe({
            next: (data:ArchivoRpta) => {
                //this.loadItems();
                console.log(data)
                //this.router.navigate([`negocio/Archivo/editar/${data.dato.ideArchivo}`]);
                this.toastr.success('Archivo registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Archivo');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Archivo, onSuccess?: () => void) {
        this.spinner.show();
        this.archivosRepository.update(id, item).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('Archivo actualizado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al actualizar el Archivo');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Archivo, id?: number, onSuccess?: () => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number): Observable<void> {
        this.spinner.show();
        const subject = new Subject<void>();
        this.archivosRepository.delete(id).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('Archivo eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Archivo');
                this.spinner.hide();
            }
        });

        return subject.asObservable();
    }

}
