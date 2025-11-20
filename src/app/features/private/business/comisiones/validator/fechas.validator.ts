import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const fechasValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const fecSuscripcion = group.get('fecSuscripcion')?.value;
    const fecInicio = group.get('fecInicio')?.value;
    const fecFin = group.get('fecFinalizacion')?.value;

    const errors: any = {};

    // Solo validar si ambas fechas existen
    if (fecInicio && fecSuscripcion && new Date(fecInicio) < new Date(fecSuscripcion)) {
        errors.fechaInicioAntesSuscripcion = true;
    }

    if (fecFin && fecInicio && new Date(fecFin) < new Date(fecInicio)) {
        errors.fechaFinAntesInicio = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
};