import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

interface DetalleVentaBody {
  cliente_id: number;
  producto_id: number;
  cantidad: number;
  subtotal: number;
  iva_porcentaje: number;
  total: number;
}

// POST /api/detalle_cp
router.post(
  '/api/detalle_cp',
  async (
    req: Request<Record<string, never>, unknown, DetalleVentaBody>,
    res: Response
  ) => {
    const { cliente_id, producto_id, cantidad, subtotal, iva_porcentaje, total } = req.body;

    // Validaciones mínimas
    if (
      !cliente_id ||
      !producto_id ||
      !cantidad ||
      cantidad <= 0 ||
      !subtotal ||
      !total
    ) {
      return res.status(400).json({ message: 'Datos incompletos o inválidos' });
    }

    try {
      // Guardar en base de datos (una fila por producto)
      const result = await pool.query(
        `INSERT INTO detalle_cp (cliente_id, producto_id, cantidad, subtotal, iva_porcentaje, total)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [cliente_id, producto_id, cantidad, subtotal, iva_porcentaje, total]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al guardar detalle de venta:', err);
      res.status(500).json({ message: 'Error al guardar detalle de venta' });
    }
  }
);

// (Opcional) GET para obtener todos los productos vendidos a un cliente
router.get(
  '/api/detalle_cp/:cliente_id',
  async (
    req: Request<{ cliente_id: string }>,
    res: Response
  ) => {
    const { cliente_id } = req.params;

    try {
      const result = await pool.query(
        `SELECT d.*, p.nombre_producto
         FROM detalle_cp d
         JOIN producto p ON d.producto_id = p.producto_id
         WHERE d.cliente_id = $1
         ORDER BY d.detalle_id ASC`,
        [cliente_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No hay productos registrados para este cliente.' });
      }

      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener detalles:', err);
      res.status(500).json({ message: 'Error al obtener detalles del cliente' });
    }
  }
);

// GET /api/detalle_cp/:cliente_id → obtiene ticket de compra
router.get(
    '/api/detalle_cp/:cliente_id',
    async (req: Request<{ cliente_id: string }>, res: Response) => {
      const { cliente_id } = req.params;
  
      try {
        const result = await pool.query(
          `SELECT d.producto_id, d.cantidad, d.subtotal, d.iva_porcentaje, d.total, p.nombre_producto
           FROM detalle_cp d
           JOIN producto p ON d.producto_id = p.producto_id
           WHERE d.cliente_id = $1
           ORDER BY d.detalle_id ASC`,
          [cliente_id]
        );
  
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No se encontraron productos para este cliente.' });
        }
  
        res.json(result.rows);
      } catch (err) {
        console.error('Error al obtener el ticket del cliente:', err);
        res.status(500).json({ message: 'Error al obtener el ticket del cliente' });
      }
    }
  );
  

export default router;
