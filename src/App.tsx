// src/App.tsx
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
