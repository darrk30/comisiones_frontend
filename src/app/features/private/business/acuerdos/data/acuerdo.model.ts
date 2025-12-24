export interface Acuerdo {
    ideAcuerdo: number;
    ideReunion: number | null;
    txtAcuerdo: string | null;
    ideOficina: number | null;
    ideIntegrante: number | null;
    fecLimitePresentacion: string | null;
    flgTarea: boolean | null;
    txtEquipoTrabajo?:string
    txtCodigoActaReunion?:string
    txtAnio?:string
    txtSigla?:string
    estadoTiempo?: any
    estadoAtencion: string
    // txtActaReunion?:string
}

export interface AcuerdosFiltro {
  ideEquipoTrabajo: number;
  ideReunion?: number;
  txtTemaReunion?: string;
  ideEstadoTiempo?: number;
}

export interface AcuerdoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Acuerdo[];
    dato : Acuerdo;
}
