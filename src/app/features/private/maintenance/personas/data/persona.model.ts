export interface Persona {
    idePersona,
    txtApellidos,
    txtNombres,
    txtCargo
}

export interface PersonaRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Persona[];
    dato : Persona;
}
