import { Request, Response } from "express";
import * as svc from "../services/envioService";

export async function crear(req: Request, res: Response) {
  res.status(201).json(await svc.crearEnvio(req.body));
}

export async function actualizarCosto(req: Request, res: Response) {
  const envio = await svc.actualizarCosto(Number(req.params.id), req.body.costoTotal);
  if (!envio) return res.status(404).json({ error: "Envio no encontrado" });
  res.json(envio);
}

export async function agregarRastreo(req: Request, res: Response) {
  const r = await svc.agregarRastreo(Number(req.params.id), req.body);
  if (!r) return res.status(404).json({ error: "Envio no encontrado" });
  res.status(201).json(r);
}

export async function listarActivos(_req: Request, res: Response) {
  res.json(await svc.enviosActivos());
}
