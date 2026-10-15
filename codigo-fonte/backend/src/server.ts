
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AuthController } from './AuthController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { OrdemServicoController } from './controllers/OrdemServicoController.js';
import { EquipamentoController } from './controllers/EquipamentoController.js';
import { TecnicoController } from './controllers/TecnicoController.js';
import { RelatorioController } from './controllers/RelatorioController.js';
import { authMiddleware } from './Middlewares/authMiddleware.js';

dotenv.config();

const app = express();

const authController = new AuthController();
const clienteController = new ClienteController();
const dashboardController = new DashboardController();
const ordemServicoController = new OrdemServicoController();
const equipamentoController = new EquipamentoController();
const tecnicoController = new TecnicoController();
const relatoriocontroller = new RelatorioController();

app.use(cors());
app.use(express.json());

// Verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    message: 'API CRM Climatização rodando com sucesso!',
  });
});

// ==========================================
// AUTENTICAÇÃO
// ==========================================

// Cadastro público apenas em desenvolvimento local
app.post('/api/auth/register', (req, res, next) => {
  if (
    process.env.NODE_ENV !== 'development' ||
    !['localhost', '127.0.0.1'].includes(req.hostname)
  ) {
    return res.status(403).json({
      error: 'Cadastro público disponível apenas no ambiente local de desenvolvimento.',
    });
  }

  return Promise.resolve(authController.register(req, res)).catch(next);
});

app.post('/api/auth/login', (req, res) =>
  authController.login(req, res)
);

// Todas as rotas abaixo exigem login
app.use(authMiddleware);

// Atualizar perfil
app.put('/api/auth/profile', (req, res) =>
  authController.updateProfile(req, res)
);

// ==========================================
// DASHBOARD & NOTIFICAÇÕES
// ==========================================

app.get('/api/dashboard/stats', (req, res) =>
  dashboardController.getStats(req, res)
);


app.get('/api/notificacoes', (req, res) =>
  dashboardController.getNotificacoes(req, res)
);
// ==========================================
// CLIENTES
// ==========================================

app.post('/api/clientes', (req, res) =>
  clienteController.create(req, res)
);

app.get('/api/clientes', (req, res) =>
  clienteController.list(req, res)
);

app.get('/api/clientes/:id', (req, res) =>
  clienteController.show(req, res)
);

// ==========================================
// EQUIPAMENTOS
// ==========================================

app.post('/api/equipamentos', (req, res) =>
  equipamentoController.create(req, res)
);

app.get('/api/equipamentos', (req, res) =>
  equipamentoController.list(req, res)
);

app.get('/api/equipamentos/:id', (req, res) =>
  equipamentoController.show(req, res)
);

// ==========================================
// TÉCNICOS
// ==========================================

app.get('/api/tecnicos', (req, res) =>
  tecnicoController.list(req, res)
);

// Cadastro de técnicos para usuários autenticados
app.post('/api/tecnicos', (req, res) =>
  tecnicoController.create(req, res)
);

// ==========================================
// ORDENS DE SERVIÇO
// ==========================================

app.post('/api/ordens-servico', (req, res) =>
  ordemServicoController.create(req, res)
);

app.get('/api/ordens-servico', (req, res) =>
  ordemServicoController.list(req, res)
);

app.get('/api/ordens-servico/:id', (req, res) =>
  ordemServicoController.show(req, res)
);

app.put('/api/ordens-servico/:id', (req, res) =>
  ordemServicoController.update(req, res)
);

app.patch('/api/ordens-servico/:id/status', (req, res) =>
  ordemServicoController.updateStatus(req, res)
);

app.delete('/api/ordens-servico/:id', (req, res) =>
  ordemServicoController.remove(req, res)
);

// ==========================================
// RELATÓRIOS
// ==========================================

app.get('/api/relatorios', (req, res) =>
  relatoriocontroller.listar(req, res)
);

app.post('/api/relatorios', (req, res) =>
  relatoriocontroller.criar(req, res)
);

app.put('/api/relatorios/:id', (req, res) =>
  relatoriocontroller.atualizar(req, res)
);

app.delete('/api/relatorios/:id', (req, res) =>
  relatoriocontroller.excluir(req, res)
);



// Iniciar servidor
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
