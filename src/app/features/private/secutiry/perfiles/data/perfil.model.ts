export interface Perfil {
    idePerfil: number;
    perfil?: string;
    codigoPerfil?: string;
}

export interface PerfilRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Perfil[];
    dato : Perfil;
}

export enum Rol{
    Administrador = 'COMISION_ROL_ADMINISTRADOR',
    // Coordinador = 'CONVENIOS_ROL_COORDINADOR',
    // Supervisor = 'CONVENIOS_ROL_SUPERVISOR'
}
