import React, { useState } from 'react';
import '../cadastroClientes.css';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  equipamento: string;
  servicos: string[];
}

export function CadastroClientes() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [cardExpandido, setCardExpandido] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);

  // Lista de clientes com um registro de exemplo
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: 'Marcia Andrade',
      telefone: '(31)99999999',
      email: 'Marcia@gmail.com',
      endereco: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      equipamento: 'ar com 9000 btus',
      servicos: ['troca de filtro', '', '', '', '']
    }
  ]);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoCliente: Cliente = {
      id: Date.now(),
      nome: `${formData.nome} ${formData.sobrenome}`,
      telefone: formData.telefone,
      email: formData.email,
      endereco: 'Endereço não informado',
      equipamento: 'Sem equipamento registrado',
      servicos: ['', '', '', '', '']
    };

    setClientes([...clientes, novoCliente]);
    alert('Cliente cadastrado com sucesso!');
    setModoCadastro(false);
    setFormData({ nome: '', sobrenome: '', email: '', telefone: '' });
  };

  const confirmarExclusao = () => {
    setClientes([]);
    setMostrarModalExclusao(false);
  };

  return (
    <div className="clientes-container">
      {modoCadastro ? (
        <div>
          <button className="btn-voltar" onClick={() => setModoCadastro(false)}>
            ← Voltar para a lista
          </button>
          <h1 className="titulo-pagina">Cadastro de cliente</h1>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="digite aqui ..."
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sobrenome">Sobrenome</label>
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                placeholder="digite aqui ..."
                value={formData.sobrenome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="digite aqui ..."
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="digite aqui ..."
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button type="submit" className="btn-criar-cliente">
                Registrar-se
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="titulo-pagina">Clientes</h1>

          <div className="clientes-header">
            <button className="btn-criar-cliente" onClick={() => setModoCadastro(true)}>
              criar<br />cliente
            </button>

            <div className="pesquisa-box">
              🔍 <span>pesquisar</span>
            </div>
          </div>

          {clientes.map((cliente) => (
            <div key={cliente.id} className="cliente-card">
              <div className="card-header-info">
                <span className="icon-user">👤</span>
                <div className="cliente-detalhes">
                  <div className="cliente-nome">{cliente.nome}</div>
                  <div className="cliente-contato">
                    <span>tel:{cliente.telefone}</span>
                    <span>email:{cliente.email}</span>
                  </div>
                </div>

                <div className="card-acoes">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon" onClick={() => setMostrarModalExclusao(true)}>
                    🗑️
                  </button>
                </div>
              </div>

              {cardExpandido && (
                <div className="card-expandido">
                  <div><strong>endereço:</strong> {cliente.endereco}</div>
                  <div className="equipamento-info">
                    <strong>equipamento do cliente:</strong> {cliente.equipamento}
                  </div>

                  <div>
                    <strong>Serviços já feitos:</strong>
                    <table className="tabela-servicos">
                      <tbody>
                        {cliente.servicos.map((servico, index) => (
                          <tr key={index}>
                            <td>{servico}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button className="btn-expandir" onClick={() => setCardExpandido(!cardExpandido)}>
                {cardExpandido ? '▲' : '∨'}
              </button>
            </div>
          ))}
        </div>
      )}

      {mostrarModalExclusao && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>excluir cliente?</h3>
            <div className="modal-botoes">
              <button className="btn-modal-nao" onClick={() => setMostrarModalExclusao(false)}>
                não
              </button>
              <button className="btn-modal-sim" onClick={confirmarExclusao}>
                sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroClientes;