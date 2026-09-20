import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Trash2,
  UserRound,
  X
} from 'lucide-react';

import "../agenda.css";

type Agendamento = {
  id: number;
  data: string;
  cliente: string;
  servico: string;
  horario: string;
  tecnico: string;
  endereco: string;
  observacoes: string;
};

type FormularioAgendamento = Omit<Agendamento, "id" | "data">;

const CHAVE_LOCAL_STORAGE = "emmaintenance_agendamentos";

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

/*
 * Enquanto o módulo de clientes não estiver integrado ao banco,
 * vamos usar alguns clientes de exemplo.
 *
 * Depois podemos substituir isso pelos clientes cadastrados
 * no módulo "Clientes".
 */
const clientesDisponiveis = [
  "Hospital Central",
  "Clínica Vida",
  "Empresa Alfa",
  "Shopping Tupanuara",
  "Residencial Jardim"
];

const tecnicosDisponiveis = [
  "Carlos Silva",
  "João Santos",
  "Marcos Oliveira"
];

/*
 * Alguns agendamentos iniciais apenas para demonstrar
 * como a agenda ficará funcionando.
 *
 * Eles serão gravados no localStorage na primeira execução.
 */
const agendamentosIniciais: Agendamento[] = [
  {
    id: 1,
    data: "2026-09-17",
    cliente: "Hospital Central",
    servico: "Troca do filtro do ar-condicionado",
    horario: "08:30",
    tecnico: "Carlos Silva",
    endereco: "Av. Central, 250",
    observacoes: "Verificar também o estado da serpentina."
  },
  {
    id: 2,
    data: "2026-09-17",
    cliente: "Clínica Vida",
    servico: "Manutenção preventiva",
    horario: "14:00",
    tecnico: "João Santos",
    endereco: "Rua das Flores, 120",
    observacoes: ""
  },
  {
    id: 3,
    data: "2026-09-26",
    cliente: "Empresa Alfa",
    servico: "Limpeza do equipamento",
    horario: "09:00",
    tecnico: "Marcos Oliveira",
    endereco: "Rua Principal, 500",
    observacoes: "Levar material de limpeza."
  },
  {
    id: 4,
    data: "2026-09-26",
    cliente: "Shopping Tupanuara",
    servico: "Inspeção do sistema",
    horario: "15:30",
    tecnico: "Carlos Silva",
    endereco: "Av. Brasil, 800",
    observacoes: ""
  }
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

function formularioInicial(): FormularioAgendamento {
  return {
    cliente: "",
    servico: "",
    horario: "",
    tecnico: "",
    endereco: "",
    observacoes: ""
  };
}

export function Agenda() {
  /*
   * O mês começa automaticamente no mês atual.
   */
  const [mesAtual, setMesAtual] = useState<Date>(() => {
    const hoje = new Date();

    return new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      1
    );
  });

  /*
   * Carrega os agendamentos salvos.
   *
   * Se ainda não existir nada salvo, utiliza os exemplos.
   */
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    try {
      const dadosSalvos = localStorage.getItem(
        CHAVE_LOCAL_STORAGE
      );

      if (dadosSalvos) {
        return JSON.parse(dadosSalvos);
      }
    } catch (erro) {
      console.error(
        "Erro ao carregar os agendamentos:",
        erro
      );
    }

    return agendamentosIniciais;
  });

  const [modalAberto, setModalAberto] = useState(false);

  const [dataSelecionada, setDataSelecionada] =
    useState<string | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(true);

  const [formulario, setFormulario] =
    useState<FormularioAgendamento>(
      formularioInicial()
    );

  /*
   * Salva automaticamente qualquer alteração.
   */
  useEffect(() => {
    localStorage.setItem(
      CHAVE_LOCAL_STORAGE,
      JSON.stringify(agendamentos)
    );
  }, [agendamentos]);

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  /*
   * Descobre em qual dia da semana o mês começa.
   *
   * Domingo = 0
   * Segunda = 1
   * ...
   * Sábado = 6
   */
  const primeiroDiaDoMes = new Date(
    ano,
    mes,
    1
  ).getDay();

  /*
   * Descobre quantos dias o mês possui.
   *
   * Isso resolve o problema do calendário anterior,
   * que tinha sempre 31 dias.
   */
  const quantidadeDeDias = new Date(
    ano,
    mes + 1,
    0
  ).getDate();

  /*
   * Cria todas as posições do calendário.
   *
   * As primeiras posições são null para representar
   * os espaços antes do primeiro dia do mês.
   */
  const diasDoCalendario = useMemo(() => {
    return Array.from(
      {
        length:
          primeiroDiaDoMes + quantidadeDeDias
      },
      (_, indice) => {
        if (indice < primeiroDiaDoMes) {
          return null;
        }

        return (
          indice -
          primeiroDiaDoMes +
          1
        );
      }
    );
  }, [
    primeiroDiaDoMes,
    quantidadeDeDias
  ]);

  const dataHoje = obterDataHoje();

  /*
   * Avança ou volta um mês.
   *
   * Não existe limite. O usuário pode ir para
   * meses passados ou futuros.
   */
  function mudarMes(direcao: number) {
    setMesAtual(
      new Date(
        ano,
        mes + direcao,
        1
      )
    );
  }

  /*
   * Volta para o mês atual.
   */
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

  /*
   * Abre o modal ao clicar em um dia.
   */
  function abrirDia(dia: number) {
    const data = criarChaveData(
      ano,
      mes,
      dia
    );

    setDataSelecionada(data);

    setFormulario(
      formularioInicial()
    );

    setMostrarFormulario(true);

    setModalAberto(true);
  }

  /*
   * Fecha o modal.
   */
  function fecharModal() {
    setModalAberto(false);
    setDataSelecionada(null);
    setFormulario(
      formularioInicial()
    );
  }

  /*
   * Atualiza os campos do formulário.
   */
  function atualizarFormulario(
    evento: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {
    const { name, value } =
      evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  /*
   * Salva um novo agendamento.
   */
  function salvarAgendamento(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!dataSelecionada) {
      return;
    }

    const novoAgendamento: Agendamento = {
      id: Date.now(),
      data: dataSelecionada,
      ...formulario
    };

    setAgendamentos(
      (anteriores) => [
        ...anteriores,
        novoAgendamento
      ]
    );

    setFormulario(
      formularioInicial()
    );

    /*
     * Depois de salvar, escondemos o formulário
     * para mostrar os agendamentos atualizados.
     */
    setMostrarFormulario(false);
  }

  /*
   * Exclui um agendamento.
   */
  function excluirAgendamento(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este agendamento?"
    );

    if (!confirmar) {
      return;
    }

    setAgendamentos(
      (anteriores) =>
        anteriores.filter(
          (agendamento) =>
            agendamento.id !== id
        )
    );
  }

  /*
   * Agendamentos do dia atualmente selecionado.
   */
  const agendamentosDoDia =
    dataSelecionada
      ? agendamentos.filter(
          (agendamento) =>
            agendamento.data ===
            dataSelecionada
        )
      : [];

  return (
    <div className="agenda-container">

      {/* CABEÇALHO */}

      <div className="agenda-header">

        <div>
          <h1 className="agenda-titulo">
            Agenda
          </h1>

          <p className="agenda-subtitulo">
            Organize e acompanhe os serviços agendados.
          </p>
        </div>

        <button
          type="button"
          className="agenda-botao-hoje"
          onClick={irParaHoje}
        >
          Hoje
        </button>

      </div>


      {/* CONTROLE DO MÊS */}

      <div className="agenda-periodo">

        <div className="agenda-periodo-info">

          <span className="agenda-mes">
            {meses[mes]}
          </span>

          <span className="agenda-ano">
            {ano}
          </span>

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


      {/* CALENDÁRIO */}

      <div className="agenda-card">

        {/* DIAS DA SEMANA */}

        <div className="agenda-semana">

          {diasSemana.map((dia) => (
            <div
              key={dia}
              className="agenda-dia-semana"
            >
              {dia}
            </div>
          ))}

        </div>


        {/* DIAS */}

        <div className="agenda-grid">

          {diasDoCalendario.map(
            (dia, indice) => {

              /*
               * Espaços vazios antes do início do mês.
               */
              if (dia === null) {
                return (
                  <div
                    key={`vazio-${indice}`}
                    className="agenda-celula vazia"
                  />
                );
              }

              const data = criarChaveData(
                ano,
                mes,
                dia
              );

              const agendamentosDoDiaAtual =
                agendamentos.filter(
                  (agendamento) =>
                    agendamento.data === data
                );

              const ehHoje =
                data === dataHoje;

              return (
                <button
                  type="button"
                  key={data}
                  className={`agenda-celula ${
                    ehHoje
                      ? "dia-atual"
                      : ""
                  } ${
                    agendamentosDoDiaAtual.length > 0
                      ? "tem-agendamento"
                      : ""
                  }`}
                  onClick={() =>
                    abrirDia(dia)
                  }
                >

                  <span className="numero-dia">
                    {dia}
                  </span>


                  {agendamentosDoDiaAtual
                    .slice(0, 2)
                    .map(
                      (agendamento) => (
                        <span
                          key={agendamento.id}
                          className="agenda-evento"
                        >
                          <span className="agenda-ponto" />

                          <span className="agenda-evento-texto">
                            {agendamento.cliente}
                          </span>
                        </span>
                      )
                    )}


                  {agendamentosDoDiaAtual.length >
                    2 && (
                    <span className="agenda-mais">
                      +
                      {agendamentosDoDiaAtual.length -
                        2}{" "}
                      agendamentos
                    </span>
                  )}

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* LEGENDA */}

      <div className="agenda-legenda">

        <span className="agenda-legenda-item">
          <span className="agenda-ponto" />
          Dia com agendamento
        </span>

        <span className="agenda-legenda-item">
          <span className="agenda-circulo-hoje" />
          Hoje
        </span>

      </div>


      {/* MODAL */}

      {modalAberto &&
        dataSelecionada && (

          <div
            className="agenda-modal-overlay"
            onMouseDown={fecharModal}
          >

            <div
              className="agenda-modal"
              onMouseDown={(evento) =>
                evento.stopPropagation()
              }
            >

              {/* CABEÇALHO DO MODAL */}

              <div className="agenda-modal-header">

                <div>

                  <span className="agenda-modal-label">
                    Agendamentos
                  </span>

                  <h2>
                    {formatarDataCompleta(
                      dataSelecionada
                    )}
                  </h2>

                  <span className="agenda-modal-data">
                    {formatarDataCurta(
                      dataSelecionada
                    )}
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


              {/* CONTEÚDO DO MODAL */}

              <div className="agenda-modal-conteudo">

                {/* AGENDAMENTOS EXISTENTES */}

                {agendamentosDoDia.length >
                  0 && (

                  <section className="agenda-secao">

                    <div className="agenda-secao-titulo">

                      <div>
                        <h3>
                          Serviços do dia
                        </h3>

                        <span>
                          {agendamentosDoDia.length}{" "}
                          {agendamentosDoDia.length ===
                          1
                            ? "agendamento"
                            : "agendamentos"}
                        </span>
                      </div>

                    </div>


                    <div className="agenda-lista">

                      {agendamentosDoDia.map(
                        (agendamento) => (

                          <div
                            key={agendamento.id}
                            className="agenda-agendamento"
                          >

                            <div className="agenda-agendamento-topo">

                              <div>

                                <h4>
                                  {
                                    agendamento.cliente
                                  }
                                </h4>

                                <p>
                                  {
                                    agendamento.servico
                                  }
                                </p>

                              </div>

                              <button
                                type="button"
                                className="agenda-botao-excluir"
                                onClick={() =>
                                  excluirAgendamento(
                                    agendamento.id
                                  )
                                }
                                title="Excluir agendamento"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>


                            <div className="agenda-detalhes">

                              <span>
                                <Clock3
                                  size={15}
                                />
                                {
                                  agendamento.horario
                                }
                              </span>

                              <span>
                                <UserRound
                                  size={15}
                                />
                                {
                                  agendamento.tecnico
                                }
                              </span>

                              <span>
                                <MapPin
                                  size={15}
                                />
                                {
                                  agendamento.endereco
                                }
                              </span>

                            </div>


                            {agendamento.observacoes && (
                              <div className="agenda-observacao">
                                <strong>
                                  Observações:
                                </strong>{" "}
                                {
                                  agendamento.observacoes
                                }
                              </div>
                            )}

                          </div>

                        )
                      )}

                    </div>

                  </section>

                )}


                {/* BOTÃO NOVO AGENDAMENTO */}

                {!mostrarFormulario && (

                  <button
                    type="button"
                    className="agenda-botao-novo"
                    onClick={() =>
                      setMostrarFormulario(true)
                    }
                  >
                    <Plus size={18} />
                    Novo agendamento
                  </button>

                )}


                {/* FORMULÁRIO */}

                {mostrarFormulario && (

                  <section className="agenda-secao">

                    <div className="agenda-secao-titulo">

                      <div>

                        <h3>
                          Novo agendamento
                        </h3>

                        <span>
                          Cadastre o serviço que deverá ser realizado.
                        </span>

                      </div>

                    </div>


                    <form
                      className="agenda-formulario"
                      onSubmit={salvarAgendamento}
                    >

                      {/* CLIENTE */}

                      <div className="agenda-campo">

                        <label htmlFor="cliente">
                          Cliente
                        </label>

                        <select
                          id="cliente"
                          name="cliente"
                          value={formulario.cliente}
                          onChange={
                            atualizarFormulario
                          }
                          required
                        >

                          <option value="">
                            Selecione o cliente
                          </option>

                          {clientesDisponiveis.map(
                            (cliente) => (
                              <option
                                key={cliente}
                                value={cliente}
                              >
                                {cliente}
                              </option>
                            )
                          )}

                        </select>

                      </div>


                      {/* SERVIÇO */}

                      <div className="agenda-campo">

                        <label htmlFor="servico">
                          Serviço
                        </label>

                        <input
                          id="servico"
                          name="servico"
                          type="text"
                          placeholder="Ex.: Troca do filtro do ar-condicionado"
                          value={formulario.servico}
                          onChange={
                            atualizarFormulario
                          }
                          required
                        />

                      </div>


                      <div className="agenda-formulario-duplo">

                        {/* HORÁRIO */}

                        <div className="agenda-campo">

                          <label htmlFor="horario">
                            Horário
                          </label>

                          <input
                            id="horario"
                            name="horario"
                            type="time"
                            value={
                              formulario.horario
                            }
                            onChange={
                              atualizarFormulario
                            }
                            required
                          />

                        </div>


                        {/* TÉCNICO */}

                        <div className="agenda-campo">

                          <label htmlFor="tecnico">
                            Técnico responsável
                          </label>

                          <select
                            id="tecnico"
                            name="tecnico"
                            value={
                              formulario.tecnico
                            }
                            onChange={
                              atualizarFormulario
                            }
                            required
                          >

                            <option value="">
                              Selecione o técnico
                            </option>

                            {tecnicosDisponiveis.map(
                              (tecnico) => (
                                <option
                                  key={tecnico}
                                  value={tecnico}
                                >
                                  {tecnico}
                                </option>
                              )
                            )}

                          </select>

                        </div>

                      </div>


                      {/* ENDEREÇO */}

                      <div className="agenda-campo">

                        <label htmlFor="endereco">
                          Endereço
                        </label>

                        <input
                          id="endereco"
                          name="endereco"
                          type="text"
                          placeholder="Endereço onde o serviço será realizado"
                          value={
                            formulario.endereco
                          }
                          onChange={
                            atualizarFormulario
                          }
                          required
                        />

                      </div>


                      {/* OBSERVAÇÕES */}

                      <div className="agenda-campo">

                        <label htmlFor="observacoes">
                          Observações
                        </label>

                        <textarea
                          id="observacoes"
                          name="observacoes"
                          rows={3}
                          placeholder="Informações adicionais sobre o atendimento..."
                          value={
                            formulario.observacoes
                          }
                          onChange={
                            atualizarFormulario
                          }
                        />

                      </div>


                      {/* BOTÕES */}

                      <div className="agenda-formulario-acoes">

                        <button
                          type="button"
                          className="agenda-botao-cancelar"
                          onClick={() => {
                            setFormulario(
                              formularioInicial()
                            );

                            if (
                              agendamentosDoDia.length >
                              0
                            ) {
                              setMostrarFormulario(
                                false
                              );
                            }
                          }}
                        >
                          Cancelar
                        </button>

                        <button
                          type="submit"
                          className="agenda-botao-salvar"
                        >
                          <Plus size={18} />
                          Salvar agendamento
                        </button>

                      </div>

                    </form>

                  </section>

                )}

              </div>

            </div>

          </div>
        )}

    </div>
  );
}