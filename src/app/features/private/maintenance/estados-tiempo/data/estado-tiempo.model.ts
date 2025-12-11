export interface EstadoTiempo {
    ideEstadoTiempo: number;
    txtEstadoTiempo: string;
    txtColor: string;
}

export interface EstadoTiempoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : EstadoTiempo[];
    dato : EstadoTiempo;
}
