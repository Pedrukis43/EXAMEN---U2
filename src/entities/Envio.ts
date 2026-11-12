import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Direccion } from "./Direccion";
import { Paquete } from "./Paquete";
import { HistorialRastreo } from "./HistorialRastreo";

@Entity("envios")
export class Envio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (c) => c.envios)
  @JoinColumn({ name: "remitente_id" })
  remitente: Cliente;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: "destinatario_id" })
  destinatario: Cliente;

  @ManyToOne(() => Direccion)
  @JoinColumn({ name: "direccion_origen_id" })
  direccionOrigen: Direccion;

  @ManyToOne(() => Direccion)
  @JoinColumn({ name: "direccion_destino_id" })
  direccionDestino: Direccion;

  @Column({ name: "costo_total", type: "decimal", precision: 10, scale: 2 })
  costoTotal: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;

  @Column({
    type: "enum",
    enum: ["REGISTRADO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"],
    default: "REGISTRADO",
  })
  estado: string;

  @OneToMany(() => Paquete, (p) => p.envio)
  paquetes: Paquete[];

  @OneToMany(() => HistorialRastreo, (h) => h.envio)
  historial: HistorialRastreo[];
}
