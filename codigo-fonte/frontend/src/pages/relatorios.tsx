import React, { useEffect, useState } from 'react';
import { Filter, Plus } from 'lucide-react';
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

export function Relatorios() {
  const navigate = useNavigate();

  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    buscarRelatorios();
  }, []);

  async function buscarRelatorios() {
    try {
      setLoading(true);
      setErro('');

      const token = localStorage.getItem('@crm:token');

      const response = await fetch(
        'http://localhost:3333/api/relatorios',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar os relatórios.');
      }

      const data = await response.json();

      setRelatorios(data);

    } catch (error) {
      console.error(error);

      setErro('Não foi possível carregar os relatórios.');

    } finally {
      setLoading(false);
    }
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

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  return (
    <div className="relatorios-page">

      <h1 className="relatorios-titulo">
        Relatórios
      </h1>

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
        <p className="mensagem-relatorios erro">
          {erro}
        </p>
      )}

      {!loading &&
        !erro &&
        relatoriosFiltrados.length === 0 && (
          <p className="mensagem-relatorios">
            Nenhum relatório cadastrado.
          </p>
        )}

      <div className="lista-relatorios">

        {relatoriosFiltrados.map((relatorio) => (

          <div
            key={relatorio.id}
            className="card-relatorio"
          >

            <h2>
              {relatorio.descricao}
            </h2>

            <div className="dados-relatorio">

              <span>
                cliente: {relatorio.cliente}
              </span>

              <span>
                equipamento: {relatorio.equipamento}
              </span>

              <span>
                data do serviço: {formatarData(relatorio.dataServico)}
              </span>

              <span>
                funcionário: {relatorio.funcionario}
              </span>

              <span>
                endereço: {relatorio.endereco}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}