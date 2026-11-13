import { AppDataSource } from "../data-source";
import { Envio } from "../entities/Envio";
import { Paquete } from "../entities/Paquete";
import { HistorialRastreo } from "../entities/HistorialRastreo";

const envios = () => AppDataSource.getRepository(Envio);

export async function crearEnvio(d: any) {
  const qr = AppDataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();
  try {
    const envio = await qr.manager.save(Envio, {
      remitente: { id: d.remitenteId },
      destinatario: { id: d.destinatarioId },
      direccionOrigen: { id: d.direccionOrigenId },
      direccionDestino: { id: d.direccionDestinoId },
      costoTotal: d.costoTotal,
    });
    for (const p of d.paquetes ?? []) {
      await qr.manager.save(Paquete, { ...p, envio: { id: envio.id } });
    }
    await qr.commitTransaction();
    return envios().findOne({ where: { id: envio.id }, relations: { paquetes: true } });
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }
}

export async function actualizarCosto(id: number, costoTotal: string) {
  const r = await envios().update(id, { costoTotal });
  if (!r.affected) return null;
  return envios().findOneBy({ id });
}

export async function agregarRastreo(id: number, d: any) {
  if (!(await envios().existsBy({ id }))) return null;
  return AppDataSource.getRepository(HistorialRastreo).save({
    envio: { id },
    ubicacionActual: d.ubicacionActual,
    estadoEvento: d.estadoEvento,
    observaciones: d.observaciones,
  });
}

export function enviosActivos() {
  return envios()
    .createQueryBuilder("e")
    .leftJoinAndSelect("e.remitente", "remitente")
    .leftJoinAndSelect("e.destinatario", "destinatario")
    .leftJoinAndSelect("e.paquetes", "paquetes")
    .where("e.estado IN (:...estados)", { estados: ["REGISTRADO", "EN_TRANSITO"] })
    .getMany();
}
