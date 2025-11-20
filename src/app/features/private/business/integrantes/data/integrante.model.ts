export interface Integrante {
    ideIntegrante?: number;
    ideTabla?: number;
    txtTabla?: string;
    // ideEquipoTrabajo:number
    ideOficina?: number;
    ideColaborador?: number;
    ideCargo?: number;
    txtCargoComite?: string;
    flgInvitado?: boolean;
}

export interface IntegranteRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Integrante[];
    dato : Integrante;
}
