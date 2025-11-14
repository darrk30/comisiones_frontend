export interface Demo {
    ideDemo?:number;
    demo?:string;
}

export interface DemoRpta {
    respuesta: number;
    mensaje: string;
    exitoso:boolean;
    total: number;
    datos : Demo[];
    dato : Demo;
}