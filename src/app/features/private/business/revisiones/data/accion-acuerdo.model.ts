
export interface AccionAcuerdo{

}

export interface AccionAcuerdoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : AccionAcuerdo[];
    dato : AccionAcuerdo;
}
