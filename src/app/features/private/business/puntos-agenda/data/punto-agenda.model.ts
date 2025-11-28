export interface PuntoAgenda{
  ideAgenda:number;
  ideReunion:number;
  txtAgenda: string;
  txtDetalle: string;
}

export interface PuntoAgendaRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : PuntoAgenda[];
    dato : PuntoAgenda;
}
