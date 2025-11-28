export interface TipoSesion {
    ideTipoSesion: number;
    txtTipoSesion?: string;
}

export interface TipoSesionRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : TipoSesion[];
    dato : TipoSesion;
}
