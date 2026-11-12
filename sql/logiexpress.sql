CREATE DATABASE IF NOT EXISTS logiexpress;
USE logiexpress;

-- ===================== DDL (3FN) =====================

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  limite_credito DECIMAL(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  tipo ENUM('ORIGEN','DESTINO') NOT NULL,
  calle VARCHAR(150) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE almacenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(150) NOT NULL,
  capacidad_maxima INT NOT NULL
);

CREATE TABLE envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  remitente_id INT NOT NULL,
  destinatario_id INT NOT NULL,
  direccion_origen_id INT NOT NULL,
  direccion_destino_id INT NOT NULL,
  costo_total DECIMAL(10,2) NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('REGISTRADO','EN_TRANSITO','ENTREGADO','CANCELADO') NOT NULL DEFAULT 'REGISTRADO',
  FOREIGN KEY (remitente_id) REFERENCES clientes(id),
  FOREIGN KEY (destinatario_id) REFERENCES clientes(id),
  FOREIGN KEY (direccion_origen_id) REFERENCES direcciones(id),
  FOREIGN KEY (direccion_destino_id) REFERENCES direcciones(id)
);

CREATE TABLE paquetes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  envio_id INT NOT NULL,
  almacen_id INT NULL,
  peso DECIMAL(8,2) NOT NULL,
  dimensiones VARCHAR(50) NOT NULL,
  contenido VARCHAR(200) NOT NULL,
  FOREIGN KEY (envio_id) REFERENCES envios(id),
  FOREIGN KEY (almacen_id) REFERENCES almacenes(id)
);

CREATE TABLE historial_rastreo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  envio_id INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ubicacion_actual VARCHAR(150) NOT NULL,
  estado_evento ENUM('REGISTRADO','EN_TRANSITO','ENTREGADO','CANCELADO') NOT NULL,
  observaciones VARCHAR(255) NULL,
  FOREIGN KEY (envio_id) REFERENCES envios(id)
);

CREATE TABLE auditoria_envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  envio_id INT NOT NULL,
  costo_anterior DECIMAL(10,2) NOT NULL,
  costo_nuevo DECIMAL(10,2) NOT NULL,
  usuario VARCHAR(100) NOT NULL,
  fecha_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (envio_id) REFERENCES envios(id)
);

-- ===================== TRIGGERS =====================

DELIMITER $$

CREATE TRIGGER before_insert_paquete_almacen
BEFORE INSERT ON paquetes
FOR EACH ROW
BEGIN
  IF NEW.almacen_id IS NOT NULL THEN
    IF (SELECT COUNT(*) FROM paquetes WHERE almacen_id = NEW.almacen_id)
       >= (SELECT capacidad_maxima FROM almacenes WHERE id = NEW.almacen_id) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Almacen sin capacidad disponible';
    END IF;
  END IF;
END$$

CREATE TRIGGER after_update_envio_costo
AFTER UPDATE ON envios
FOR EACH ROW
BEGIN
  IF OLD.costo_total <> NEW.costo_total THEN
    INSERT INTO auditoria_envios (envio_id, costo_anterior, costo_nuevo, usuario, fecha_modificacion)
    VALUES (NEW.id, OLD.costo_total, NEW.costo_total, USER(), NOW());
  END IF;
END$$

CREATE TRIGGER after_insert_historial_rastreo
AFTER INSERT ON historial_rastreo
FOR EACH ROW
BEGIN
  IF NEW.estado_evento = 'ENTREGADO' THEN
    UPDATE envios SET estado = 'ENTREGADO' WHERE id = NEW.envio_id;
  END IF;
END$$

-- ===================== PROCEDURES =====================

CREATE PROCEDURE sp_reporte_mensual_cliente(IN p_cliente_id INT, IN p_mes INT, IN p_anio INT)
BEGIN
  SELECT
    COALESCE(SUM(e.costo_total), 0) AS facturacion_total,
    COALESCE(SUM(e.estado = 'ENTREGADO'), 0) AS envios_entregados,
    AVG(TIMESTAMPDIFF(HOUR, e.fecha, h.fecha)) AS horas_promedio_entrega
  FROM envios e
  LEFT JOIN historial_rastreo h
    ON h.envio_id = e.id AND h.estado_evento = 'ENTREGADO'
  WHERE e.remitente_id = p_cliente_id
    AND MONTH(e.fecha) = p_mes
    AND YEAR(e.fecha) = p_anio
    AND e.estado <> 'CANCELADO';
END$$

CREATE PROCEDURE sp_obtener_hoja_ruta_envio(IN p_envio_id INT)
BEGIN
  -- 1) Envio con remitente y destinatario
  SELECT e.id, e.estado, e.costo_total, e.fecha,
         r.nombre AS remitente, dor.calle AS origen_calle, dor.ciudad AS origen_ciudad,
         d.nombre AS destinatario, dde.calle AS destino_calle, dde.ciudad AS destino_ciudad
  FROM envios e
  JOIN clientes r ON r.id = e.remitente_id
  JOIN clientes d ON d.id = e.destinatario_id
  JOIN direcciones dor ON dor.id = e.direccion_origen_id
  JOIN direcciones dde ON dde.id = e.direccion_destino_id
  WHERE e.id = p_envio_id;

  -- 2) Desglose de paquetes
  SELECT id, peso, dimensiones, contenido, almacen_id
  FROM paquetes
  WHERE envio_id = p_envio_id;

  -- 3) Historial cronologico
  SELECT fecha, ubicacion_actual, estado_evento, observaciones
  FROM historial_rastreo
  WHERE envio_id = p_envio_id
  ORDER BY fecha ASC;
END$$

DELIMITER ;

-- ===================== PRUEBA EN WORKBENCH =====================
-- CALL sp_reporte_mensual_cliente(1, 11, 2026);
-- CALL sp_obtener_hoja_ruta_envio(1);
