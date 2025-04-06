import { useState } from 'react';

export default function ClienteForm() {
  const [form, setForm] = useState({
    cliente_id: '',
    nombre: '',
    telefono: '',
    telefono_celular: '',
  });

  const [modoEdicion, setModoEdicion] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNuevo = () => {
    setForm({
      cliente_id: '',
      nombre: '',
      telefono: '',
      telefono_celular: '',
    });
    setModoEdicion(false);
  };

  const handleBuscar = async () => {
    if (!form.cliente_id) {
      alert('Ingresa un ID de cliente');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${form.cliente_id}`);
      if (!res.ok) {
        alert('Cliente no encontrado');
        return;
      }

      const cliente = await res.json();
      setForm({
        cliente_id: cliente.cliente_id,
        nombre: cliente.nombre_cliente,
        telefono: cliente.telefono,
        telefono_celular: cliente.telefono_celular,
      });
      setModoEdicion(true);
    } catch (err) {
      console.error('Error al buscar cliente:', err);
      alert('Error al buscar cliente');
    }
  };

  const handleGuardar = async () => {
    const method = modoEdicion ? 'PUT' : 'POST';
    const url = modoEdicion
      ? `http://localhost:3000/api/clientes/${form.cliente_id}`
      : `http://localhost:3000/api/clientes`;

    const payload = {
      nombre: form.nombre,
      telefono: form.telefono,
      telefono_celular: form.telefono_celular,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al guardar/modificar cliente');

      alert(modoEdicion ? 'Cliente modificado' : 'Cliente guardado');
      handleNuevo();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      alert('Error al guardar el cliente');
    }
  };

  const handleEliminar = async () => {
    if (!form.cliente_id) return;

    const confirmar = window.confirm(`¿Estás seguro de eliminar al cliente "${form.nombre}"?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${form.cliente_id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        handleNuevo();
      } else {
        alert(data.message || 'Error al eliminar cliente');
      }
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      alert('Error al eliminar cliente');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Cliente</h2>

      <div>
        <label className="block text-sm font-medium">ID del Cliente</label>
        <div className="flex gap-2">
          <input
            name="cliente_id"
            value={form.cliente_id}
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
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Celular</label>
        <input
          name="telefono_celular"
          value={form.telefono_celular}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handleNuevo}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Nuevo
        </button>
        <button
          onClick={handleGuardar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {modoEdicion ? 'Modificar' : 'Guardar'}
        </button>
        <button
          onClick={handleEliminar}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
