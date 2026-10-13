
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Mail, Lock, LogIn } from 'lucide-react';
import '../login.css';

type RespostaLogin = {
  token?: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
  error?: string;
};

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch(
        'http://localhost:3333/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            senha,
          }),
        }
      );

      const dados: RespostaLogin = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || 'Não foi possível entrar.');
      }

      if (!dados.token || !dados.usuario) {
        throw new Error('Resposta de login inválida.');
      }

      localStorage.setItem('@crm:token', dados.token);
      localStorage.setItem(
        '@crm:usuario',
        JSON.stringify(dados.usuario)
      );

      navigate('/', { replace: true });
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao conectar com o servidor.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-pagina">
      <div className="login-card">
        <div className="login-logo">
          <Wind size={30} />
        </div>

        <h1>E-Maintenance</h1>
        <p className="login-subtitulo">
          Sistema de gestão de manutenção e climatização
        </p>

        <h2>Entrar no sistema</h2>
        <p className="login-descricao">
          Informe seus dados para acessar o painel.
        </p>

        <form onSubmit={fazerLogin}>
          <label htmlFor="login-email">E-mail</label>
          <div className="login-input">
            <Mail size={19} />
            <input
              id="login-email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              required
            />
          </div>

          <label htmlFor="login-senha">Senha</label>
          <div className="login-input">
            <Lock size={19} />
            <input
              id="login-senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              required
            />
          </div>

          {erro && <p className="login-erro">{erro}</p>}

          <button
            className="login-botao"
            type="submit"
            disabled={carregando}
          >
            <LogIn size={19} />
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="login-rodape">
          PCM & Climatização v1.0
        </p>
      </div>
    </div>
  );
}
