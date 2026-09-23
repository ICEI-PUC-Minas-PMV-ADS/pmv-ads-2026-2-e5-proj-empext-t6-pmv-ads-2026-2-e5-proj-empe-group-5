import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard, { DashboardHome } from './pages/dashboard';
import { Agenda } from './pages/agenda';
import { OrdemServico } from './pages/ordemServico';
import { CadastroClientes } from './pages/cadastroClientes';

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

          {/* Ordem de Serviço */}
          <Route path="ordem-servico" element={<OrdemServico />} />

          {/* Cadastro de Clientes */}
          <Route path="clientes" element={<CadastroClientes />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}