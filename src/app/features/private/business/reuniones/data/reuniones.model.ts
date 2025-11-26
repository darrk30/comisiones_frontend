export interface Reunion {
    ideReunion: number;
    ideEquipoTrabajo: number;
    ideTipoSesion: number;
    fecReunion: string;
    txtCodigoActaReunion: string;
    txtAnio: string;
    txtTemaReunion: string;
    participantes:any
    puntosAgenda:any
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
