import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio";

@Entity("historial_rastreo")
export class HistorialRastreo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Envio, (e) => e.historial)
  @JoinColumn({ name: "envio_id" })
  envio: Envio;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;

  @Column({ name: "ubicacion_actual", length: 150 })
  ubicacionActual: string;

  @Column({
    name: "estado_evento",
    type: "enum",
    enum: ["REGISTRADO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"],
  })
  estadoEvento: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  observaciones: string | null;
}
