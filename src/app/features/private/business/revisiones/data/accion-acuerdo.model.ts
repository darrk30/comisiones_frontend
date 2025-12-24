
export interface AccionAcuerdo{
  ideAcuerdoAccion: number
  ideAcuerdo: number
  txtAccionRealizada: number
  base64: string
  txtArchivo: string
  archivo?: any
}

export interface AccionAcuerdoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : AccionAcuerdo[];
    dato : AccionAcuerdo;
}
