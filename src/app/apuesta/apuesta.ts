export class Apuesta {
    id: number;
    valor_apostado: number;
    nombre_apostador: string;
    id_competidor: number;
    id_carrera: number;

    constructor(
        id: number,
        valor_apostado: number,
        nombre_apostador: string,
        id_competidor: number,
        id_carrera: number
    ) {
        this.id = id,
            this.valor_apostado = valor_apostado,
            this.nombre_apostador = nombre_apostador,
            this.id_competidor = id_competidor,
            this.id_carrera = id_carrera
    }
}