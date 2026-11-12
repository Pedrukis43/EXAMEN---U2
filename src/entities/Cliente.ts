import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Direccion } from "./Direccion";
import { Envio } from "./Envio";

@Entity("clientes")
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: "enum", enum: ["ACTIVO", "INACTIVO"], default: "ACTIVO" })
  estado: string;

  @Column({ name: "limite_credito", type: "decimal", precision: 12, scale: 2, default: 0 })
  limiteCredito: string;

  @OneToMany(() => Direccion, (d) => d.cliente)
  direcciones: Direccion[];

  @OneToMany(() => Envio, (e) => e.remitente)
  envios: Envio[];
}
