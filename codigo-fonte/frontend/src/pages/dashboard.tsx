import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FileText } from 'lucide-react';

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
  Wind
} from 'lucide-react';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">

      {/* SIDEBAR */}
      <aside
        className={`bg-[#1FA2D6] text-white transition-all duration-300 relative flex flex-col justify-between ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >

        <div>

          {/* TOPO DO SITE */}
          <div className="flex items-center justify-between p-4 border-b border-sky-400/30">

            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 font-bold text-lg tracking-wide">
                <Wind className="w-6 h-6 text-sky-100" />
                <span>E-Maintenance</span>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg bg-sky-600/40 hover:bg-sky-600/70 transition-colors mx-auto"
              title={
                isSidebarCollapsed
                  ? "Expandir Menu"
                  : "Recolher Menu"
              }
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>

          </div>

          {/* MENU DE NAVEGAÇÃO */}
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
              icon={<FileText />}
              label="Ordem de Serviço"
              isCollapsed={isSidebarCollapsed}
              path="/ordem-servico"
            />

            <NavItem
              icon={<Users />}
              label="Clientes"
              isCollapsed={isSidebarCollapsed}
              path="/clientes"
            />

          </nav>

        </div>

        {/* RODAPÉ */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-sky-400/30 text-xs text-sky-100">
            PCM & Climatização v1.0
          </div>
        )}

      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">

        {/* 
          O Outlet é onde o React Router vai colocar
          o conteúdo da página atual.
          
          "/"      → DashboardHome
          "/agenda" → Agenda
        */}
        <Outlet />

      </main>

    </div>
  );
}


/* =========================================================
   CONTEÚDO PRINCIPAL DO DASHBOARD
   ========================================================= */

export function DashboardHome() {
  return (
    <>

      {/* CABEÇA */}
      <header className="mb-8">

        <h1 className="text-3xl font-bold text-sky-950">
          Dashboard
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Visão geral do sistema de climatização e ordens de serviço
        </p>

      </header>


      {/* CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Clientes Ativos"
          value="128"
          icon={<Users className="text-sky-600" />}
        />

        <StatCard
          title="OS Em Andamento"
          value="14"
          icon={<Clock className="text-amber-500" />}
        />

        <StatCard
          title="Serviços Concluídos"
          value="86"
          icon={<CheckCircle className="text-emerald-500" />}
        />

        <StatCard
          title="Equipamentos Monitorados"
          value="412"
          icon={<Wrench className="text-sky-600" />}
        />

      </section>


      {/* GRÁFICOS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* VELOCÍMETRO */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">

          <h3 className="text-base font-semibold text-slate-700 mb-4 self-start">
            SLA de Atendimento
          </h3>

          <div className="relative w-48 h-24 overflow-hidden mt-2">

            <div
              className="w-48 h-48 bg-slate-100 rounded-full border-[18px] border-sky-500 border-b-transparent border-l-transparent transform -rotate-45"
            ></div>

          </div>

          <span className="text-3xl font-bold text-sky-950 mt-2">
            92%
          </span>

          <span className="text-xs text-slate-500">
            Metas de prazo cumpridas
          </span>

        </div>


        {/* GRÁFICO DE BARRAS */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

          <h3 className="text-base font-semibold text-slate-700 mb-6">
            Atendimentos e Manutenções (Ano)
          </h3>

          <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-slate-200 pb-2">

            {[
              65,
              40,
              75,
              45,
              90,
              55,
              70,
              85,
              50,
              60,
              95,
              80
            ].map((height, index) => (

              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >

                <div
                  style={{ height: `${height}%` }}
                  className="w-full bg-sky-500 hover:bg-sky-600 rounded-t-md transition-all"
                ></div>

                <span className="text-[10px] text-slate-400 font-medium">

                  {
                    [
                      'Jan',
                      'Fev',
                      'Mar',
                      'Abr',
                      'Mai',
                      'Jun',
                      'Jul',
                      'Ago',
                      'Set',
                      'Out',
                      'Nov',
                      'Dez'
                    ][index]
                  }

                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* PRÓXIMOS SERVIÇOS */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        <h3 className="text-base font-semibold text-slate-700 mb-4">
          Próximos Serviços Agendados
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase">

                <th className="py-3 px-4">
                  Cliente
                </th>

                <th className="py-3 px-4">
                  Equipamento
                </th>

                <th className="py-3 px-4">
                  Data/Hora
                </th>

                <th className="py-3 px-4">
                  Técnico
                </th>

                <th className="py-3 px-4">
                  Status
                </th>

              </tr>

            </thead>


            <tbody className="text-sm divide-y divide-slate-100">

              {/* SERVIÇO 1 */}
              <tr>

                <td className="py-3 px-4 font-medium text-slate-800">
                  Hospital Central
                </td>

                <td className="py-3 px-4 text-slate-600">
                  philco 9kbtu
                </td>

                <td className="py-3 px-4 text-slate-600">
                  Amanhã - 08:30
                </td>

                <td className="py-3 px-4 text-slate-600">
                  Carlos Silva
                </td>

                <td className="py-3 px-4">

                  <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-600 rounded-full">
                    Agendado
                  </span>

                </td>

              </tr>


              {/* SERVIÇO 2 */}
              <tr>

                <td className="py-3 px-4 font-medium text-slate-800">
                  Shopping Metropolitano
                </td>

                <td className="py-3 px-4 text-slate-600">
                  Split turbo 24k BTU
                </td>

                <td className="py-3 px-4 text-slate-600">
                  Amanhã - 14:00
                </td>

                <td className="py-3 px-4 text-slate-600">
                  Roberto Alves
                </td>

                <td className="py-3 px-4">

                  <span className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-600 rounded-full">
                    Em rota
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </>
  );
}


/* =========================================================
   ITEM DO MENU
   ========================================================= */

function NavItem({
  icon,
  label,
  isCollapsed = false,
  path = "/",
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

      <div className="w-5 h-5">
        {icon}
      </div>

      {!isCollapsed && (
        <span>
          {label}
        </span>
      )}

    </NavLink>

  );
}


/* =========================================================
   CARD DO DASHBOARD
   ========================================================= */

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