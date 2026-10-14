import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard, { DashboardHome } from './pages/dashboard';
import { Agenda } from './pages/agenda';
import { OrdemServico } from './pages/ordemServico';
import { CadastroClientes } from './pages/cadastroClientes';
import { Relatorios } from './pages/relatorios';
import { CriarRelatorio } from './pages/criarRelatorio';

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

          <Route path="relatorios" element={<Relatorios />} />

          <Route path="relatorios/criar" element={<CriarRelatorio />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}