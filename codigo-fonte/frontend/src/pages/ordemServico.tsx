import React, { useState } from 'react';
import '../ordemServico.css';

// Interface para definir o formato dos dados da Ordem de Serviço
interface OSData {
  id: number;
  cliente: string;
  tipoServico: string;
  data: string;
  funcionario: string;
  descricao: string;
}

export function OrdemServico() {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    cliente: '',
    tipoServico: '',
    data: '',
    funcionario: '',
    descricao: ''
  });

  // Estado para armazenar as OS criadas provisoriamente
  const [historicoOS, setHistoricoOS] = useState<OSData[]>([]);
  
  // Estado para alternar entre a tela de criação e o histórico
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  // Manipulador de mudanças nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipulador de envio do formulário (Criar OS)
  const handleCriarOS = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.cliente || !formData.tipoServico) {
      alert("Por favor, preencha pelo menos o Cliente e o Tipo de Serviço.");
      return;
    }

    const novaOS: OSData = {
      id: Date.now(),
      ...formData
    };

    // Salva provisoriamente no array
    setHistoricoOS(prev => [...prev, novaOS]);
    
    // Limpa o formulário
    setFormData({
      cliente: '',
      tipoServico: '',
      data: '',
      funcionario: '',
      descricao: ''
    });

    alert("Ordem de Serviço criada com sucesso! (Salva provisoriamente)");
  };

  return (
    <div className="os-container">
      <h1 className="os-title">Ordem de Serviço</h1>

      {!mostrarHistorico ? (
        <form className="os-form" onSubmit={handleCriarOS}>
          <div className="os-form-group">
            <label>Cliente</label>
            <input 
              type="text" 
              name="cliente" 
              placeholder="digite aqui ..." 
              value={formData.cliente}
              onChange={handleChange}
            />
          </div>

          <div className="os-form-group">
            <label>Tipo de Serviço</label>
            <input 
              type="text" 
              name="tipoServico" 
              placeholder="digite aqui ..." 
              value={formData.tipoServico}
              onChange={handleChange}
            />
          </div>

          <div className="os-form-group">
            <label>Data</label>
            <input 
              type="text" 
              name="data" 
              placeholder="digite aqui ..." 
              value={formData.data}
              onChange={handleChange}
            />
          </div>

          <div className="os-form-group">
            <label>Funcionário</label>
            <input 
              type="text" 
              name="funcionario" 
              placeholder="digite aqui ..." 
              value={formData.funcionario}
              onChange={handleChange}
            />
          </div>

          <div className="os-form-group">
            <label>Descrição</label>
            <input 
              type="text" 
              name="descricao" 
              placeholder="digite aqui ..." 
              value={formData.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="os-actions">
            <button type="submit" className="btn-criar">Criar OS</button>
            <button 
              type="button" 
              className="btn-historico"
              onClick={() => setMostrarHistorico(true)}
            >
              Histórico de OS
            </button>
          </div>
        </form>
      ) : (
        <div className="os-historico-view">
          <h2>Histórico Provisório</h2>
          {historicoOS.length === 0 ? (
            <p>Nenhuma ordem de serviço criada ainda.</p>
          ) : (
            <ul className="os-list">
              {historicoOS.map(os => (
                <li key={os.id} className="os-list-item">
                  <strong>Cliente:</strong> {os.cliente} | <strong>Serviço:</strong> {os.tipoServico} | <strong>Data:</strong> {os.data}
                </li>
              ))}
            </ul>
          )}
          
          <div className="os-actions" style={{ justifyContent: 'center', marginTop: '30px' }}>
            <button 
              type="button" 
              className="btn-criar"
              onClick={() => setMostrarHistorico(false)}
            >
              Voltar para Criação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}