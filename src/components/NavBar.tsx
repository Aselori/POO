// src/components/NavBar.tsx
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100 shadow">
      <Link to="/" className="text-blue-600 hover:underline">Clientes</Link>
      <Link to="/productos" className="text-blue-600 hover:underline">Productos</Link>
      <Link to="/producto-form" className="text-blue-600 hover:underline">Agregar Producto</Link>
      <Link to="/detalle" className="text-blue-600 hover:underline">Registrar Venta</Link>
      <Link to="/ticket" className="text-blue-600 hover:underline">Tickets</Link>
    </nav>
  );
}
