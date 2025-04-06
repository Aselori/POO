import express from 'express';
import cors from 'cors';

import clienteRoutes from './routes/cliente';
import productoRoutes from './routes/producto';
import detalleRoutes from './routes/detalle_cp';
import ticketRoutes from './routes/ticket';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Montar todas las rutas
app.use(clienteRoutes);
app.use(productoRoutes);
app.use(detalleRoutes);
app.use(ticketRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
