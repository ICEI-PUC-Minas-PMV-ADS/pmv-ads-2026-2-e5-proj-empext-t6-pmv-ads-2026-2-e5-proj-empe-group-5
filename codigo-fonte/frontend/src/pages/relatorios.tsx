import React, { useEffect, useState } from 'react';
import { Filter, Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import '../relatorios.css';

interface Relatorio {
  id: string;
  descricao: string;
  dataServico: string;
  cliente: string;
  funcionario: string;
  equipamento: string;
  endereco: string;
}

interface FormularioRelatorio {
  descricao: string;
  cliente: string;
  equipamento: string;
  dataServico: string;
  funcionario: string;
  endereco: string;
}

const formularioVazio: FormularioRelatorio = {
  descricao: '',
  cliente: '',
  equipamento: '',
  dataServico: '',
  funcionario: '',
  endereco: '',
};

const API = 'http://localhost:3333/api/relatorios';

export function Relatorios() {
  const navigate = useNavigate();

  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtro, setFiltro] = useState('');

  const [editando, setEditando] = useState<Relatorio | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioRelatorio>(formularioVazio);
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');

  function obterToken() {
    return localStorage.getItem('@crm:token');
  }

  async function buscarRelatorios() {
    try {
      setLoading(true);
      setErro('');

      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível buscar os relatórios.');
      }

      const data: Relatorio[] = await response.json();
      setRelatorios(data);
    } catch (error) {
      console.error(error);
      setErro('Não foi possível carregar os relatórios.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarRelatorios();
  }, []);

  function formatarData(data: string) {
    // Evita alterar o dia por causa do fuso horário.
    const parteData = data.slice(0, 10);
    const [ano, mes, dia] = parteData.split('-');

    if (!ano || !mes || !dia) {
      return data;
    }

    return `${dia}/${mes}/${ano}`;
  }

  const relatoriosFiltrados = relatorios.filter((relatorio) => {
    const texto = filtro.toLowerCase();

    return (
      relatorio.descricao.toLowerCase().includes(texto) ||
      relatorio.cliente.toLowerCase().includes(texto) ||
      relatorio.funcionario.toLowerCase().includes(texto) ||
      relatorio.equipamento.toLowerCase().includes(texto) ||
      relatorio.endereco.toLowerCase().includes(texto)
    );
  });

  function iniciarEdicao(relatorio: Relatorio) {
    setEditando(relatorio);

    setFormulario({
      descricao: relatorio.descricao,
      cliente: relatorio.cliente,
      equipamento: relatorio.equipamento,
      dataServico: relatorio.dataServico.slice(0, 10),
      funcionario: relatorio.funcionario,
      endereco: relatorio.endereco,
    });

    setErroEdicao('');
  }

  function atualizarCampo(
    campo: keyof FormularioRelatorio,
    valor: string
  ) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function salvarEdicao(evento: React.FormEvent) {
    evento.preventDefault();

    if (!editando) return;

    const camposObrigatorios = Object.values(formulario);

    if (camposObrigatorios.some((campo) => !campo.trim())) {
      setErroEdicao('Preencha todos os campos.');
      return;
    }

    try {
      setSalvando(true);
      setErroEdicao('');

      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API}/${editando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formulario),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Não foi possível atualizar o relatório.'
        );
      }

      setEditando(null);
      await buscarRelatorios();
    } catch (error) {
      console.error(error);

      setErroEdicao(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar o relatório.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirRelatorio(relatorio: Relatorio) {
    const confirmou = window.confirm(
      `Deseja realmente excluir o relatório "${relatorio.descricao}"?`
    );

    if (!confirmou) return;

    try {
      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API}/${relatorio.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Não foi possível excluir o relatório.'
        );
      }

      setRelatorios((atuais) =>
        atuais.filter((item) => item.id !== relatorio.id)
      );
    } catch (error) {
      console.error(error);

      window.alert(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir o relatório.'
      );
    }
  }

  return (
    <div className="relatorios-page">
      <h1 className="relatorios-titulo">Relatórios</h1>

      <button
        className="botao-criar-relatorio"
        onClick={() => navigate('/relatorios/criar')}
      >
        <Plus size={20} />
        Criar relatório
      </button>

      <div className="filtro-container">
        <button
          className="botao-filtro"
          onClick={() => setFiltroAberto(!filtroAberto)}
        >
          <Filter size={18} />
          Filtrar
        </button>

        {filtroAberto && (
          <input
            type="text"
            placeholder="Pesquisar relatório..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="campo-filtro"
          />
        )}
      </div>

      {loading && (
        <p className="mensagem-relatorios">
          Carregando relatórios...
        </p>
      )}

      {erro && (
        <p className="mensagem-relatorios erro">{erro}</p>
      )}

      {!loading && !erro && relatoriosFiltrados.length === 0 && (
        <p className="mensagem-relatorios">
          Nenhum relatório cadastrado.
        </p>
      )}

      <div className="lista-relatorios">
        {relatoriosFiltrados.map((relatorio) => (
          <div key={relatorio.id} className="card-relatorio">
            <div className="cabecalho-card-relatorio">
              <h2>{relatorio.descricao}</h2>

              <div className="acoes-card-relatorio">
                <button
                  type="button"
                  className="botao-editar-relatorio"
                  onClick={() => iniciarEdicao(relatorio)}
                  aria-label="Editar relatório"
                  title="Editar relatório"
                >
                  <Pencil size={17} />
                  Editar
                </button>

                <button
                  type="button"
                  className="botao-excluir-relatorio"
                  onClick={() => excluirRelatorio(relatorio)}
                  aria-label="Excluir relatório"
                  title="Excluir relatório"
                >
                  <Trash2 size={17} />
                  Excluir
                </button>
              </div>
            </div>

            <div className="dados-relatorio">
              <span>Cliente: {relatorio.cliente}</span>
              <span>Equipamento: {relatorio.equipamento}</span>
              <span>
                Data do serviço: {formatarData(relatorio.dataServico)}
              </span>
              <span>Funcionário: {relatorio.funcionario}</span>
              <span>Endereço: {relatorio.endereco}</span>
            </div>
          </div>
        ))}
      </div>

      {editando && (
        <div
          className="fundo-modal-relatorio"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget && !salvando) {
              setEditando(null);
            }
          }}
        >
          <section
            className="modal-relatorio"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-relatorio"
          >
            <div className="cabecalho-modal-relatorio">
              <h2 id="titulo-editar-relatorio">Editar relatório</h2>

              <button
                type="button"
                className="botao-fechar-modal"
                onClick={() => setEditando(null)}
                disabled={salvando}
                aria-label="Fechar"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={salvarEdicao} className="form-relatorio">
              <div className="campo-relatorio">
                <label htmlFor="editar-descricao">
                  Descrição do serviço
                </label>
                <input
                  id="editar-descricao"
                  required
                  value={formulario.descricao}
                  onChange={(e) =>
                    atualizarCampo('descricao', e.target.value)
                  }
                />
              </div>

              <div className="campo-relatorio">
                <label htmlFor="editar-cliente">Nome do cliente</label>
                <input
                  id="editar-cliente"
                  required
                  value={formulario.cliente}
                  onChange={(e) =>
                    atualizarCampo('cliente', e.target.value)
                  }
                />
              </div>

              <div className="campo-relatorio">
                <label htmlFor="editar-equipamento">
                  Nome do equipamento
                </label>
                <input
                  id="editar-equipamento"
                  required
                  value={formulario.equipamento}
                  onChange={(e) =>
                    atualizarCampo('equipamento', e.target.value)
                  }
                />
              </div>

              <div className="campo-relatorio">
                <label htmlFor="editar-data">Data do serviço</label>
                <input
                  id="editar-data"
                  type="date"
                  required
                  value={formulario.dataServico}
                  onChange={(e) =>
                    atualizarCampo('dataServico', e.target.value)
                  }
                />
              </div>

              <div className="campo-relatorio">
                <label htmlFor="editar-funcionario">Funcionário</label>
                <input
                  id="editar-funcionario"
                  required
                  value={formulario.funcionario}
                  onChange={(e) =>
                    atualizarCampo('funcionario', e.target.value)
                  }
                />
              </div>

              <div className="campo-relatorio">
                <label htmlFor="editar-endereco">Endereço</label>
                <input
                  id="editar-endereco"
                  required
                  value={formulario.endereco}
                  onChange={(e) =>
                    atualizarCampo('endereco', e.target.value)
                  }
                />
              </div>

              {erroEdicao && (
                <p className="erro-form-relatorio">{erroEdicao}</p>
              )}

              <div className="acoes-form-relatorio">
                <button
                  type="button"
                  className="botao-cancelar-relatorio"
                  onClick={() => setEditando(null)}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="botao-salvar-relatorio"
                  disabled={salvando}
                >
                  <Save size={18} />
                  {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}