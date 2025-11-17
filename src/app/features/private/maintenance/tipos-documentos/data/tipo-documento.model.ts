export interface TipoDocumento {
    ideTipoDocumento: number;
    txtTipoDocumento?: string;
    txtCodigoTipoDocumento?: string;
}

export interface TipoDocumentoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : TipoDocumento[];
    dato : TipoDocumento;
}