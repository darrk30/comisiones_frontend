export interface Archivo {
    ideArchivo?:number;
    ideConvenio?:number;
    ideTipoDocumento?:number;
    txtArchivo?:string;
    txtArchivoRuta?:string;
    archivo?: File;
    uuid?: string;
}

export interface ArchivoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Archivo[];
    dato : Archivo;
}
