import React, { useState, useEffect } from 'react';
import '../cadastroClientes.css';

const API_URL = 'http://localhost:3333/api';

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
  const [clienteEditandoId, setClienteEditandoId] = useState<string | null>(null);
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

  useEffect(() => {
    carregarClientes();
  }, []);

  // 1. BUSCAR CLIENTES DO BANCO DE DADOS
  const carregarClientes = async () => {
    try {
      const token = localStorage.getItem('@crm:token');

      const response = await fetch(`${API_URL}/clientes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

  // 2. ABRIR FORMULÁRIO EM MODO DE EDIÇÃO
  const handleEditar = (cliente: Cliente) => {
    setClienteEditandoId(cliente.id);

    const partesNome = cliente.nome ? cliente.nome.split(' ') : [''];
    const primeiroNome = partesNome[0] || '';
    const sobrenome = partesNome.slice(1).join(' ') || '';

    setFormData({
      nome: primeiroNome,
      sobrenome: sobrenome,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      endereco: cliente.endereco || '',
      cnpjCpf: cliente.cnpjCpf || ''
    });

    setModoCadastro(true);
  };

  // 3. CANCELAR / VOLTAR PARA A LISTA
  const handleVoltar = () => {
    setModoCadastro(false);
    setClienteEditandoId(null);
    setFormData({ nome: '', sobrenome: '', email: '', telefone: '', endereco: '', cnpjCpf: '' });
  };

  // 4. SALVAR CLIENTE (NOVO OU EDITADO)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@crm:token');

      const clientePayload = {
        nome: `${formData.nome} ${formData.sobrenome}`.trim(),
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco || 'Endereço não informado',
        cnpjCpf: formData.cnpjCpf || Date.now().toString()
      };

      const url = clienteEditandoId
        ? `${API_URL}/clientes/${clienteEditandoId}`
        : `${API_URL}/clientes`;

      const method = clienteEditandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientePayload)
      });

      if (response.ok) {
        const clienteSalvo = await response.json();

        if (clienteEditandoId) {
          setClientes(clientes.map((c) => (c.id === clienteEditandoId ? clienteSalvo : c)));
          alert('Cliente atualizado com sucesso!');
        } else {
          setClientes([...clientes, clienteSalvo]);
          alert('Cliente cadastrado com sucesso!');
        }

        handleVoltar();
      } else {
        const erroData = await response.json().catch(() => ({}));
        alert(erroData.error || erroData.message || 'Erro ao salvar cliente no servidor.');
      }
    } catch (erro) {
      console.error('Erro ao salvar cliente:', erro);
      alert('Erro de conexão com o servidor.');
    }
  };

  // 5. EXCLUIR CLIENTE
  const confirmarExclusao = async () => {
    if (mostrarModalExclusao) {
      try {
        const token = localStorage.getItem('@crm:token');

        const response = await fetch(`${API_URL}/clientes/${mostrarModalExclusao}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
      c.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.email?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.telefone?.includes(termoBusca)
  );

  return (
    <div className="clientes-container">
      {modoCadastro ? (
        <div className="cadastro-wrapper">
          <button className="btn-voltar" onClick={handleVoltar}>
            ← Voltar para a lista
          </button>
          <h1 className="titulo-pagina">
            {clienteEditandoId ? 'Editar cliente' : 'Cadastro de cliente'}
          </h1>

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
                {clienteEditandoId ? 'Atualizar Cliente' : 'Salvar Cliente'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="lista-wrapper">
          {/* CABEÇALHO */}
          <div className="clientes-header">
            <div className="header-titulo">
              <h1 className="titulo-pagina">Clientes</h1>
              <p className="subtitulo-pagina">Gerencie contatos e dados dos clientes</p>
            </div>

            <div className="clientes-toolbar">
              <div className="busca-container">
                <span className="busca-icon">🔍</span>
                <input
                  type="text"
                  className="busca-input"
                  placeholder="Pesquisar cliente..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              {clientes.length > 0 && (
                <button
                  className="btn-criar-cliente"
                  onClick={() => {
                    handleVoltar();
                    setModoCadastro(true);
                  }}
                >
                  + Criar cliente
                </button>
              )}
            </div>
          </div>

          {/* LISTA OU EMPTY STATE */}
          {clientesFiltrados.length === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state-card">
                <div className="empty-state-icon-bg">👤</div>
                <h2>Nenhum cliente cadastrado</h2>
                <p>
                  {termoBusca
                    ? 'Nenhum cliente encontrado para essa pesquisa.'
                    : 'Cadastre seu primeiro cliente para gerenciar contatos, equipamentos e ordens de serviço.'}
                </p>
                {!termoBusca && (
                  <button
                    className="btn-criar-cliente-empty"
                    onClick={() => {
                      handleVoltar();
                      setModoCadastro(true);
                    }}
                  >
                    + Cadastrar primeiro cliente
                  </button>
                )}
              </div>
            </div>
          ) : (
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
                        <button
                          className="btn-acao btn-editar"
                          title="Editar"
                          onClick={() => handleEditar(cliente)}
                        >
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
                      {isExpanded ? '▲ Recolher' : '▼ Ver mais detalhes'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {/* MODAL DE EXCLUSÃO */}
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