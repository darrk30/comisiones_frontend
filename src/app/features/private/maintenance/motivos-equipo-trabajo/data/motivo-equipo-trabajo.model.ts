export interface MotivoEquipoTrabajo {
    ideMotivoEquipoTrabajo: number;
    txtMotivoEquipoTrabajo?: string;
}

export interface MotivoEquipoTrabajoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : MotivoEquipoTrabajo[];
    dato : MotivoEquipoTrabajo;
}
