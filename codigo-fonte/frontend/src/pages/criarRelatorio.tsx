import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import '../relatorios.css';

interface FormularioRelatorio {
  descricao: string;
  cliente: string;
  equipamento: string;
  dataServico: string;
  funcionario: string;
  endereco: string;
}

export function CriarRelatorio() {
  const navigate = useNavigate();

  const [formulario, setFormulario] =
    useState<FormularioRelatorio>({
      descricao: '',
      cliente: '',
      equipamento: '',
      dataServico: '',
      funcionario: '',
      endereco: '',
    });

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  function atualizarCampo(
    campo: keyof FormularioRelatorio,
    valor: string
  ) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  async function criarRelatorio(
    evento: React.FormEvent
  ) {
    evento.preventDefault();

    setErro('');

    if (
      !formulario.descricao.trim() ||
      !formulario.cliente.trim() ||
      !formulario.equipamento.trim() ||
      !formulario.dataServico ||
      !formulario.funcionario.trim() ||
      !formulario.endereco.trim()
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem('@crm:token');

      const response = await fetch(
        'http://localhost:3333/api/relatorios',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            descricao: formulario.descricao,
            cliente: formulario.cliente,
            equipamento: formulario.equipamento,
            funcionario: formulario.funcionario,
            endereco: formulario.endereco,
            dataServico: formulario.dataServico,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          'Não foi possível criar o relatório.'
        );
      }

      navigate('/relatorios');

    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao criar relatório.'
      );

    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="relatorios-page">

      <button
        className="botao-voltar-relatorio"
        onClick={() => navigate('/relatorios')}
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <h1 className="titulo-criar-relatorio">
        Criar relatório
      </h1>

      <form
        className="form-relatorio"
        onSubmit={criarRelatorio}
      >

        <div className="campo-relatorio">
          <label>
            Descrição do serviço
          </label>

          <input
            type="text"
            placeholder="Ex.: Troca de filtro"
            value={formulario.descricao}
            onChange={(e) =>
              atualizarCampo(
                'descricao',
                e.target.value
              )
            }
          />
        </div>

        <div className="campo-relatorio">
          <label>
            Nome do cliente
          </label>

          <input
            type="text"
            placeholder="Ex.: Claudio Andrade"
            value={formulario.cliente}
            onChange={(e) =>
              atualizarCampo(
                'cliente',
                e.target.value
              )
            }
          />
        </div>

        <div className="campo-relatorio">
          <label>
            Nome do equipamento
          </label>

          <input
            type="text"
            placeholder="Ex.: Ar condicionado 9mil BTUs"
            value={formulario.equipamento}
            onChange={(e) =>
              atualizarCampo(
                'equipamento',
                e.target.value
              )
            }
          />
        </div>

        <div className="campo-relatorio">
          <label>
            Data
          </label>

          <input
            type="date"
            value={formulario.dataServico}
            onChange={(e) =>
              atualizarCampo(
                'dataServico',
                e.target.value
              )
            }
          />
        </div>

        <div className="campo-relatorio">
          <label>
            Funcionário
          </label>

          <input
            type="text"
            placeholder="Ex.: Kleber"
            value={formulario.funcionario}
            onChange={(e) =>
              atualizarCampo(
                'funcionario',
                e.target.value
              )
            }
          />
        </div>

        <div className="campo-relatorio">
          <label>
            Endereço
          </label>

          <input
            type="text"
            placeholder="Ex.: Rua Exemplo, 123"
            value={formulario.endereco}
            onChange={(e) =>
              atualizarCampo(
                'endereco',
                e.target.value
              )
            }
          />
        </div>

        {erro && (
          <div className="erro-form-relatorio">
            {erro}
          </div>
        )}

        <div className="acoes-form-relatorio">

          <button
            type="button"
            className="botao-cancelar-relatorio"
            onClick={() =>
              navigate('/relatorios')
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="botao-salvar-relatorio"
            disabled={salvando}
          >
            <Save size={18} />

            {salvando
              ? 'Salvando...'
              : 'Salvar relatório'}
          </button>

        </div>

      </form>

    </div>
  );
}