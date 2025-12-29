export interface Persona {
    idePersona,
    txtApellidos,
    txtNombres,
    txtCargo,
    txtOficina,
    txtEmailItp?

}

export interface PersonaRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Persona[];
    dato : Persona;
}
