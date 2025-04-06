import { useEffect, useState } from 'react';

type Producto = {
  producto_id: number;
  nombre_producto: string;
  descripcion: string;
  stock_disponible: number;
  precio_unitario: string; // ⚠️ ¡Recuerda! Viene como string desde PostgreSQL
};

export default function ProductoPanel() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Productos Disponibles</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.producto_id} className="text-center border-t">
              <td>{prod.nombre_producto}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.stock_disponible}</td>
              <td>${Number(prod.precio_unitario).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
