
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import Dashboard, { DashboardHome } from './pages/dashboard';
import { Agenda } from './pages/agenda';
import { OrdemServico } from './pages/ordemServico';
import { CadastroClientes } from './pages/cadastroClientes';
import { Login } from './pages/login';
import { CadastroUsuario } from './pages/cadastroUsuario';

// Verifica se existe uma sessão salva
function RotaProtegida() {
  const token = localStorage.getItem('@crm:token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página de Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />

        {/* Páginas que exigem login */}
        <Route element={<RotaProtegida />}>
          <Route path="/" element={<Dashboard />}>

            <Route index element={<DashboardHome />} />

            <Route path="agenda" element={<Agenda />} />

            <Route
              path="ordem-servico"
              element={<OrdemServico />}
            />

            <Route
              path="clientes"
              element={<CadastroClientes />}
            />

          </Route>
        </Route>

        {/* Endereço não encontrado */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
