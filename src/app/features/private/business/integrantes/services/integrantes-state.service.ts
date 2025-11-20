import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Integrante, IntegranteRpta } from '../data/integrante.model';
import { IntegrantesRepository } from '../data/integrantes.repository';
import { Observable, Subject } from 'rxjs';
// import { IntegrantesCoordinadorStateService } from '../../Integrantes-coordinador/services/Integrantes-coordinador-state.service';


@Injectable({ providedIn: 'root' })
export class IntegrantesStateService {
    items = signal<Integrante[]>([]);
    item = signal<Integrante | null>(null);

    constructor(
        private IntegrantesRepository: IntegrantesRepository,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        // private IntegrantesCoordinadorStateService: IntegrantesCoordinadorStateService
    ) {
        this.clearState();
    }

    clearState() {
        this.item.set(null);
        this.items.set([]);
    }

    loadItemsByConvenio(ideConvenio:number): Observable<void> {
        //this.items.set([]);
        const subject = new Subject<void>();
        this.spinner.show();
        this.IntegrantesRepository.getAllByConvenio(ideConvenio).subscribe({
            next: (data:IntegranteRpta) => {
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


    loadItems(page: number = 1) {
        this.spinner.show();
        this.IntegrantesRepository.getAll().subscribe({
            next: (data:IntegranteRpta) => {
                this.items.set(data.datos);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    loadItemById(id: number) {
        this.spinner.show();
        this.IntegrantesRepository.getBydId(id).subscribe({
            next: (data) => {
                this.item.set(data.dato);
                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    addItem(item: Integrante, onSuccess?: () => void) {
        this.spinner.show();
        this.IntegrantesRepository.create(item).subscribe({
            next: (data) => {
                //this.loadItems();
                this.toastr.success('Integrante registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el Integrante');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: Integrante, onSuccess?: () => void) {
        this.spinner.show();
        this.IntegrantesRepository.update(id, item).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('Integrante actualizado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al actualizar el Integrante');
                this.spinner.hide();
            }
        });
    }

    postForm(item: Integrante, id?: number, onSuccess?: () => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }

    deleteItem(id: number): Observable<void> {
        this.spinner.show();
        const subject = new Subject<void>();
        this.IntegrantesRepository.delete(id).subscribe({
            next: () => {
                //this.loadItems();
                // this.IntegrantesCoordinadorStateService.emitRefresh();
                this.toastr.success('Integrante eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el Integrante');
                this.spinner.hide();
            }
        });
        return subject.asObservable();
    }
}
