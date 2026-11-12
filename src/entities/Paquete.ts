import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio";
import { Almacen } from "./Almacen";

@Entity("paquetes")
export class Paquete {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Envio, (e) => e.paquetes)
  @JoinColumn({ name: "envio_id" })
  envio: Envio;

  @ManyToOne(() => Almacen, (a) => a.paquetes, { nullable: true })
  @JoinColumn({ name: "almacen_id" })
  almacen: Almacen | null;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  peso: string;

  @Column({ length: 50 })
  dimensiones: string;

  @Column({ length: 200 })
  contenido: string;
}
