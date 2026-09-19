import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard, { DashboardHome } from './pages/dashboard';
import { Agenda } from './pages/agenda';

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* DASHBOARD / LAYOUT PRINCIPAL */}
        <Route path="/" element={<Dashboard />}>

          {/* Página inicial */}
          <Route index element={<DashboardHome />} />

          {/* Agenda */}
          <Route path="agenda" element={<Agenda />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}