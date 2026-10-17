import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  UserRound,
  X,
  Search,
  Wrench,
  Phone,
  ExternalLink,
  Pencil,
  Trash2,
  Save
} from 'lucide-react';

import "../agenda.css";

type Agendamento = {
  id: string;
  ordemServicoId: string;
  data: string;
  horario: string;
  dataAgendada: string;
  cliente: string;
  telefone: string;
  endereco: string;
  equipamento: string;
  equipamentoDetalhes?: {
    nome: string;
    marca: string;
    modelo: string;
    localizacao: string;
    capacidadeBtu: number;
  } | null;
  servico: string;
  tipo: 'PREVENTIVA' | 'CORRETIVA';
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  concluidoEm?: string | null;
  tecnico: string;
  tecnicoId?: string | null;
  tecnicoEmail?: string;
  situacaoTemporal: 'ACONTECENDO' | 'ACONTECERA' | 'JA_ACONTECEU';
};

type Tecnico = {
  id: string;
  nome: string;
  email: string;
};

const API = 'http://localhost:3333/api';

function obterToken(): string {
  return localStorage.getItem('@crm:token') || '';
}

function exibirStatus(status: string) {
  switch (status) {
    case 'EM_ANDAMENTO':
      return 'Em andamento';
    case 'CONCLUIDO':
      return 'Concluída';
    case 'CANCELADO':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
}

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

const diasSemana = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb"
];

