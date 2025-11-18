export interface EstadoTrazabilidad {
    ideEstadoTrazabilidad: number;
    txtCodigoEstadoTrazabilidad: string;
    txtEstadoTrazabilidad?: string;
}

export interface EstadoTrazabilidadRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : EstadoTrazabilidad[];
    dato : EstadoTrazabilidad;
}
