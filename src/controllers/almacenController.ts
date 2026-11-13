import { Request, Response } from "express";
import * as svc from "../services/almacenService";

export async function agregarPaquete(req: Request, res: Response) {
  try {
    const p = await svc.agregarPaquete(Number(req.params.id), req.body);
    if (!p) return res.status(404).json({ error: "Almacen no encontrado" });
    res.status(201).json(p);
  } catch (e: any) {
    // SQLSTATE 45000 = SIGNAL lanzado por el trigger de capacidad
    if ((e.driverError?.sqlState ?? e.sqlState) === "45000") {
      return res.status(400).json({ error: e.driverError?.sqlMessage ?? e.message });
    }
    throw e;
  }
}
