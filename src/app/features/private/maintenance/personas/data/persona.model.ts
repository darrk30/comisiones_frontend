export interface Persona {
    idePersona
}

export interface PersonaRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Persona[];
    dato : Persona;
}