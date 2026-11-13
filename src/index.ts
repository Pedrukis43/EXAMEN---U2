import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import * as envio from "./controllers/envioController";
import * as almacen from "./controllers/almacenController";
import * as cliente from "./controllers/clienteController";

const app = express();
app.use(express.json());

app.post("/api/envios", envio.crear);
app.put("/api/envios/:id/costo", envio.actualizarCosto);
app.post("/api/almacenes/:id/paquetes", almacen.agregarPaquete);
app.post("/api/envios/:id/rastreo", envio.agregarRastreo);
app.get("/api/envios", envio.listarActivos);
app.get("/api/clientes/:id/envios", cliente.enviosDeCliente);

AppDataSource.initialize().then(() => app.listen(3000));
