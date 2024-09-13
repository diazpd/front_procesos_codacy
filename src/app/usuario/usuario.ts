export class Usuario {
    public id: number;
    public nombre: string;
    usuario: string;
    numero_tarjeta: string;
    albumes: Array<any>;
    saldo:number;


    constructor(
        id: number,
        nombre: string,
        usuario: string,
        numero_tarjeta: string,
        saldo: number,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.usuario = usuario;
        this.numero_tarjeta = numero_tarjeta;
        this.saldo = saldo;
    }
}

export class Transaccion {

    id: number;
    tipo: string;
    monto: number;
    fecha: Date;
    usuario: string;

    constructor(
        id: number,
        tipo: string,
        monto: number,
        fecha: Date,
        usuario: string
    ) {
        this.id = id,
        this.tipo = tipo,
        this.monto = monto,
        this.fecha = fecha,
        this.usuario = usuario
    }
}
