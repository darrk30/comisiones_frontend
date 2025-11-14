export interface Archivo {
    ideArchivo?:number;
    ideConvenio?:number;
    ideTipoDocumento?:number;
    archivo?:string;
    archivoRuta?:string;
}

export interface ArchivoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Archivo[];
    dato : Archivo;
}