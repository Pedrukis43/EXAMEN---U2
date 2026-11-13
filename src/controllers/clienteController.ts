import { Request, Response } from "express";
import * as svc from "../services/clienteService";

export async function enviosDeCliente(req: Request, res: Response) {
  res.json(await svc.enviosDeCliente(Number(req.params.id)));
}
