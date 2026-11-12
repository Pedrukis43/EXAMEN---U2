import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Paquete } from "./Paquete";

@Entity("almacenes")
export class Almacen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  ubicacion: string;

  @Column({ name: "capacidad_maxima", type: "int" })
  capacidadMaxima: number;

  @OneToMany(() => Paquete, (p) => p.almacen)
  paquetes: Paquete[];
}
