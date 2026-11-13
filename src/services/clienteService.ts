import { AppDataSource } from "../data-source";
import { Envio } from "../entities/Envio";

export function enviosDeCliente(id: number) {
  return AppDataSource.getRepository(Envio).find({
    where: [{ remitente: { id } }, { destinatario: { id } }],
    relations: { paquetes: true, historial: true },
    order: { fecha: "DESC" },
  });
}
