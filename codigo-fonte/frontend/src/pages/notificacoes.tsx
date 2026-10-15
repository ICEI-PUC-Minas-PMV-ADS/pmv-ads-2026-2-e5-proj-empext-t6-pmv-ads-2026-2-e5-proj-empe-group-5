import { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  AlertTriangle, 
  Wrench, 
  Phone, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface ServicoNotificacao {
  id: string;
  status: string;
  criadoEm: string;
  cliente?: { nome: string; telefone?: string };
  equipamento?: { nome: string; modelo?: string };
  tecnico?: { nome: string };
}

interface AlertaCliente {
  clienteId: string;
  nomeCliente: string;
  telefone: string;
  totalEquipamentos: number;
  ultimaManutencao?: string | null;
  diasSemManutencao?: number | null;
}

export function Notificacoes() {
  const [proximosServicos, setProximosServicos] = useState<ServicoNotificacao[]>([]);
  const [alertasManutencao, setAlertasManutencao] = useState<AlertaCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        const token = localStorage.getItem('@crm:token');
        const response = await fetch('http://localhost:3333/api/notificacoes', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Falha ao buscar notificações.');

        const data = await response.json();
        setProximosServicos(data.proximosServicos || []);
        setAlertasManutencao(data.alertasManutencao || []);
      } catch (err) {
        setErro('Não foi possível carregar os alertas do sistema.');
      } finally {
        setLoading(false);
      }
    }

    carregarNotificacoes();
  }, []);

  return (
    <div className="space-y-8">
      {/* CABEÇAO */}
      <header>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 rounded-xl text-[#1FA2D6]">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-sky-950">Central de Notificações</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Alertas de serviços agendados e sugestões de manutenção preventiva
            </p>
          </div>
        </div>
      </header>

      {erro && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {erro}
        </div>
      )}

      {/* PAINEL DE SERVIÇOS CHEGANDO */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              Próximos Serviços & OS Pendentes
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            {proximosServicos.length} em aberto
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Carregando serviços...</p>
        ) : proximosServicos.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <p>Nenhuma ordem de serviço pendente no momento!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proximosServicos.map((os) => (
              <div 
                key={os.id}
                className="p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-sky-50/50 hover:border-sky-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-800">
                      {os.cliente?.nome || 'Cliente não identificado'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 font-medium rounded-full ${
                      os.status === 'EM_ANDAMENTO' 
                        ? 'bg-sky-100 text-sky-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {os.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Pendente'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    {os.equipamento?.nome || 'Ar-condicionado'} ({os.equipamento?.modelo || 'Padrão'})
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Criado em: {new Date(os.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs text-slate-500">
                  <span>Técnico: <strong>{os.tecnico?.nome || 'A definir'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAINEL DE MANUTENÇÃO PREVENTIVA (>6 MESES) */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              Oportunidades de Manutenção Preventiva (&gt;6 meses sem revisão)
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200">
            {alertasManutencao.length} clientes
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Analisando histórico de clientes...</p>
        ) : alertasManutencao.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p>Todos os clientes estão com as manutenções em dia!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase">
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Telefone / Contato</th>
                  <th className="py-3 px-4">Equipamentos</th>
                  <th className="py-3 px-4">Última Revisão</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {alertasManutencao.map((alerta) => (
                  <tr key={alerta.clienteId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {alerta.nomeCliente}
                    </td>
                    <td className="py-3 px-4 text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      {alerta.telefone}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {alerta.totalEquipamentos} aparelho(s)
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {alerta.ultimaManutencao 
                        ? `${new Date(alerta.ultimaManutencao).toLocaleDateString('pt-BR')} (${alerta.diasSemManutencao} dias atrás)`
                        : 'Nenhuma revisão gravada'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Revisão Recomendada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}