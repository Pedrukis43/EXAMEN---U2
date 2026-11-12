import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente";

@Entity("direcciones")
export class Direccion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (c) => c.direcciones)
  @JoinColumn({ name: "cliente_id" })
  cliente: Cliente;

  @Column({ type: "enum", enum: ["ORIGEN", "DESTINO"] })
  tipo: string;

  @Column({ length: 150 })
  calle: string;

  @Column({ length: 100 })
  ciudad: string;
}
