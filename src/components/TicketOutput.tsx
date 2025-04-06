// src/components/TicketOutput.tsx
import { useState } from 'react';

type ProductoTicket = {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  subtotal: number;
  iva_porcentaje: number;
  total: number;
};

export default function Ticket() {
  const [clienteId, setClienteId] = useState('');
  const [productos, setProductos] = useState<ProductoTicket[]>([]);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = async () => {
    if (!clienteId.trim()) return;
  
    try {
      const res = await fetch(`http://localhost:3000/api/detalle_cp/${clienteId}`);
      const rawData = await res.json();
  
      if (!res.ok) throw new Error(rawData.message);
  
      const data: ProductoTicket[] = rawData.map((p: unknown) => {
        const parsed = p as Record<string, unknown>;
  
        return {
          producto_id: Number(parsed.producto_id),
          nombre_producto: String(parsed.nombre_producto),
          cantidad: Number(parsed.cantidad),
          subtotal: Number(parsed.subtotal),
          iva_porcentaje: Number(parsed.iva_porcentaje),
          total: Number(parsed.total),
        };
      });
  
      setProductos(data);
      setMensaje('');
    } catch (err) {
      console.error(err);
      setProductos([]);
      setMensaje('No se encontró un ticket para este cliente.');
    }
  };
  

  const calcularTotales = () => {
    const subtotal = productos.reduce((acc, p) => acc + p.subtotal, 0);
    const iva = productos.reduce(
      (acc, p) => acc + p.subtotal * p.iva_porcentaje,
      0
    );
    const total = productos.reduce((acc, p) => acc + p.total, 0);
    return { subtotal, iva, total };
  };

  const { subtotal, iva, total } = calcularTotales();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Ticket de Compra</h2>

      <div>
        <label className="block text-sm font-medium">ID del Cliente</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
            placeholder="Ej. 1"
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {mensaje && (
        <p className="text-red-600 text-sm">{mensaje}</p>
      )}

      {productos.length > 0 && (
        <div>
          <table className="w-full text-sm border rounded overflow-hidden mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Producto</th>
                <th className="border px-2 py-1">Cantidad</th>
                <th className="border px-2 py-1">Subtotal</th>
                <th className="border px-2 py-1">IVA</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{p.nombre_producto}</td>
                  <td className="border px-2 py-1 text-center">{p.cantidad}</td>
                  <td className="border px-2 py-1 text-right">${p.subtotal.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">
                    ${(p.subtotal * p.iva_porcentaje).toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-right font-bold">${p.total.toFixed(2)}</td>
                </tr>
              ))}

              <tr className="bg-gray-200 font-semibold">
                <td className="border px-2 py-1 text-right" colSpan={2}>
                  Totales
                </td>
                <td className="border px-2 py-1 text-right">${subtotal.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">${iva.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
