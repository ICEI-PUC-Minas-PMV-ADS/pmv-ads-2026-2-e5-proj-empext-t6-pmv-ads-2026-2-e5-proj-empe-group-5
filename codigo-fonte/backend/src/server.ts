import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './AuthController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { authMiddleware } from './Middlewares/authMiddleware.js';
import { DashboardController } from './controllers/DashboardController.js';




dotenv.config();



const dashboardController = new DashboardController();
const app = express();
const authController = new AuthController();
const clienteController = new ClienteController();

app.use(cors());
app.use(express.json());

// rota que vai mostrar se a API está rodando
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', message: 'API CRM Climatização rodando com sucesso!' });
});

// Rotas de Autenticação
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));

// Rotas que o JWT PROTEGE (possivelmente todas as controllers entraram aqui!!)
app.use(authMiddleware);
app.put('/api/auth/profile', (req, res) => authController.updateProfile(req, res));
app.get('/api/dashboard/stats', (req, res) => dashboardController.getStats(req, res));

// Rotas de Clientes
app.post('/api/clientes', (req, res) => clienteController.create(req, res));
app.get('/api/clientes', (req, res) => clienteController.list(req, res));
app.get('/api/clientes/:id', (req, res) => clienteController.show(req, res));

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀🚀🚀 Servidor rodando na porta 🚀🚀🚀 ${PORT}`);
});