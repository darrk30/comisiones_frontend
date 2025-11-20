export interface EquipoTrabajo {
    ideEquipoTrabajo: number;
    txtEquipoTrabajo: string;
    ideMotivoEquipoTrabajo: number;
    ideTipoEquipoTrabajo: number;
    ideEstadoTrazabilidad: number;
    txtObjetivosEquipoTrabajo: string;
    fecSuscripcion: string;
    fecInicio: string;
    fecFinalizacion: string;
    fecInicioRenovacion: string;
    fecFinRenovacion: string;
    // txtArchivo: string;
    txtArchivoRuta: string;
    txtDuracionComite: string;
    txtObservacion: string;
    uuid: string;
    tipoEquipoTrabajo:any
}

export interface EquipoTrabajoRpta{
     respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : EquipoTrabajo[];
    dato : EquipoTrabajo;
}
