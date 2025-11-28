export interface Reunion {
    ideReunion?: number;
    ideEquipoTrabajo: number;
    ideTipoSesion: number;
    fecReunion: string;
    txtCodigoActaReunion: string;
    txtAnio: string;
    txtTemaReunion: string;
    integrantes:any
    agendas:any
    acuerdos:any
    // tareas:any
}

export interface ReunionRpta{
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Reunion[];
    dato : Reunion;
}
