import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET todos los productos (opcional)
router.get('/api/productos', async (_req, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM producto ORDER BY producto_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// GET por ID
router.get('/api/productos/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM producto WHERE producto_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al buscar producto:', err);
    res.status(500).json({ message: 'Error al buscar producto' });
  }
});

// POST nuevo producto
router.post('/api/productos', async (req: Request, res: Response) => {
  const { nombre, descripcion, stock_disponible, precio_unitario } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO producto (nombre_producto, descripcion, stock_disponible, precio_unitario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, descripcion, stock_disponible, precio_unitario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// PUT modificar
router.put('/api/productos/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, stock_disponible, precio_unitario } = req.body;

  try {
    const result = await pool.query(
      `UPDATE producto
       SET nombre_producto = $1,
           descripcion = $2,
           stock_disponible = $3,
           precio_unitario = $4
       WHERE producto_id = $5
       RETURNING *`,
      [nombre, descripcion, stock_disponible, precio_unitario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

// DELETE producto
router.delete('/api/productos/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM producto WHERE producto_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado', producto: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

export default router;
