import React, { useState, useEffect } from 'react';
import '../cadastroClientes.css';

const API_URL = 'http://localhost:3333';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cnpjCpf: string;
  equipamentos?: any[];
  servicos?: string[];
}

export function CadastroClientes() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [cardExpandido, setCardExpandido] = useState<string | null>(null);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    endereco: '',
    cnpjCpf: ''
  });

  // 1. CARREGAR CLIENTES DO BANCO AO ABRIR A TELA
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      }
    } catch (erro) {
      console.error('Erro ao buscar clientes da API:', erro);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. ENVIAR NOVO CLIENTE PARA O BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const novoClienteData = {
        nome: `${formData.nome} ${formData.sobrenome}`.trim(),
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco || 'Endereço não informado',
        cnpjCpf: formData.cnpjCpf || Date.now().toString()
      };

      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoClienteData)
      });

      if (response.ok) {
        const novoCliente = await response.json();
        setClientes([...clientes, novoCliente]);
        setModoCadastro(false);
        setFormData({ nome: '', sobrenome: '', email: '', telefone: '', endereco: '', cnpjCpf: '' });
        alert('Cliente cadastrado com sucesso!');
      } else {
        alert('Erro ao cadastrar cliente no servidor.');
      }
    } catch (erro) {
      console.error('Erro ao cadastrar cliente:', erro);
      alert('Erro de conexão com o servidor.');
    }
  };

  // 3. EXCLUIR CLIENTE DO BANCO DE DADOS
  const confirmarExclusao = async () => {
    if (mostrarModalExclusao) {
      try {
        const response = await fetch(`${API_URL}/clientes/${mostrarModalExclusao}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setClientes(clientes.filter((c) => c.id !== mostrarModalExclusao));
          setMostrarModalExclusao(null);
        } else {
          alert('Erro ao excluir cliente.');
        }
      } catch (erro) {
        console.error('Erro ao excluir cliente:', erro);
        alert('Erro de conexão com o servidor.');
      }
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.telefone.includes(termoBusca)
  );

  return (
    <div className="clientes-container">
      {modoCadastro ? (
        <div className="cadastro-wrapper">
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
                placeholder="Digite o nome..."
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
                placeholder="Digite o sobrenome..."
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
                placeholder="exemplo@email.com"
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
                placeholder="(31) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                placeholder="Rua, Número, Bairro..."
                value={formData.endereco}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cnpjCpf">CPF / CNPJ</label>
              <input
                type="text"
                id="cnpjCpf"
                name="cnpjCpf"
                placeholder="000.000.000-00"
                value={formData.cnpjCpf}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-salvar">
                Salvar Cliente
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="lista-wrapper">
          <h1 className="titulo-pagina">Clientes</h1>

          <div className="clientes-toolbar">
            <button className="btn-criar-cliente" onClick={() => setModoCadastro(true)}>
              <span className="icon-plus">+</span> criar cliente
            </button>

            <div className="busca-container">
              <span className="busca-icon">🔍</span>
              <input
                type="text"
                className="busca-input"
                placeholder="pesquisar..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="cards-lista">
            {clientesFiltrados.map((cliente) => {
              const isExpanded = cardExpandido === cliente.id;

              return (
                <div key={cliente.id} className="cliente-card">
                  <div className="card-header-info">
                    <div className="avatar-circle">👤</div>

                    <div className="cliente-detalhes">
                      <h3 className="cliente-nome">{cliente.nome}</h3>
                      <div className="cliente-contato">
                        <span>📞 {cliente.telefone}</span>
                        <span>✉️ {cliente.email}</span>
                      </div>
                    </div>

                    <div className="card-acoes">
                      <button className="btn-acao btn-editar" title="Editar">
                        ✏️
                      </button>
                      <button
                        className="btn-acao btn-deletar"
                        title="Excluir"
                        onClick={() => setMostrarModalExclusao(cliente.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="card-expandido">
                      <div className="info-linha">
                        <strong>Endereço:</strong> {cliente.endereco}
                      </div>
                      <div className="info-linha">
                        <strong>CPF/CNPJ:</strong> {cliente.cnpjCpf}
                      </div>
                    </div>
                  )}

                  <button
                    className="btn-expandir"
                    onClick={() => setCardExpandido(isExpanded ? null : cliente.id)}
                  >
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mostrarModalExclusao && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Deseja excluir este cliente?</h3>
            <p>Esta ação não poderá ser desfeita.</p>
            <div className="modal-botoes">
              <button className="btn-modal-cancelar" onClick={() => setMostrarModalExclusao(null)}>
                Cancelar
              </button>
              <button className="btn-modal-excluir" onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroClientes;