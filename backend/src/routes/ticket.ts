import { Router } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM detalle_cp');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener tickets:', err);
    res.status(500).json({ message: 'Error al obtener tickets' });
  }
});

export default router;
