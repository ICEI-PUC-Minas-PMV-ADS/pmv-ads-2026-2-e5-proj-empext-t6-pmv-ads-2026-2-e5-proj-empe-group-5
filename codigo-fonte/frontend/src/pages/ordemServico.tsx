import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  Trash2,
  X,
  UserRound,
  CalendarDays,
  Wrench,
} from "lucide-react";

import "../ordemServico.css";

type StatusOS = "Pendente" | "Em andamento" | "Concluída";

type OrdemServico = {
  id: number;
  cliente: string;
  servico: string;
  data: string;
  horario: string;
  tecnico: string;
  endereco: string;
  descricao: string;
  status: StatusOS;
};

type FormularioOS = Omit<OrdemServico, "id">;

const CHAVE_LOCAL_STORAGE = "emmaintenance_ordens_servico";

const clientesDisponiveis = [
  "Hospital Central",
  "Clínica Vida",
  "Empresa Alfa",
  "Shopping Tupanuara",
  "Residencial Jardim",
];

const tecnicosDisponiveis = [
  "Carlos Silva",
  "João Santos",
  "Marcos Oliveira",
];

const ordensIniciais: OrdemServico[] = [
  {
    id: 1,
    cliente: "Empresa Alfa",
    servico: "Manutenção preventiva",
    data: "2026-09-22",
    horario: "09:00",
    tecnico: "Carlos Silva",
    endereco: "Rua Principal, 500",
    descricao: "Realizar manutenção preventiva do equipamento.",
    status: "Pendente",
  },
  {
    id: 2,
    cliente: "Hospital Central",
    servico: "Troca do filtro",
    data: "2026-09-23",
    horario: "14:00",
    tecnico: "João Santos",
    endereco: "Av. Central, 250",
    descricao: "Realizar a troca do filtro do ar-condicionado.",
    status: "Em andamento",
  },
];

function formularioInicial(): FormularioOS {
  return {
    cliente: "",
    servico: "",
    data: "",
    horario: "",
    tecnico: "",
    endereco: "",
    descricao: "",
    status: "Pendente",
  };
}

