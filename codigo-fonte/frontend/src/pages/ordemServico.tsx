
import { useEffect, useState, type FormEvent } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Trash2,
  Pencil,
  X,
  UserRound,
  CalendarDays,
  Wrench
} from 'lucide-react';

import '../ordemServico.css';

type StatusAPI = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
type TipoOS = 'PREVENTIVA' | 'CORRETIVA';
type CadastroRapido = 'cliente' | 'equipamento' | 'tecnico' | null;

type Equipamento = {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  localizacao: string;
  capacidadeBtu: number;
  clienteId: string;
};

type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpjCpf: string;
  equipamentos?: Equipamento[];
};

type Tecnico = {
  id: string;
  nome: string;
  email: string;
  role: string;
};

type OrdemAPI = {
  id: string;
  descricao: string;
  tipo: TipoOS;
  status: StatusAPI;
  dataAgendada: string;
  clienteId: string;
  equipamentoId: string;
  tecnicoId: string | null;
  cliente?: Cliente;
  equipamento?: Equipamento;
  tecnico?: Tecnico | null;
};

const API = 'http://localhost:3333/api';

function obterToken(): string {
  return localStorage.getItem('@crm:token') || '';
}

async function requisicao<T>(
  rota: string,
  opcoes: RequestInit = {}
): Promise<T> {
  const token = obterToken();

  if (!token) {
    throw new Error('Faça login novamente para continuar.');
  }

  const resposta = await fetch(`${API}${rota}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));

    if (resposta.status === 401) {
      localStorage.removeItem('@crm:token');
      localStorage.removeItem('@crm:usuario');
      throw new Error('Sua sessão expirou. Faça login novamente.');
    }

    throw new Error(
      corpo.error || corpo.message || `Erro HTTP ${resposta.status}`
    );
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return resposta.json() as Promise<T>;
}

function exibirStatus(status: StatusAPI): string {
  return {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDO: 'Concluída',
    CANCELADO: 'Cancelada',
  }[status];
}

function exibirData(data: string): string {
  if (!data) return '';
  return new Date(data).toLocaleDateString('pt-BR');
}

function exibirHora(data: string): string {
  if (!data) return '';
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function dataParaFormulario(data: string) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return { data: '', horario: '' };
  }

  const ano = dataConvertida.getFullYear();
  const mes = String(dataConvertida.getMonth() + 1).padStart(2, '0');
  const dia = String(dataConvertida.getDate()).padStart(2, '0');
  const horas = String(dataConvertida.getHours()).padStart(2, '0');
  const minutos = String(dataConvertida.getMinutes()).padStart(2, '0');

  return {
    data: `${ano}-${mes}-${dia}`,
    horario: `${horas}:${minutos}`,
  };
}

const formularioVazio = () => ({
  clienteId: '',
  equipamentoId: '',
  tecnicoId: '',
  tipo: 'PREVENTIVA' as TipoOS,
  data: '',
  horario: '',
  descricao: '',
  status: 'PENDENTE' as StatusAPI,
});

const clienteVazio = () => ({
  nome: '',
  email: '',
  telefone: '',
  endereco: '',
  cnpjCpf: '',
});

const equipamentoVazio = () => ({
  nome: '',
  marca: '',
  modelo: '',
  localizacao: '',
  capacidadeBtu: '',
});

const tecnicoVazio = () => ({
  nome: '',
  email: '',
  senha: '',
});

export function OrdemServico() {
  const [ordens, setOrdens] = useState<OrdemAPI[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [cadastroRapido, setCadastroRapido] =
    useState<CadastroRapido>(null);

  const [osEditando, setOsEditando] = useState<string | null>(null);

  const [formulario, setFormulario] = useState(formularioVazio);
  const [novoCliente, setNovoCliente] = useState(clienteVazio);
  const [novoEquipamento, setNovoEquipamento] =
    useState(equipamentoVazio);
  const [novoTecnico, setNovoTecnico] = useState(tecnicoVazio);

  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [salvandoCadastro, setSalvandoCadastro] = useState(false);
  const [erro, setErro] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');

  async function carregarOrdens() {
    try {
      setErro('');
      const lista = await requisicao<OrdemAPI[]>('/ordens-servico');
      setOrdens(lista);
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : 'Erro ao carregar ordens.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarOrdens();
  }, []);

  async function carregarClientes() {
    const lista = await requisicao<Cliente[]>('/clientes');
    setClientes(lista);
    return lista;
  }

  async function carregarTecnicos() {
    const lista = await requisicao<Tecnico[]>('/tecnicos');
    setTecnicos(lista);
    return lista;
  }

  async function carregarCadastros() {
    try {
      await Promise.all([
        carregarClientes(),
        carregarTecnicos(),
      ]);
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : 'Erro ao carregar cadastros.'
      );
    }
  }

  function abrirNovaOS() {
    setOsEditando(null);
    setFormulario(formularioVazio());
    setCadastroRapido(null);
    setErro('');
    setErroCadastro('');
    setModalAberto(true);

    void carregarCadastros();
  }

  function editarOS(ordem: OrdemAPI) {
    const data = dataParaFormulario(ordem.dataAgendada);

    setOsEditando(ordem.id);
    setFormulario({
      clienteId: ordem.clienteId,
      equipamentoId: ordem.equipamentoId,
      tecnicoId: ordem.tecnicoId || '',
      tipo: ordem.tipo,
      data: data.data,
      horario: data.horario,
      descricao: ordem.descricao,
      status: ordem.status,
    });

    setCadastroRapido(null);
    setErro('');
    setErroCadastro('');
    setModalAberto(true);

    void carregarCadastros();
  }

  function fecharModal() {
    if (salvando || salvandoCadastro) return;

    setModalAberto(false);
    setCadastroRapido(null);
    setOsEditando(null);
  }

  const equipamentos =
    clientes.find(c => c.id === formulario.clienteId)
      ?.equipamentos ?? [];

  function abrirCadastro(tipo: Exclude<CadastroRapido, null>) {
    setErroCadastro('');
    setCadastroRapido(tipo);
  }

  async function salvarCadastro(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();
    setErroCadastro('');
    setSalvandoCadastro(true);

    try {
      if (cadastroRapido === 'cliente') {
        const criado = await requisicao<Cliente>('/clientes', {
          method: 'POST',
          body: JSON.stringify(novoCliente),
        });

        const lista = await carregarClientes();

        if (!lista.some(c => c.id === criado.id)) {
          setClientes(atual => [...atual, criado]);
        }

        setFormulario(atual => ({
          ...atual,
          clienteId: criado.id,
          equipamentoId: '',
        }));

        setNovoCliente(clienteVazio());
      }

      if (cadastroRapido === 'equipamento') {
        if (!formulario.clienteId) {
          throw new Error('Selecione um cliente primeiro.');
        }

        const criado = await requisicao<Equipamento>(
          '/equipamentos',
          {
            method: 'POST',
            body: JSON.stringify({
              ...novoEquipamento,
              capacidadeBtu: Number(novoEquipamento.capacidadeBtu),
              clienteId: formulario.clienteId,
            }),
          }
        );

        await carregarClientes();

        setClientes(atual =>
          atual.map(cliente =>
            cliente.id === formulario.clienteId
              ? {
                  ...cliente,
                  equipamentos: (
                    cliente.equipamentos ?? []
                  ).some(eq => eq.id === criado.id)
                    ? cliente.equipamentos
                    : [...(cliente.equipamentos ?? []), criado],
                }
              : cliente
          )
        );

        setFormulario(atual => ({
          ...atual,
          equipamentoId: criado.id,
        }));

        setNovoEquipamento(equipamentoVazio());
      }

      if (cadastroRapido === 'tecnico') {
        const criado = await requisicao<Tecnico>('/tecnicos', {
          method: 'POST',
          body: JSON.stringify(novoTecnico),
        });

        const lista = await carregarTecnicos();

        if (!lista.some(t => t.id === criado.id)) {
          setTecnicos(atual => [...atual, criado]);
        }

        setFormulario(atual => ({
          ...atual,
          tecnicoId: criado.id,
        }));

        setNovoTecnico(tecnicoVazio());
      }

      setCadastroRapido(null);
    } catch (e) {
      setErroCadastro(
        e instanceof Error
          ? e.message
          : 'Não foi possível salvar o cadastro.'
      );
    } finally {
      setSalvandoCadastro(false);
    }
  }

  async function salvarOS(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      if (
        !formulario.clienteId ||
        !formulario.equipamentoId ||
        !formulario.data ||
        !formulario.horario ||
        !formulario.descricao.trim()
      ) {
        throw new Error('Preencha os campos obrigatórios.');
      }

      const equipamentoValido = equipamentos.some(
        eq => eq.id === formulario.equipamentoId
      );

      if (!equipamentoValido) {
        throw new Error(
          'O equipamento selecionado não pertence ao cliente.'
        );
      }

      const dataSelecionada = new Date(
        `${formulario.data}T${formulario.horario}:00`
      );

      if (Number.isNaN(dataSelecionada.getTime())) {
        throw new Error('Data ou horário inválido.');
      }

      const dados = {
        clienteId: formulario.clienteId,
        equipamentoId: formulario.equipamentoId,
        tecnicoId: formulario.tecnicoId || null,
        tipo: formulario.tipo,
        descricao: formulario.descricao.trim(),
        dataAgendada: dataSelecionada.toISOString(),
        status: formulario.status,
      };

      if (osEditando) {
        await requisicao(`/ordens-servico/${osEditando}`, {
          method: 'PUT',
          body: JSON.stringify(dados),
        });
      } else {
        await requisicao('/ordens-servico', {
          method: 'POST',
          body: JSON.stringify(dados),
        });
      }

      setModalAberto(false);
      setOsEditando(null);
      await carregarOrdens();
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : 'Erro ao salvar OS.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function alterarStatus(id: string, status: StatusAPI) {
    try {
      setErro('');

      await requisicao(`/ordens-servico/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      await carregarOrdens();
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : 'Erro ao atualizar status.'
      );
    }
  }

  async function excluirOS(id: string) {
    const confirmado = window.confirm(
      'Deseja realmente excluir esta Ordem de Serviço?'
    );

    if (!confirmado) return;

    try {
      setErro('');

      await requisicao(`/ordens-servico/${id}`, {
        method: 'DELETE',
      });

      await carregarOrdens();
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : 'Erro ao excluir OS.'
      );
    }
  }

  const filtradas = ordens.filter(ordem =>
    [
      ordem.cliente?.nome,
      ordem.descricao,
      ordem.equipamento?.nome,
      ordem.tecnico?.nome,
    ].some(valor =>
      (valor ?? '').toLowerCase().includes(busca.toLowerCase())
    )
  );

  return (
    <div className="os-container">
      <div className="os-header">
        <div>
          <h1 className="os-titulo">Ordens de Serviço</h1>
          <p className="os-subtitulo">
            Gerencie e acompanhe os serviços da equipe técnica.
          </p>
        </div>

        <button
          type="button"
          className="os-botao-nova"
          onClick={abrirNovaOS}
        >
          <Plus size={18} />
          Nova OS
        </button>
      </div>

      {erro && (
        <p
          role="alert"
          style={{ color: '#c0392b', marginBottom: 16 }}
        >
          {erro}
        </p>
      )}

      <div className="os-resumo">
        <div className="os-resumo-card">
          <ClipboardList size={22} />
          <div>
            <span>Total</span>
            <strong>{ordens.length}</strong>
          </div>
        </div>

        <div className="os-resumo-card">
          <CalendarDays size={22} />
          <div>
            <span>Pendentes</span>
            <strong>
              {ordens.filter(o => o.status === 'PENDENTE').length}
            </strong>
          </div>
        </div>

        <div className="os-resumo-card">
          <Wrench size={22} />
          <div>
            <span>Em andamento</span>
            <strong>
              {ordens.filter(o => o.status === 'EM_ANDAMENTO').length}
            </strong>
          </div>
        </div>
      </div>

      <div className="os-card">
        <div className="os-card-topo">
          <div>
            <h2>Ordens cadastradas</h2>
            <span>{filtradas.length} ordem(ns) encontrada(s)</span>
          </div>

          <div className="os-busca">
            <Search size={17} />
            <input
              type="text"
              placeholder="Buscar cliente, serviço ou técnico..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="os-tabela-container">
          <table className="os-tabela">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data/Hora</th>
                <th>Técnico</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtradas.map(ordem => (
                <tr key={ordem.id}>
                  <td>
                    <strong>
                      {ordem.cliente?.nome ?? 'Cliente não encontrado'}
                    </strong>
                  </td>

                  <td>{ordem.descricao}</td>

                  <td>
                    {exibirData(ordem.dataAgendada)}
                    <span className="os-horario">
                      {exibirHora(ordem.dataAgendada)}
                    </span>
                  </td>

                  <td>
                    <div className="os-tecnico">
                      <UserRound size={15} />
                      {ordem.tecnico?.nome ?? 'Não atribuído'}
                    </div>
                  </td>

                  <td>
                    <select
                      className={`os-status ${
                        exibirStatus(ordem.status)
                          .toLowerCase()
                          .replace(' ', '-')
                          .replace('í', 'i')
                      }`}
                      value={ordem.status}
                      onChange={e =>
                        void alterarStatus(
                          ordem.id,
                          e.target.value as StatusAPI
                        )
                      }
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="EM_ANDAMENTO">Em andamento</option>
                      <option value="CONCLUIDO">Concluída</option>
                      <option value="CANCELADO">Cancelada</option>
                    </select>
                  </td>

                  <td>
                    <div className="os-acoes">
                      <button
                        type="button"
                        className="os-editar"
                        title="Editar OS"
                        onClick={() => editarOS(ordem)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        className="os-excluir"
                        title="Excluir OS"
                        onClick={() => void excluirOS(ordem.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="os-vazio">
                    {carregando
                      ? 'Carregando ordens...'
                      : 'Nenhuma ordem de serviço encontrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div
          className="os-modal-overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget && !cadastroRapido) {
              fecharModal();
            }
          }}
        >
          <div className="os-modal">
            <div className="os-modal-header">
              <div>
                <span className="os-modal-label">
                  Ordem de Serviço
                </span>
                <h2>
                  {osEditando
                    ? 'Editar Ordem de Serviço'
                    : 'Nova Ordem de Serviço'}
                </h2>
                <span className="os-modal-subtitulo">
                  {osEditando
                    ? 'Atualize as informações do serviço.'
                    : 'Cadastre as informações do serviço.'}
                </span>
              </div>

              <button
                type="button"
                className="os-modal-fechar"
                onClick={fecharModal}
              >
                <X size={21} />
              </button>
            </div>

            <div className="os-modal-conteudo">
              <form
                className="os-formulario"
                onSubmit={e => void salvarOS(e)}
              >
                <div className="os-campo">
                  <label htmlFor="cliente">Cliente</label>

                  <div className="os-campo-com-botao">
                    <select
                      id="cliente"
                      required
                      value={formulario.clienteId}
                      onChange={e =>
                        setFormulario(atual => ({
                          ...atual,
                          clienteId: e.target.value,
                          equipamentoId: '',
                        }))
                      }
                    >
                      <option value="">Selecione o cliente</option>
                      {clientes.map(cliente => (
                        <option
                          key={cliente.id}
                          value={cliente.id}
                        >
                          {cliente.nome}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="os-botao-novo-item"
                      onClick={() => abrirCadastro('cliente')}
                    >
                      <Plus size={15} />
                      Novo
                    </button>
                  </div>
                </div>

                <div className="os-campo">
                  <label htmlFor="equipamento">Equipamento</label>

                  <div className="os-campo-com-botao">
                    <select
                      id="equipamento"
                      required
                      disabled={!formulario.clienteId}
                      value={formulario.equipamentoId}
                      onChange={e =>
                        setFormulario(atual => ({
                          ...atual,
                          equipamentoId: e.target.value,
                        }))
                      }
                    >
                      <option value="">
                        Selecione o equipamento
                      </option>

                      {equipamentos.map(equipamento => (
                        <option
                          key={equipamento.id}
                          value={equipamento.id}
                        >
                          {equipamento.nome}
                          {equipamento.modelo
                            ? ` - ${equipamento.modelo}`
                            : ''}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="os-botao-novo-item"
                      disabled={!formulario.clienteId}
                      onClick={() => abrirCadastro('equipamento')}
                    >
                      <Plus size={15} />
                      Novo
                    </button>
                  </div>

                  {!formulario.clienteId && (
                    <small>
                      Selecione um cliente antes do equipamento.
                    </small>
                  )}
                </div>

                <div className="os-campo">
                  <label htmlFor="servico">Tipo de Serviço</label>

                  <select
                    id="servico"
                    value={formulario.tipo}
                    onChange={e =>
                      setFormulario(atual => ({
                        ...atual,
                        tipo: e.target.value as TipoOS,
                      }))
                    }
                  >
                    <option value="PREVENTIVA">
                      Manutenção preventiva
                    </option>
                    <option value="CORRETIVA">
                      Manutenção corretiva
                    </option>
                  </select>
                </div>

                <div className="os-formulario-duplo">
                  <div className="os-campo">
                    <label htmlFor="data">Data</label>
                    <input
                      id="data"
                      type="date"
                      required
                      value={formulario.data}
                      onChange={e =>
                        setFormulario(atual => ({
                          ...atual,
                          data: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="os-campo">
                    <label htmlFor="horario">Horário</label>
                    <input
                      id="horario"
                      type="time"
                      required
                      value={formulario.horario}
                      onChange={e =>
                        setFormulario(atual => ({
                          ...atual,
                          horario: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="os-campo">
                  <label htmlFor="tecnico">
                    Técnico responsável
                  </label>

                  <div className="os-campo-com-botao">
                    <select
                      id="tecnico"
                      value={formulario.tecnicoId}
                      onChange={e =>
                        setFormulario(atual => ({
                          ...atual,
                          tecnicoId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Não atribuído</option>

                      {tecnicos
                        .filter(t => t.role === 'TECNICO')
                        .map(tecnico => (
                          <option
                            key={tecnico.id}
                            value={tecnico.id}
                          >
                            {tecnico.nome}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      className="os-botao-novo-item"
                      onClick={() => abrirCadastro('tecnico')}
                    >
                      <Plus size={15} />
                      Novo
                    </button>
                  </div>
                </div>

                <div className="os-campo">
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    type="text"
                    readOnly
                    placeholder="Preenchido a partir do cliente"
                    value={
                      clientes.find(
                        c => c.id === formulario.clienteId
                      )?.endereco ?? ''
                    }
                  />
                </div>

                <div className="os-campo">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    rows={3}
                    required
                    placeholder="Descreva o serviço..."
                    value={formulario.descricao}
                    onChange={e =>
                      setFormulario(atual => ({
                        ...atual,
                        descricao: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="os-campo">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formulario.status}
                    onChange={e =>
                      setFormulario(atual => ({
                        ...atual,
                        status: e.target.value as StatusAPI,
                      }))
                    }
                  >
                    <option value="PENDENTE">Pendente</option>
                    <option value="EM_ANDAMENTO">Em andamento</option>
                    <option value="CONCLUIDO">Concluída</option>
                    <option value="CANCELADO">Cancelada</option>
                  </select>
                </div>

                <div className="os-formulario-acoes">
                  <button
                    type="button"
                    className="os-botao-cancelar"
                    onClick={fecharModal}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="os-botao-salvar"
                    disabled={salvando}
                  >
                    {osEditando ? (
                      <Pencil size={17} />
                    ) : (
                      <Plus size={18} />
                    )}

                    {salvando
                      ? 'Salvando...'
                      : osEditando
                      ? 'Salvar alterações'
                      : 'Criar OS'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {cadastroRapido && (
        <div
          className="os-modal-overlay"
          style={{ zIndex: 1100 }}
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setCadastroRapido(null);
            }
          }}
        >
          <div
            className="os-modal"
            style={{
              maxWidth: 560,
              width: 'calc(100% - 32px)',
            }}
          >
            <div className="os-modal-header">
              <div>
                <span className="os-modal-label">
                  Cadastro rápido
                </span>
                <h2>
                  Novo{' '}
                  {cadastroRapido === 'cliente'
                    ? 'Cliente'
                    : cadastroRapido === 'equipamento'
                    ? 'Equipamento'
                    : 'Técnico'}
                </h2>
              </div>

              <button
                type="button"
                className="os-modal-fechar"
                onClick={() => setCadastroRapido(null)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="os-modal-conteudo">
              <form
                className="os-formulario"
                onSubmit={e => void salvarCadastro(e)}
              >
                {erroCadastro && (
                  <p
                    role="alert"
                    style={{ color: '#c0392b' }}
                  >
                    {erroCadastro}
                  </p>
                )}

                {cadastroRapido === 'cliente' && (
                  <>
                    <div className="os-campo">
                      <label>Nome</label>
                      <input
                        required
                        value={novoCliente.nome}
                        onChange={e =>
                          setNovoCliente(atual => ({
                            ...atual,
                            nome: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>E-mail</label>
                      <input
                        type="email"
                        required
                        value={novoCliente.email}
                        onChange={e =>
                          setNovoCliente(atual => ({
                            ...atual,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Telefone</label>
                      <input
                        required
                        value={novoCliente.telefone}
                        onChange={e =>
                          setNovoCliente(atual => ({
                            ...atual,
                            telefone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Endereço</label>
                      <input
                        required
                        value={novoCliente.endereco}
                        onChange={e =>
                          setNovoCliente(atual => ({
                            ...atual,
                            endereco: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>CPF/CNPJ</label>
                      <input
                        required
                        value={novoCliente.cnpjCpf}
                        onChange={e =>
                          setNovoCliente(atual => ({
                            ...atual,
                            cnpjCpf: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                {cadastroRapido === 'equipamento' && (
                  <>
                    <p>
                      Cliente:{' '}
                      <strong>
                        {clientes.find(
                          c => c.id === formulario.clienteId
                        )?.nome}
                      </strong>
                    </p>

                    <div className="os-campo">
                      <label>Nome do equipamento</label>
                      <input
                        required
                        value={novoEquipamento.nome}
                        onChange={e =>
                          setNovoEquipamento(atual => ({
                            ...atual,
                            nome: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Marca</label>
                      <input
                        required
                        value={novoEquipamento.marca}
                        onChange={e =>
                          setNovoEquipamento(atual => ({
                            ...atual,
                            marca: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Modelo</label>
                      <input
                        required
                        value={novoEquipamento.modelo}
                        onChange={e =>
                          setNovoEquipamento(atual => ({
                            ...atual,
                            modelo: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Localização</label>
                      <input
                        required
                        value={novoEquipamento.localizacao}
                        onChange={e =>
                          setNovoEquipamento(atual => ({
                            ...atual,
                            localizacao: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Capacidade (BTUs)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={novoEquipamento.capacidadeBtu}
                        onChange={e =>
                          setNovoEquipamento(atual => ({
                            ...atual,
                            capacidadeBtu: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                {cadastroRapido === 'tecnico' && (
                  <>
                    <div className="os-campo">
                      <label>Nome</label>
                      <input
                        required
                        value={novoTecnico.nome}
                        onChange={e =>
                          setNovoTecnico(atual => ({
                            ...atual,
                            nome: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>E-mail</label>
                      <input
                        type="email"
                        required
                        value={novoTecnico.email}
                        onChange={e =>
                          setNovoTecnico(atual => ({
                            ...atual,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="os-campo">
                      <label>Senha inicial</label>
                      <input
                        type="password"
                        minLength={8}
                        required
                        value={novoTecnico.senha}
                        onChange={e =>
                          setNovoTecnico(atual => ({
                            ...atual,
                            senha: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                <div className="os-formulario-acoes">
                  <button
                    type="button"
                    className="os-botao-cancelar"
                    onClick={() => setCadastroRapido(null)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="os-botao-salvar"
                    disabled={salvandoCadastro}
                  >
                    {salvandoCadastro
                      ? 'Salvando...'
                      : 'Salvar cadastro'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
