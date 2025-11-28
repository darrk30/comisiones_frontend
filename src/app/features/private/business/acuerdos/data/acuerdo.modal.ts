export interface Acuerdo {
    ideAcuerdo: number;
    ideReunion: number | null;
    txtAcuerdo: string | null;
    ideOficina: number | null;
    ideIntegrante: number | null;
    fecLimitePresentacion: string | null;
    flgTarea: boolean | null;
}

export interface AcuerdoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Acuerdo[];
    dato : Acuerdo;
}
