export interface EstadoComision {
    ideEstadoComision: number;
    txtCodigoEstadoComision: string;
    txtEstadoComision?: string;
}

export interface EstadoComisionRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : EstadoComision[];
    dato : EstadoComision;
}
