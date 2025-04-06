// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import ClienteForm from './components/ClienteForm';
import ProductoPanel from './components/ProductoPanel';
import TicketOutput from './components/TicketOutput';
import DetalleForm from './components/DetalleForm';
import ProductoForm from './components/ProductoForm'; // agregado

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ClienteForm />} />
          <Route path="productos" element={<ProductoPanel />} />
          <Route path="producto-form" element={<ProductoForm />} /> {/* CRUD de producto */}
          <Route path="detalle" element={<DetalleForm />} />        {/* Entrada de venta */}
          <Route path="ticket" element={<TicketOutput />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
