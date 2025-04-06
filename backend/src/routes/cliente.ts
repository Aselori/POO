// backend/src/routes/cliente.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// Tipos
interface Cliente {
  cliente_id: number;
  nombre_cliente: string;
  telefono: string;
  telefono_celular: string;
}

interface ClienteBody {
  nombre: string;
  telefono?: string;
  telefono_celular?: string;
}

type ClienteParams = { id: string };
type ClienteResponse = Cliente | { message: string };
type ClienteListResponse = Cliente[] | { message: string };
type ClienteDeleteResponse =
  | { message: string; cliente: Cliente }
  | { message: string };

// ==============================
// GET /api/clientes
// ==============================
router.get(
  '/api/clientes',
  async (_req: Request, res: Response<ClienteListResponse>) => {
    try {
      const result = await pool.query('SELECT * FROM cliente ORDER BY cliente_id');
      const clientes: Cliente[] = result.rows;
      res.json(clientes);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
      res.status(500).json({ message: 'Error al obtener clientes' });
    }
  }
);

// ==============================
// GET /api/clientes/:id
// ==============================
router.get(
  '/api/clientes/:id',
  async (
    req: Request<ClienteParams>,
    res: Response<ClienteResponse>
  ) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'SELECT * FROM cliente WHERE cliente_id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const cliente: Cliente = result.rows[0];
      res.json(cliente);
    } catch (err) {
      console.error('Error al buscar cliente:', err);
      res.status(500).json({ message: 'Error al buscar cliente' });
    }
  }
);

// ==============================
// POST /api/clientes
// ==============================
router.post(
  '/api/clientes',
  async (
    req: Request<Record<string, never>, Cliente, ClienteBody>,
    res: Response<ClienteResponse>
  ) => {
    const { nombre, telefono, telefono_celular } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO cliente (nombre_cliente, telefono, telefono_celular)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [nombre, telefono ?? '', telefono_celular ?? '']
      );

      const cliente: Cliente = result.rows[0];
      res.status(201).json(cliente);
    } catch (err) {
      console.error('Error al crear cliente:', err);
      res.status(500).json({ message: 'Error al crear cliente' });
    }
  }
);

// ==============================
// PUT /api/clientes/:id
// ==============================
router.put(
  '/api/clientes/:id',
  async (
    req: Request<Record<string, never>, Cliente, ClienteBody>,
    res: Response<ClienteResponse>
  ) => {
    const { id } = req.params;
    const { nombre, telefono, telefono_celular } = req.body;

    try {
      const result = await pool.query(
        `UPDATE cliente
         SET nombre_cliente = $1, telefono = $2, telefono_celular = $3
         WHERE cliente_id = $4
         RETURNING *`,
        [nombre, telefono ?? '', telefono_celular ?? '', id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const cliente: Cliente = result.rows[0];
      res.json(cliente);
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
      res.status(500).json({ message: 'Error al actualizar cliente' });
    }
  }
);

// ==============================
// DELETE /api/clientes/:id
// ==============================
router.delete(
  '/api/clientes/:id',
  async (
    req: Request<ClienteParams>,
    res: Response<ClienteDeleteResponse>
  ) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM cliente WHERE cliente_id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const cliente: Cliente = result.rows[0];
      return res.json({ message: 'Cliente eliminado', cliente });
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === '23503'
      ) {
        return res.status(400).json({
          message: 'No se puede eliminar el cliente porque tiene ventas registradas.',
        });
      }

      console.error('Error al eliminar cliente:', err);
      return res.status(500).json({ message: 'Error al eliminar cliente' });
    }
  }
);

export default router;
