import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Wind, User, Mail, Lock, UserPlus } from 'lucide-react';
import '../login.css';

export function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [cadastrado, setCadastrado] = useState(false);

  async function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (carregando) return;
    setErro('');

    if (!nome.trim()) {
      setErro('Informe seu nome.');
      return;
    }
    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha }),
      });
      const dados = await resposta.json().catch(() => null);
      if (!resposta.ok) {
        throw new Error(dados?.error || 'Não foi possível criar sua conta. Tente novamente.');
      }
      setSenha('');
      setConfirmacao('');
      setCadastrado(true);
    } catch (error) {
      setErro(error instanceof TypeError
        ? 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
        : error instanceof Error ? error.message : 'Erro ao cadastrar usuário.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-pagina">
      <div className="login-card">
        <div className="login-logo"><Wind size={30} aria-hidden="true" /></div>
        <h1>E-Maintenance</h1>
        <p className="login-subtitulo">Sistema de gestão de manutenção e climatização</p>
        <h2>{cadastrado ? 'Conta criada!' : 'Criar sua conta'}</h2>
        {cadastrado ? (
          <>
            <p className="cadastro-sucesso" role="status">Cadastro realizado com sucesso. Use seu e-mail e senha para entrar no sistema.</p>
            <Link className="login-botao" to="/login">Ir para o login</Link>
          </>
        ) : (
          <>
            <p className="login-descricao">Preencha seus dados para se cadastrar.</p>
            <form onSubmit={cadastrar} aria-busy={carregando}>
              <label htmlFor="cadastro-nome">Nome completo</label>
              <div className="login-input">
                <User size={19} aria-hidden="true" />
                <input id="cadastro-nome" autoComplete="name" placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} required disabled={carregando} />
              </div>
              <label htmlFor="cadastro-email">E-mail</label>
              <div className="login-input">
                <Mail size={19} aria-hidden="true" />
                <input id="cadastro-email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={carregando} />
              </div>
              <label htmlFor="cadastro-senha">Senha</label>
              <div className="login-input">
                <Lock size={19} aria-hidden="true" />
                <input id="cadastro-senha" type="password" autoComplete="new-password" minLength={8} aria-describedby="senha-ajuda" placeholder="Crie sua senha" value={senha} onChange={e => setSenha(e.target.value)} required disabled={carregando} />
              </div>
              <p id="senha-ajuda" className="cadastro-ajuda">Use pelo menos 8 caracteres.</p>
              <label htmlFor="cadastro-confirmacao">Confirmar senha</label>
              <div className="login-input">
                <Lock size={19} aria-hidden="true" />
                <input id="cadastro-confirmacao" type="password" autoComplete="new-password" minLength={8} placeholder="Repita sua senha" value={confirmacao} onChange={e => setConfirmacao(e.target.value)} required disabled={carregando} />
              </div>
              {erro && <p className="login-erro" role="alert">{erro}</p>}
              <button className="login-botao" type="submit" disabled={carregando}>
                <UserPlus size={19} aria-hidden="true" />
                {carregando ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>
            <p className="login-link">Já tem conta? <Link to="/login">Entrar</Link></p>
          </>
        )}
        <p className="login-rodape">PCM & Climatização v1.0</p>
      </div>
    </div>
  );
}