function formatarData(data: string) {
  if (!data) return "";

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

export function OrdemServico() {
  const [ordens, setOrdens] = useState<OrdemServico[]>(() => {
    try {
      const dadosSalvos = localStorage.getItem(CHAVE_LOCAL_STORAGE);

      if (dadosSalvos) {
        return JSON.parse(dadosSalvos);
      }
    } catch (erro) {
      console.error("Erro ao carregar ordens de serviço:", erro);
    }

    return ordensIniciais;
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] =
    useState<FormularioOS>(formularioInicial());

  useEffect(() => {
    localStorage.setItem(
      CHAVE_LOCAL_STORAGE,
      JSON.stringify(ordens)
    );
  }, [ordens]);

  function abrirModal() {
    setFormulario(formularioInicial());
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario(formularioInicial());
  }

  function atualizarFormulario(
    evento: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function salvarOS(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novaOS: OrdemServico = {
      id: Date.now(),
      ...formulario,
    };

    setOrdens((anteriores) => [...anteriores, novaOS]);

    fecharModal();
  }

  function excluirOS(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta ordem de serviço?"
    );

    if (!confirmar) return;

    setOrdens((anteriores) =>
      anteriores.filter((ordem) => ordem.id !== id)
    );
  }

  function alterarStatus(id: number, status: StatusOS) {
    setOrdens((anteriores) =>
      anteriores.map((ordem) =>
        ordem.id === id
          ? { ...ordem, status }
          : ordem
      )
    );
  }

  const ordensFiltradas = ordens.filter((ordem) => {
    const texto = busca.toLowerCase();

    return (
      ordem.cliente.toLowerCase().includes(texto) ||
      ordem.servico.toLowerCase().includes(texto) ||
      ordem.tecnico.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="os-container">

      {/* CABEÇALHO */}

      <div className="os-header">
        <div>
          <h1 className="os-titulo">
            Ordens de Serviço
          </h1>

          <p className="os-subtitulo">
            Gerencie e acompanhe os serviços da equipe técnica.
          </p>
        </div>

        <button
          type="button"
          className="os-botao-nova"
          onClick={abrirModal}
        >
          <Plus size={18} />
          Nova OS
        </button>
      </div>


      {/* RESUMO */}

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
              {
                ordens.filter(
                  (ordem) => ordem.status === "Pendente"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="os-resumo-card">
          <Wrench size={22} />
          <div>
            <span>Em andamento</span>
            <strong>
              {
                ordens.filter(
                  (ordem) => ordem.status === "Em andamento"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* CARD PRINCIPAL */}

      <div className="os-card">

        <div className="os-card-topo">

          <div>
            <h2>Ordens cadastradas</h2>
            <span>
              {ordensFiltradas.length} ordem(ns) encontrada(s)
            </span>
          </div>

          <div className="os-busca">
            <Search size={17} />

            <input
              type="text"
              placeholder="Buscar cliente, serviço ou técnico..."
              value={busca}
              onChange={(evento) =>
                setBusca(evento.target.value)
              }
            />
          </div>

        </div>


        {/* TABELA */}

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

              {ordensFiltradas.map((ordem) => (

                <tr key={ordem.id}>

                  <td>
                    <strong>{ordem.cliente}</strong>
                  </td>

                  <td>{ordem.servico}</td>

                  <td>
                    {formatarData(ordem.data)}
                    <span className="os-horario">
                      {ordem.horario}
                    </span>
                  </td>

                  <td>
                    <div className="os-tecnico">
                      <UserRound size={15} />
                      {ordem.tecnico}
                    </div>
                  </td>

                  <td>
                    <select
                      className={`os-status ${ordem.status
                        .toLowerCase()
                        .replace(" ", "-")
                        .replace("í", "i")}`}
                      value={ordem.status}
                      onChange={(evento) =>
                        alterarStatus(
                          ordem.id,
                          evento.target.value as StatusOS
                        )
                      }
                    >
                      <option>Pendente</option>
                      <option>Em andamento</option>
                      <option>Concluída</option>
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="os-excluir"
                      onClick={() => excluirOS(ordem.id)}
                      title="Excluir OS"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>

                </tr>

              ))}

              {ordensFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="os-vazio"
                  >
                    Nenhuma ordem de serviço encontrada.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* MODAL NOVA OS */}

      {modalAberto && (

        <div
          className="os-modal-overlay"
          onMouseDown={fecharModal}
        >

          <div
            className="os-modal"
            onMouseDown={(evento) =>
              evento.stopPropagation()
            }
          >

            <div className="os-modal-header">

              <div>
                <span className="os-modal-label">
                  Ordem de Serviço
                </span>

                <h2>Nova Ordem de Serviço</h2>

                <span className="os-modal-subtitulo">
                  Cadastre as informações do serviço.
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
                onSubmit={salvarOS}
              >

                <div className="os-campo">
                  <label htmlFor="cliente">
                    Cliente
                  </label>

                  <select
                    id="cliente"
                    name="cliente"
                    value={formulario.cliente}
                    onChange={atualizarFormulario}
                    required
                  >
                    <option value="">
                      Selecione o cliente
                    </option>

                    {clientesDisponiveis.map((cliente) => (
                      <option
                        key={cliente}
                        value={cliente}
                      >
                        {cliente}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="os-campo">
                  <label htmlFor="servico">
                    Tipo de Serviço
                  </label>

                  <input
                    id="servico"
                    name="servico"
                    type="text"
                    placeholder="Ex.: Manutenção preventiva"
                    value={formulario.servico}
                    onChange={atualizarFormulario}
                    required
                  />
                </div>


                <div className="os-formulario-duplo">

                  <div className="os-campo">
                    <label htmlFor="data">
                      Data
                    </label>

                    <input
                      id="data"
                      name="data"
                      type="date"
                      value={formulario.data}
                      onChange={atualizarFormulario}
                      required
                    />
                  </div>

                  <div className="os-campo">
                    <label htmlFor="horario">
                      Horário
                    </label>

                    <input
                      id="horario"
                      name="horario"
                      type="time"
                      value={formulario.horario}
                      onChange={atualizarFormulario}
                      required
                    />
                  </div>

                </div>


                <div className="os-campo">
                  <label htmlFor="tecnico">
                    Técnico responsável
                  </label>

                  <select
                    id="tecnico"
                    name="tecnico"
                    value={formulario.tecnico}
                    onChange={atualizarFormulario}
                    required
                  >
                    <option value="">
                      Selecione o técnico
                    </option>

                    {tecnicosDisponiveis.map((tecnico) => (
                      <option
                        key={tecnico}
                        value={tecnico}
                      >
                        {tecnico}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="os-campo">
                  <label htmlFor="endereco">
                    Endereço
                  </label>

                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    placeholder="Endereço onde o serviço será realizado"
                    value={formulario.endereco}
                    onChange={atualizarFormulario}
                    required
                  />
                </div>


                <div className="os-campo">
                  <label htmlFor="descricao">
                    Descrição
                  </label>

                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={3}
                    placeholder="Descreva o serviço que deverá ser realizado..."
                    value={formulario.descricao}
                    onChange={atualizarFormulario}
                    required
                  />
                </div>


                <div className="os-campo">
                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formulario.status}
                    onChange={atualizarFormulario}
                  >
                    <option value="Pendente">
                      Pendente
                    </option>

                    <option value="Em andamento">
                      Em andamento
                    </option>

                    <option value="Concluída">
                      Concluída
                    </option>
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
                  >
                    <Plus size={18} />
                    Criar OS
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