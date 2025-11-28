export interface Oficina {
    ideOficina,
    txtOficina
}

export interface OficinaRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Oficina[];
    dato : Oficina;
}
