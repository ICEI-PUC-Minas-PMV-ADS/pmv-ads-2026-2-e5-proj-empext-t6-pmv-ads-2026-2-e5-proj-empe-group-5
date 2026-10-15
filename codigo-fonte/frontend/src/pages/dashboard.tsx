
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import {
  Home,
  Calendar,
  Inbox,
  Bell,
  Users,
  ChevronLeft,
  ChevronRight,
  Wrench,
  CheckCircle,
  Clock,
  Wind,
  FileText,
  LogOut
} from 'lucide-react';

// =========================================
// INTERFACE DOS DADOS DO DASHBOARD
// =========================================

interface DashboardStats {
  totalClientes: number;
  totalOS: number;
  osPendentes: number;
  osEmAndamento: number;
  osConcluidas: number;

  ultimasOS: Array<{
    id: string;
    status: string;
    dataAgendada?: string;
    cliente: { nome: string };
    tecnico?: { nome: string } | null;
    equipamento?: {
      nome: string;
      modelo?: string;
    } | null;
  }>;
}

// =========================================
// LAYOUT PRINCIPAL
// =========================================

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem('@crm:token');
    localStorage.removeItem('@crm:usuario');

    // Limpa também a chave antiga, caso exista
    localStorage.removeItem('token');

    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">

      {/* MENU LATERAL */}
      <aside
        className={`bg-[#1FA2D6] text-white transition-all duration-300 relative flex flex-col justify-between ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>

          {/* TOPO */}
          <div className="flex items-center justify-between p-4 border-b border-sky-400/30">

            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 font-bold text-lg tracking-wide">
                <Wind className="w-6 h-6 text-sky-100" />
                <span>E-Maintenance</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-sky-600/40 hover:bg-sky-600/70 transition-colors mx-auto"
              title={isSidebarCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>

          </div>

          {/* NAVEGAÇÃO */}
          <nav className="mt-6 px-3 space-y-2">

            <NavItem
              icon={<Home />}
              label="Home"
              isCollapsed={isSidebarCollapsed}
              path="/"
              end
            />

            <NavItem
              icon={<Calendar />}
              label="Agenda"
              isCollapsed={isSidebarCollapsed}
              path="/agenda"
            />

            <NavItem
              icon={<Inbox />}
              label="Inbox"
              isCollapsed={isSidebarCollapsed}
              path="/inbox"
            />

            <NavItem
              icon={<Bell />}
              label="Notificações"
              isCollapsed={isSidebarCollapsed}
              path="/notificacoes"
            />

            <NavItem
              icon={<Users />}
              label="Clientes"
              isCollapsed={isSidebarCollapsed}
              path="/clientes"
            />

            <NavItem
              icon={<FileText />}
              label="Relatórios"
              isCollapsed={isSidebarCollapsed}
              path="/relatorios"
              />

            <NavItem
             icon={<Wrench />}
             label="Ordem de Serviço"
             isCollapsed={isSidebarCollapsed}
             path="/ordem-servico"
              icon={<Wrench />}
              label="Ordem de Serviço"
              isCollapsed={isSidebarCollapsed}
              path="/ordem-servico"
            />


          </nav>

        </div>

        {/* RODAPÉ E LOGOUT */}
        <div className="p-4 border-t border-sky-400/30">

          <button
            type="button"
            onClick={sair}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium text-white hover:bg-sky-600/40 transition-colors"
            title="Sair do sistema"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />

            {!isSidebarCollapsed && (
              <span>Sair do sistema</span>
            )}
          </button>

          {!isSidebarCollapsed && (
            <p className="mt-3 text-xs text-sky-100">
              PCM & Climatização v1.0
            </p>
          )}

        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>

    </div>
  );
}

// =========================================
// CONTEÚDO DO DASHBOARD
// =========================================

export function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('@crm:token');

        if (!token) {
          navigate('/login', { replace: true });
          return;
        }

        const response = await fetch(
          'http://localhost:3333/api/dashboard/stats',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('@crm:token');
          localStorage.removeItem('@crm:usuario');

          navigate('/login', { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do Dashboard.');
        }

        const data: DashboardStats = await response.json();

        if (ativo) {
          setStats(data);
          setErro('');
        }
      } catch (error) {
        console.error('Erro ao carregar Dashboard:', error);

        if (ativo) {
          setErro('Não foi possível conectar ao servidor.');
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      ativo = false;
    };
  }, [navigate]);

  return (
    <>

      {/* CABEÇALHO */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sky-950">
          Dashboard
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Visão geral do sistema de climatização e ordens de serviço
        </p>
      </header>

      {/* MENSAGEM DE ERRO */}
      {erro && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* CARDS DE RESUMO */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Clientes Ativos"
          value={loading ? '...' : String(stats?.totalClientes ?? 0)}
          icon={<Users className="text-sky-600" />}
        />

        <StatCard
          title="OS Em Andamento"
          value={loading ? '...' : String(stats?.osEmAndamento ?? 0)}
          icon={<Clock className="text-amber-500" />}
        />

        <StatCard
          title="Serviços Concluídos"
          value={loading ? '...' : String(stats?.osConcluidas ?? 0)}
          icon={<CheckCircle className="text-emerald-500" />}
        />

        <StatCard
          title="Total de OS"
          value={loading ? '...' : String(stats?.totalOS ?? 0)}
          icon={<Wrench className="text-sky-600" />}
        />

      </section>

      {/* GRÁFICOS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* INDICADOR SLA */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">

          <h3 className="text-base font-semibold text-slate-700 mb-4 self-start">
            SLA de Atendimento
          </h3>

          <div className="relative w-48 h-24 overflow-hidden mt-2">
            <div className="w-48 h-48 bg-slate-100 rounded-full border-[18px] border-sky-500 border-b-transparent border-l-transparent transform -rotate-45" />
          </div>

          <span className="text-3xl font-bold text-sky-950 mt-2">
            92%
          </span>

          <span className="text-xs text-slate-500">
            Metas de prazo cumpridas
          </span>

        </div>

        {/* GRÁFICO MENSAL */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

          <h3 className="text-base font-semibold text-slate-700 mb-6">
            Atendimentos e Manutenções (Ano)
          </h3>

          <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-slate-200 pb-2">

            {[65, 40, 75, 45, 90, 55, 70, 85, 50, 60, 95, 80].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full bg-sky-500 hover:bg-sky-600 rounded-t-md transition-all"
                  />

                  <span className="text-[10px] text-slate-400 font-medium">
                    {[
                      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
                    ][index]}
                  </span>
                </div>
              )
            )}

          </div>
        </div>

      </section>

      {/* ÚLTIMAS ORDENS DE SERVIÇO */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        <h3 className="text-base font-semibold text-slate-700 mb-4">
          Próximos Serviços Agendados
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Equipamento</th>
                <th className="py-3 px-4">Data/Hora</th>
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-slate-400"
                  >
                    Carregando serviços...
                  </td>
                </tr>
              ) : !stats?.ultimasOS?.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-slate-400"
                  >
                    Nenhuma Ordem de Serviço cadastrada.
                  </td>
                </tr>
              ) : (
                stats.ultimasOS.map((os) => (
                  <tr key={os.id}>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {os.cliente?.nome || 'Cliente não informado'}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {os.equipamento?.nome || 'Ar-condicionado'}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {os.dataAgendada
                        ? new Date(os.dataAgendada).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })
                        : 'A definir'}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {os.tecnico?.nome || 'Não atribuído'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          os.status === 'CONCLUIDO'
                            ? 'bg-emerald-50 text-emerald-600'
                            : os.status === 'EM_ANDAMENTO'
                            ? 'bg-sky-50 text-sky-600'
                            : os.status === 'CANCELADO'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {os.status === 'CONCLUIDO'
                          ? 'Concluída'
                          : os.status === 'EM_ANDAMENTO'
                          ? 'Em andamento'
                          : os.status === 'CANCELADO'
                          ? 'Cancelada'
                          : 'Pendente'}
                      </span>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>
      </section>

    </>
  );
}

// =========================================
// ITEM DO MENU LATERAL
// =========================================

function NavItem({
  icon,
  label,
  isCollapsed = false,
  path = '/',
  end = false
}: {
  icon: React.ReactNode;
  label: string;
  isCollapsed?: boolean;
  path?: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white text-[#1FA2D6] shadow-sm'
            : 'hover:bg-sky-600/40 text-white'
        }`
      }
      title={isCollapsed ? label : undefined}
    >
      <div className="w-5 h-5 flex-shrink-0">
        {icon}
      </div>

      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
}

// =========================================
// CARD DE ESTATÍSTICA
// =========================================

function StatCard({
  title,
  value,
  icon
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">

      <div>
        <p className="text-xs font-medium text-slate-500 uppercase">
          {title}
        </p>

        <p className="text-2xl font-bold text-sky-950 mt-1">
          {value}
        </p>
      </div>

      <div className="p-3 bg-slate-50 rounded-lg">
        {icon}
      </div>

    </div>
  );
}
