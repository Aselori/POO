// src/components/ProductoForm.tsx
import { useState } from 'react';

export default function ProductoForm() {
  const [form, setForm] = useState({
    producto_id: '',
    nombre: '',
    descripcion: '',
    stock: '',
    precio: '',
  });

  const [modoEdicion, setModoEdicion] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNuevo = () => {
    setForm({
      producto_id: '',
      nombre: '',
      descripcion: '',
      stock: '',
      precio: '',
    });
    setModoEdicion(false);
  };

  const handleBuscar = async () => {
    if (!form.producto_id) return alert('Ingresa un ID de producto');

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${form.producto_id}`);
      if (!res.ok) throw new Error();

      const producto = await res.json();
      setForm({
        producto_id: producto.producto_id,
        nombre: producto.nombre_producto,
        descripcion: producto.descripcion,
        stock: producto.stock_disponible.toString(),
        precio: producto.precio_unitario.toString(),
      });
      setModoEdicion(true);
    } catch (err) {
      console.error('Producto no encontrado ', err);
      alert('Producto no encontrado');
      setModoEdicion(false);
    }
  };

  const handleGuardar = async () => {
    const method = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion
      ? `http://localhost:3000/api/productos/${form.producto_id}`
      : `http://localhost:3000/api/productos`;

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      stock_disponible: parseInt(form.stock),
      precio_unitario: parseFloat(form.precio),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      alert(modoEdicion ? 'Producto modificado' : 'Producto guardado');
      handleNuevo();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar producto');
    }
  };

  const handleEliminar = async () => {
    if (!form.producto_id) return;

    const confirmar = window.confirm(`¿Eliminar producto "${form.nombre}"?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${form.producto_id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        handleNuevo();
      } else {
        alert(data.message || 'Error al eliminar producto');
      }
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar producto');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Producto</h2>

      <div>
        <label className="block text-sm font-medium">ID del Producto</label>
        <div className="flex gap-2">
          <input
            name="producto_id"
            value={form.producto_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ej. 1"
          />
          <button
            type="button"
            onClick={handleBuscar}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <input
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Stock</label>
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          type="number"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Precio Unitario</label>
        <input
          name="precio"
          value={form.precio}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          type="number"
          step="0.01"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={handleNuevo} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Nuevo
        </button>
        <button onClick={handleGuardar} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {modoEdicion ? 'Modificar' : 'Guardar'}
        </button>
        <button onClick={handleEliminar} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Eliminar
        </button>
      </div>
    </div>
  );
}
