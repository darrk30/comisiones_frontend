export interface Oficina {
    ideOficina
}

export interface OficinaRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Oficina[];
    dato : Oficina;
}