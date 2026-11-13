import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cliente } from "./entities/Cliente";
import { Direccion } from "./entities/Direccion";
import { Envio } from "./entities/Envio";
import { Paquete } from "./entities/Paquete";
import { Almacen } from "./entities/Almacen";
import { HistorialRastreo } from "./entities/HistorialRastreo";
import { AuditoriaEnvio } from "./entities/AuditoriaEnvio";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "logiexpress",
  entities: [Cliente, Direccion, Envio, Paquete, Almacen, HistorialRastreo, AuditoriaEnvio],
  synchronize: false,
});
