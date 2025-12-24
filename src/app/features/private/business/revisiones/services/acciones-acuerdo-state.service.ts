import { Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Router } from '@angular/router';
import { finalize, Observable, Subject, switchMap, tap } from 'rxjs';
import { AccionAcuerdo, AccionAcuerdoRpta } from '../data/accion-acuerdo.model';
import { AccionesAcuerdoRepository } from '../data/acciones-acuerdo.repository';
import { Acuerdo, AcuerdoRpta } from '../../acuerdos/data/acuerdo.model';



@Injectable({ providedIn: 'root' })
export class AccionesAcuerdoStateService {
    items = signal<AccionAcuerdo[]>([]);
    item = signal<AccionAcuerdo | null>(null);

    constructor(
        private accionAcuerdoRepository: AccionesAcuerdoRepository,
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
        this.accionAcuerdoRepository.getAll().subscribe({
            next: (data:AccionAcuerdoRpta) => {
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
        this.accionAcuerdoRepository.getById(id).subscribe({
            next: (data) => {
                console.log('data:',data);

                this.item.set(data.dato);

                this.spinner.hide();
            },
            error: () => this.spinner.hide(),
        });
    }

    loadItemByIdeAcuerdo(ideAcuerdo: number): Observable<void> {
      console.log("id: ",ideAcuerdo);

        this.spinner.show();
        const subject = new Subject<void>();

        this.accionAcuerdoRepository.getByIdeAcuerdo(ideAcuerdo).subscribe({
            next: (data) => {
                // console.log('data:',data);

          //  this.archivosRepository.getAllByIdeTabla(ideTabla,txtTabla).subscribe({
          //             next: (data:ArchivoRpta) => {
          //                 this.items.set(data.datos);
          //                 this.spinner.hide();
          //                 subject.next();
          //                 subject.complete();
          //             },
          //             error: () => {
          //                 this.spinner.hide();
          //                 subject.error('Error');
          //             },
          //         });


                this.item.set(data.dato);
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () =>{
              // this.toastr.error('Error al eliminar el AccionAcuerdo');
              this.spinner.hide()

            }
        });

        return subject.asObservable();
    }

    addItem(item: AccionAcuerdo, onSuccess?: () => void) {
        this.spinner.show();
        this.accionAcuerdoRepository.create(item).subscribe({
            next: (data:AccionAcuerdoRpta) => {
                //this.loadItems();
                console.log(data)
                // this.router.navigate([`negocio/comision/editar/${data.dato.ideAcuerdoAccion}`]);
                // this.router.navigate([`negocio/revision/${data.dato.ideAcuerdoAccion}`]);
                // this.router.navigate([`negocio/revision`]);

                this.toastr.success('Accion de Acuerdo registrado correctamente');
                this.spinner.hide();
                if (onSuccess) onSuccess();
            },
            error: () => {
                this.toastr.error('Error al registrar el AccionAcuerdo');
                this.spinner.hide();
            }
        });
    }

    updateItem(id: number, item: AccionAcuerdo, onSuccess?: (updated?: AccionAcuerdo) => void) {
        this.spinner.show();
        this.accionAcuerdoRepository.update(id, item).subscribe({
            next: (updated: AccionAcuerdoRpta) => {
                //this.loadItems();

                this.toastr.success('Accion de Acuerdo actualizado correctamente');
                this.spinner.hide();

                this.loadItemById(id);

                if (onSuccess) onSuccess(updated.dato);
            },
            error: () => {
                this.toastr.error('Error al actualizar la Accion de Acuerdo');
                this.spinner.hide();
            }
        });
    }

    postForm(item: AccionAcuerdo, id?: number, onSuccess?: (updated?: AccionAcuerdo) => void){
        if(id){
            this.updateItem(id, item, onSuccess)
        }else{
            this.addItem(item, onSuccess)
        }
    }


    deleteItemByAcuerdo(idAcuerdo: number): Observable<AcuerdoRpta> {
  this.spinner.show();

  return this.accionAcuerdoRepository
    .deleteByAcuerdo(idAcuerdo)
    .pipe(
      tap(() => {
        this.toastr.success('Acción del Acuerdo eliminada correctamente');
      }),
      finalize(() => this.spinner.hide())
    );
    }

    deleteItem(id: number): Observable<void> {
        this.spinner.show();
        const subject = new Subject<void>();

        this.accionAcuerdoRepository.delete(id).subscribe({
            next: () => {
                //this.loadItems();
                this.toastr.success('AccionAcuerdo eliminado correctamente');
                this.spinner.hide();
                subject.next();
                subject.complete();
            },
            error: () => {
                this.toastr.error('Error al eliminar el AccionAcuerdo');
                this.spinner.hide();
            }
        });

        return subject.asObservable();
    }

}
