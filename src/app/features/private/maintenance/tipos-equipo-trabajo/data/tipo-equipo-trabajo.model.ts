export interface TipoEquipoTrabajo {
    ideTipoEquipoTrabajo: number;
    txtTipoEquipoTrabajo?: string;
}

export interface TipoEquipoTrabajoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : TipoEquipoTrabajo[];
    dato : TipoEquipoTrabajo;
}
