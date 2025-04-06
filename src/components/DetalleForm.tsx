// src/components/DetalleForm.tsx
import { useState } from 'react';

type Producto = {
  producto_id: number;
  nombre_producto: string;
  descripcion: string;
  precio_unitario: number;
};

type ProductoAgregado = {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  subtotal: number;
  iva: number;
  total: number;
};

export default function DetalleForm() {
  const [clienteId, setClienteId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [productosAgregados, setProductosAgregados] = useState<ProductoAgregado[]>([]);

  const IVA = 0.16;

  const buscarProducto = async () => {
    if (!productoId.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${productoId}`);
      if (!res.ok) throw new Error();

      const data = await res.json();

      setProducto({
        producto_id: data.producto_id,
        nombre_producto: data.nombre_producto,
        descripcion: data.descripcion,
        precio_unitario: parseFloat(data.precio_unitario),
      });

      setCantidad(1);
      setMensaje('');
    } catch (err) {
        console.log(err)
      setProducto(null);
      setMensaje('Producto no encontrado');
    }
  };

  const handleAgregar = async () => {
    if (!clienteId.trim() || !producto || cantidad <= 0) {
      alert('Completa todos los campos correctamente');
      return;
    }

    const subtotal = producto.precio_unitario * cantidad;
    const iva = subtotal * IVA;
    const total = subtotal + iva;

    const payload = {
      cliente_id: parseInt(clienteId),
      producto_id: producto.producto_id,
      cantidad,
      subtotal,
      iva_porcentaje: IVA,
      total,
    };

    try {
      const res = await fetch('http://localhost:3000/api/detalle_cp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Agregar a la tabla local
      setProductosAgregados((prev) => [
        ...prev,
        {
          producto_id: producto.producto_id,
          nombre_producto: producto.nombre_producto,
          cantidad,
          subtotal,
          iva,
          total,
        },
      ]);

      // Limpiar producto y cantidad (pero mantener cliente)
      setProductoId('');
      setProducto(null);
      setCantidad(1);
      setMensaje('');
    } catch (err) {
      console.error('Error al guardar detalle:', err);
      alert('Error al guardar detalle');
    }
  };

  const calcularTotales = () => {
    const subtotal = productosAgregados.reduce((acc, p) => acc + p.subtotal, 0);
    const iva = productosAgregados.reduce((acc, p) => acc + p.iva, 0);
    const total = productosAgregados.reduce((acc, p) => acc + p.total, 0);
    return { subtotal, iva, total };
  };

  const { subtotal, iva, total } = calcularTotales();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Detalle de Venta</h2>

      <div>
        <label className="block text-sm font-medium">ID del Cliente</label>
        <input
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          type="number"
          placeholder="Ej. 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">ID del Producto</label>
        <div className="flex gap-2">
          <input
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
            type="number"
            placeholder="Ej. 101"
          />
          <button
            onClick={buscarProducto}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
        {mensaje && <p className="text-red-600 text-sm mt-1">{mensaje}</p>}
      </div>

      {producto && (
        <div className="space-y-4 border-t pt-4">
          <div className="border rounded p-4 bg-gray-50">
            <p><strong>Nombre:</strong> {producto.nombre_producto}</p>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <p><strong>Precio Unitario:</strong> ${producto.precio_unitario.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              min="1"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="border-t pt-2 space-y-1 text-sm">
            <p><strong>Subtotal:</strong> ${(producto.precio_unitario * cantidad).toFixed(2)}</p>
            <p><strong>IVA (16%):</strong> ${(producto.precio_unitario * cantidad * IVA).toFixed(2)}</p>
            <p><strong>Total:</strong> ${(producto.precio_unitario * cantidad * (1 + IVA)).toFixed(2)}</p>
          </div>

          <button
            onClick={handleAgregar}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar producto al detalle
          </button>
        </div>
      )}

      {productosAgregados.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">Productos agregados</h3>
          <table className="w-full text-sm border rounded overflow-hidden">
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
              {productosAgregados.map((p, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{p.nombre_producto}</td>
                  <td className="border px-2 py-1 text-center">{p.cantidad}</td>
                  <td className="border px-2 py-1 text-right">${p.subtotal.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right">${p.iva.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-right font-bold">${p.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-semibold">
                <td className="border px-2 py-1 text-right" colSpan={2}>Totales</td>
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
