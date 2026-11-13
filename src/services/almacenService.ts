import { AppDataSource } from "../data-source";
import { Almacen } from "../entities/Almacen";
import { Paquete } from "../entities/Paquete";

export async function agregarPaquete(almacenId: number, d: any) {
  if (!(await AppDataSource.getRepository(Almacen).existsBy({ id: almacenId }))) return null;
  // El trigger before_insert_paquete_almacen valida la capacidad aqui
  return AppDataSource.getRepository(Paquete).save({
    envio: { id: d.envioId },
    almacen: { id: almacenId },
    peso: d.peso,
    dimensiones: d.dimensiones,
    contenido: d.contenido,
  });
}
