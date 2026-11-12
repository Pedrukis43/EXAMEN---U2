import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio";

@Entity("auditoria_envios")
export class AuditoriaEnvio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Envio)
  @JoinColumn({ name: "envio_id" })
  envio: Envio;

  @Column({ name: "costo_anterior", type: "decimal", precision: 10, scale: 2 })
  costoAnterior: string;

  @Column({ name: "costo_nuevo", type: "decimal", precision: 10, scale: 2 })
  costoNuevo: string;

  @Column({ length: 100 })
  usuario: string;

  @Column({ name: "fecha_modificacion", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  fechaModificacion: Date;
}