function criarChaveData(
  ano: number,
  mes: number,
  dia: number
): string {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function formatarDataCompleta(data: string): string {
  const [ano, mes, dia] = data.split("-").map(Number);

  const dataFormatada = new Date(ano, mes - 1, dia);

  const texto = dataFormatada.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarDataCurta(data: string): string {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function obterDataHoje(): string {
  const hoje = new Date();

  return criarChaveData(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );
}

export function Agenda() {
  const navigate = useNavigate();

  const [mesAtual, setMesAtual] = useState<Date>(() => {
    const hoje = new Date();

    return new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      1
    );
  });

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);

  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [dadosEdicao, setDadosEdicao] = useState<{
    descricao: string;
    data: string;
    horario: string;
    tipo: 'PREVENTIVA' | 'CORRETIVA';
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
    tecnicoId: string;
  }>({
    descricao: '',
    data: '',
    horario: '',
    tipo: 'PREVENTIVA',
    status: 'PENDENTE',
    tecnicoId: '',
  });
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  async function carregarAgendamentos() {
    try {
      setCarregando(true);
      const token = obterToken();
      const resposta = await fetch(`${API}/agenda`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        return;
      }

      const dados: Agendamento[] = await resposta.json();
      setAgendamentos(dados);
    } catch (erro) {
      console.error(erro);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarTecnicos() {
    try {
      const token = obterToken();
      const resposta = await fetch(`${API}/tecnicos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        return;
      }

      const dados: Tecnico[] = await resposta.json();
      setTecnicos(dados);
    } catch (erro) {
      console.error(erro);
    }
  }

  function iniciarEdicao(item: Agendamento) {
    setIdEmEdicao(item.id);
    setDadosEdicao({
      descricao: item.servico,
      data: item.data,
      horario: item.horario,
      tipo: item.tipo,
      status: item.status,
      tecnicoId: item.tecnicoId || '',
    });
  }

  function cancelarEdicao() {
    setIdEmEdicao(null);
  }

  async function salvarEdicao(id: string) {
    try {
      setSalvandoEdicao(true);
      const token = obterToken();
      const dataAgendada = new Date(`${dadosEdicao.data}T${dadosEdicao.horario}:00`).toISOString();

      const resposta = await fetch(`${API}/agenda/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descricao: dadosEdicao.descricao,
          tipo: dadosEdicao.tipo,
          status: dadosEdicao.status,
          dataAgendada,
          tecnicoId: dadosEdicao.tecnicoId || null,
        }),
      });

      if (!resposta.ok) {
        const erroJson = await resposta.json().catch(() => ({}));
        alert(erroJson.error || 'Erro ao salvar alterações da Ordem de Serviço.');
        return;
      }

      setIdEmEdicao(null);
      const [anoNovo, mesNovo] = dadosEdicao.data.split('-').map(Number);
      setMesAtual(new Date(anoNovo, mesNovo - 1, 1));
      setDataSelecionada(dadosEdicao.data);
      await carregarAgendamentos();
    } catch (erro) {
      console.error(erro);
      alert('Erro ao conectar com o servidor para atualizar a Ordem de Serviço.');
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function excluirOrdemServico(id: string) {
    const confirmou = window.confirm(
      'Deseja realmente excluir esta Ordem de Serviço da agenda?'
    );

    if (!confirmou) {
      return;
    }

    try {
      const token = obterToken();
      const resposta = await fetch(`${API}/agenda/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        alert('Erro ao excluir a Ordem de Serviço.');
        return;
      }

      if (idEmEdicao === id) {
        setIdEmEdicao(null);
      }

      await carregarAgendamentos();
    } catch (erro) {
      console.error(erro);
      alert('Erro ao conectar com o servidor para excluir a Ordem de Serviço.');
    }
  }

  useEffect(() => {
    carregarAgendamentos();
    carregarTecnicos();
  }, []);

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const primeiroDiaDoMes = new Date(
    ano,
    mes,
    1
  ).getDay();

  const quantidadeDeDias = new Date(
    ano,
    mes + 1,
    0
  ).getDate();

  const diasDoCalendario = useMemo(() => {
    return Array.from(
      {
        length: primeiroDiaDoMes + quantidadeDeDias
      },
      (_, indice) => {
        if (indice < primeiroDiaDoMes) {
          return null;
        }

        return indice - primeiroDiaDoMes + 1;
      }
    );
  }, [primeiroDiaDoMes, quantidadeDeDias]);

  const dataHoje = obterDataHoje();

  function mudarMes(direcao: number) {
    setMesAtual(
      new Date(
        ano,
        mes + direcao,
        1
      )
    );
  }

  function irParaHoje() {
    const hoje = new Date();

    setMesAtual(
      new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      )
    );
  }

  function abrirDia(dia: number) {
    const data = criarChaveData(
      ano,
      mes,
      dia
    );

    setDataSelecionada(data);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setDataSelecionada(null);
    setIdEmEdicao(null);
  }

  const agendamentosFiltrados = useMemo(() => {
    if (!termoBusca.trim()) {
      return agendamentos;
    }

    const termo = termoBusca.toLowerCase().trim();

    return agendamentos.filter((a) =>
      a.cliente.toLowerCase().includes(termo) ||
      a.servico.toLowerCase().includes(termo) ||
      a.tecnico.toLowerCase().includes(termo) ||
      a.endereco.toLowerCase().includes(termo) ||
      (a.equipamento && a.equipamento.toLowerCase().includes(termo))
    );
  }, [agendamentos, termoBusca]);

  const agendamentosDoDia = dataSelecionada
    ? agendamentos.filter(
        (agendamento) => agendamento.data === dataSelecionada
      )
    : [];

  function renderizarBadgeSituacao(
    situacao: 'ACONTECENDO' | 'ACONTECERA' | 'JA_ACONTECEU',
    status: string
  ) {
    if (status === 'CANCELADO') {
      return (
        <span className="agenda-badge-situacao agenda-badge-cancelado">
          Cancelada
        </span>
      );
    }

    if (situacao === 'ACONTECENDO') {
      return (
        <span className="agenda-badge-situacao agenda-badge-acontecendo">
          Está acontecendo
        </span>
      );
    }

    if (situacao === 'ACONTECERA') {
      return (
        <span className="agenda-badge-situacao agenda-badge-acontecera">
          Acontecerá
        </span>
      );
    }

    return (
      <span className="agenda-badge-situacao agenda-badge-concluido">
        Já aconteceu
      </span>
    );
  }

  return (
    <div className="agenda-container">

      <div className="agenda-header">
        <div>
          <h1 className="agenda-titulo">Agenda</h1>
          <p className="agenda-subtitulo">
            Acompanhe os atendimentos e ordens de serviço agendados.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="agenda-botao-hoje"
            onClick={irParaHoje}
          >
            Hoje
          </button>

          <button
            type="button"
            className="agenda-botao-hoje"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0284c7' }}
            onClick={() => navigate('/ordem-servico')}
          >
            <Plus size={16} />
            Nova Ordem de Serviço
          </button>
        </div>
      </div>

      <div className="agenda-periodo">
        <div className="agenda-periodo-info">
          <span className="agenda-mes">{meses[mes]}</span>
          <span className="agenda-ano">{ano}</span>
        </div>

        <div className="agenda-navegacao">
          <button
            type="button"
            className="agenda-botao-navegacao"
            onClick={() => mudarMes(-1)}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            className="agenda-botao-navegacao"
            onClick={() => mudarMes(1)}
            aria-label="Próximo mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="agenda-busca-container">
        <Search size={18} className="agenda-busca-icone" />
        <input
          type="text"
          placeholder="Pesquisar por cliente, serviço, aparelho, técnico ou endereço..."
          value={termoBusca}
          onChange={(evento) => setTermoBusca(evento.target.value)}
          className="agenda-busca-input"
        />
        {termoBusca && (
          <button
            type="button"
            onClick={() => setTermoBusca('')}
            className="agenda-busca-limpar"
            title="Limpar pesquisa"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {termoBusca && (
        <div className="agenda-busca-resultados">
          <div className="agenda-busca-titulo">
            Resultados da busca ({agendamentosFiltrados.length})
          </div>
          {agendamentosFiltrados.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Nenhum serviço agendado encontrado para "{termoBusca}".
            </p>
          ) : (
            <div className="agenda-busca-lista">
              {agendamentosFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="agenda-busca-item"
                  onClick={() => {
                    const [anoItem, mesItem] = item.data.split('-').map(Number);
                    setMesAtual(new Date(anoItem, mesItem - 1, 1));
                    setDataSelecionada(item.data);
                    setModalAberto(true);
                  }}
                >
                  <div className="agenda-busca-item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      {renderizarBadgeSituacao(item.situacaoTemporal, item.status)}
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#0369a1' }}>
                        {item.horario} • {item.cliente}
                      </span>
                    </div>
                    <h4>{item.servico}</h4>
                    <p>{formatarDataCurta(item.data)} • {item.equipamento} • Técnico: {item.tecnico}</p>
                  </div>
                  <span className="agenda-busca-item-badge">Ver detalhes</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="agenda-card">
        <div className="agenda-semana">
          {diasSemana.map((dia) => (
            <div key={dia} className="agenda-dia-semana">
              {dia}
            </div>
          ))}
        </div>

        <div className="agenda-grid">
          {diasDoCalendario.map((dia, indice) => {
            if (dia === null) {
              return (
                <div
                  key={`vazio-${indice}`}
                  className="agenda-celula vazia"
                />
              );
            }

            const data = criarChaveData(ano, mes, dia);

            const agendamentosDoDiaAtual = agendamentosFiltrados.filter(
              (agendamento) => agendamento.data === data
            );

            const ehHoje = data === dataHoje;

            return (
              <button
                type="button"
                key={data}
                className={`agenda-celula ${ehHoje ? "dia-atual" : ""} ${
                  agendamentosDoDiaAtual.length > 0 ? "tem-agendamento" : ""
                }`}
                onClick={() => abrirDia(dia)}
              >
                <span className="numero-dia">{dia}</span>

                {agendamentosDoDiaAtual.slice(0, 2).map((agendamento) => {
                  let corPonto = '#0284c7';
                  if (agendamento.situacaoTemporal === 'ACONTECENDO') corPonto = '#16a34a';
                  if (agendamento.situacaoTemporal === 'JA_ACONTECEU') corPonto = '#64748b';
                  if (agendamento.status === 'CANCELADO') corPonto = '#dc2626';

                  return (
                    <span key={agendamento.id} className="agenda-evento">
                      <span className="agenda-ponto" style={{ backgroundColor: corPonto }} />
                      <span className="agenda-evento-texto">
                        {agendamento.horario} {agendamento.cliente}
                      </span>
                    </span>
                  );
                })}

                {agendamentosDoDiaAtual.length > 2 && (
                  <span className="agenda-mais">
                    +{agendamentosDoDiaAtual.length - 2} serviços
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="agenda-legenda">
        <span className="agenda-legenda-item">
          <span className="agenda-ponto" style={{ backgroundColor: '#16a34a' }} />
          Está acontecendo
        </span>
        <span className="agenda-legenda-item">
          <span className="agenda-ponto" style={{ backgroundColor: '#0284c7' }} />
          Acontecerá
        </span>
        <span className="agenda-legenda-item">
          <span className="agenda-ponto" style={{ backgroundColor: '#64748b' }} />
          Já aconteceu
        </span>
        <span className="agenda-legenda-item">
          <span className="agenda-circulo-hoje" />
          Hoje
        </span>
      </div>

      {modalAberto && dataSelecionada && (
        <div className="agenda-modal-overlay" onMouseDown={fecharModal}>
          <div
            className="agenda-modal"
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="agenda-modal-header">
              <div>
                <span className="agenda-modal-label">Serviços Agendados</span>
                <h2>{formatarDataCompleta(dataSelecionada)}</h2>
                <span className="agenda-modal-data">
                  {formatarDataCurta(dataSelecionada)}
                </span>
              </div>

              <button
                type="button"
                className="agenda-modal-fechar"
                onClick={fecharModal}
                aria-label="Fechar"
              >
                <X size={21} />
              </button>
            </div>

            <div className="agenda-modal-conteudo">
              {agendamentosDoDia.length > 0 ? (
                <section className="agenda-secao">
                  <div className="agenda-secao-titulo">
                    <div>
                      <h3>Serviços para este dia</h3>
                      <span>
                        {agendamentosDoDia.length}{" "}
                        {agendamentosDoDia.length === 1 ? "serviço agendado" : "serviços agendados"}
                      </span>
                    </div>
                  </div>

                  <div className="agenda-lista">
                    {agendamentosDoDia.map((agendamento) => (
                      <div key={agendamento.id} className="agenda-agendamento">
                        <div className="agenda-agendamento-topo">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              {renderizarBadgeSituacao(agendamento.situacaoTemporal, agendamento.status)}
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                                OS #{agendamento.ordemServicoId.slice(0, 8)} • {exibirStatus(agendamento.status)}
                              </span>
                            </div>
                            <h4>{agendamento.cliente}</h4>
                            <p style={{ marginTop: 2, fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
                              {agendamento.servico}
                            </p>
                          </div>
                        </div>

                        {idEmEdicao === agendamento.id ? (
                          <form
                            className="agenda-form-edicao"
                            onSubmit={(e) => {
                              e.preventDefault();
                              salvarEdicao(agendamento.id);
                            }}
                          >
                            <div className="agenda-form-edicao-titulo">
                              Editar Ordem de Serviço
                            </div>

                            <div className="agenda-campo">
                              <label>Descrição do Serviço / Problema</label>
                              <textarea
                                value={dadosEdicao.descricao}
                                onChange={(e) =>
                                  setDadosEdicao((prev) => ({ ...prev, descricao: e.target.value }))
                                }
                                required
                                rows={2}
                              />
                            </div>

                            <div className="agenda-form-edicao-grid">
                              <div className="agenda-campo">
                                <label>Data</label>
                                <input
                                  type="date"
                                  value={dadosEdicao.data}
                                  onChange={(e) =>
                                    setDadosEdicao((prev) => ({ ...prev, data: e.target.value }))
                                  }
                                  required
                                />
                              </div>

                              <div className="agenda-campo">
                                <label>Horário</label>
                                <input
                                  type="time"
                                  value={dadosEdicao.horario}
                                  onChange={(e) =>
                                    setDadosEdicao((prev) => ({ ...prev, horario: e.target.value }))
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div className="agenda-form-edicao-grid">
                              <div className="agenda-campo">
                                <label>Tipo de Manutenção</label>
                                <select
                                  value={dadosEdicao.tipo}
                                  onChange={(e) =>
                                    setDadosEdicao((prev) => ({
                                      ...prev,
                                      tipo: e.target.value as 'PREVENTIVA' | 'CORRETIVA',
                                    }))
                                  }
                                >
                                  <option value="PREVENTIVA">Preventiva</option>
                                  <option value="CORRETIVA">Corretiva</option>
                                </select>
                              </div>

                              <div className="agenda-campo">
                                <label>Status</label>
                                <select
                                  value={dadosEdicao.status}
                                  onChange={(e) =>
                                    setDadosEdicao((prev) => ({
                                      ...prev,
                                      status: e.target.value as
                                        | 'PENDENTE'
                                        | 'EM_ANDAMENTO'
                                        | 'CONCLUIDO'
                                        | 'CANCELADO',
                                    }))
                                  }
                                >
                                  <option value="PENDENTE">Pendente</option>
                                  <option value="EM_ANDAMENTO">Em andamento</option>
                                  <option value="CONCLUIDO">Concluído</option>
                                  <option value="CANCELADO">Cancelada</option>
                                </select>
                              </div>
                            </div>

                            <div className="agenda-campo">
                              <label>Técnico Responsável</label>
                              <select
                                value={dadosEdicao.tecnicoId}
                                onChange={(e) =>
                                  setDadosEdicao((prev) => ({ ...prev, tecnicoId: e.target.value }))
                                }
                              >
                                <option value="">Sem técnico atribuído</option>
                                {tecnicos.map((tec) => (
                                  <option key={tec.id} value={tec.id}>
                                    {tec.nome}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="agenda-form-edicao-acoes">
                              <button
                                type="button"
                                className="agenda-botao-cancelar-edicao"
                                onClick={cancelarEdicao}
                                disabled={salvandoEdicao}
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="agenda-botao-salvar-edicao"
                                disabled={salvandoEdicao}
                              >
                                <Save size={14} />
                                {salvandoEdicao ? 'Salvando...' : 'Salvar Alterações'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div
                              className="agenda-detalhes"
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '10px 16px',
                                marginTop: 12
                              }}
                            >
                              <span>
                                <Clock3 size={15} />
                                <strong>Horário:</strong> {agendamento.horario}
                              </span>
                              <span>
                                <UserRound size={15} />
                                <strong>Técnico:</strong> {agendamento.tecnico}
                              </span>
                              <span>
                                <MapPin size={15} />
                                <strong>Endereço:</strong> {agendamento.endereco || 'Endereço não informado'}
                              </span>
                              {agendamento.telefone && (
                                <span>
                                  <Phone size={15} />
                                  <strong>Telefone:</strong> {agendamento.telefone}
                                </span>
                              )}
                              <span>
                                <Wrench size={15} />
                                <strong>Aparelho:</strong> {agendamento.equipamento}
                              </span>
                            </div>

                            {agendamento.equipamentoDetalhes && (
                              <div className="agenda-observacao">
                                <strong>Localização:</strong> {agendamento.equipamentoDetalhes.localizacao} •{" "}
                                <strong>Capacidade:</strong> {agendamento.equipamentoDetalhes.capacidadeBtu.toLocaleString()} BTUs •{" "}
                                <strong>Tipo de Manutenção:</strong> {agendamento.tipo === 'PREVENTIVA' ? 'Preventiva' : 'Corretiva'}
                              </div>
                            )}

                            <div className="agenda-card-acoes">
                              <button
                                type="button"
                                className="agenda-botao-editar"
                                onClick={() => iniciarEdicao(agendamento)}
                              >
                                <Pencil size={13} />
                                Editar
                              </button>

                              <button
                                type="button"
                                className="agenda-botao-excluir-os"
                                onClick={() => excluirOrdemServico(agendamento.id)}
                              >
                                <Trash2 size={13} />
                                Excluir
                              </button>

                              <button
                                type="button"
                                className="agenda-botao-abrir-os"
                                style={{ marginLeft: 'auto' }}
                                onClick={() => navigate('/ordem-servico')}
                              >
                                <ExternalLink size={14} />
                                Abrir na Ordem de Serviço
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="agenda-vazio-dia">
                  <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>
                    Nenhum serviço ou ordem agendada para este dia.
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
                    Todas as ordens de serviço cadastradas aparecem automaticamente nesta agenda.
                  </p>
                  <button
                    type="button"
                    className="agenda-botao-abrir-os"
                    style={{ marginTop: 14 }}
                    onClick={() => navigate('/ordem-servico')}
                  >
                    <Plus size={15} />
                    Cadastrar Ordem de Serviço
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}