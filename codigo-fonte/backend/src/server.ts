import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './AuthController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { authMiddleware } from './Middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const authController = new AuthController();
const clienteController = new ClienteController();

app.use(cors());
app.use(express.json());

// Rota pública de teste
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', message: 'API CRM Climatização rodando com sucesso!' });
});

// Rotas de Autenticação
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));

// Rotas Protegidas por JWT
app.use(authMiddleware);

// Rotas de Clientes
app.post('/api/clientes', (req, res) => clienteController.create(req, res));
app.get('/api/clientes', (req, res) => clienteController.list(req, res));
app.get('/api/clientes/:id', (req, res) => clienteController.show(req, res));

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});