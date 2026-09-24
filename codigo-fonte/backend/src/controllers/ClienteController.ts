import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class ClienteController {
  // Cadastrar 
  async create(req: Request, res: Response) {
    const { nome, email, telefone, endereco, cnpjCpf } = req.body;

    const clienteExiste = await prisma.cliente.findUnique({ where: { cnpjCpf } });
    if (clienteExiste) {
      return res.status(400).json({ error: 'CPF/CNPJ já cadastrado.' });
    }

    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone, endereco, cnpjCpf },
    });

    return res.status(201).json(cliente);
  }

  // Lista dos cliete
  async list(req: Request, res: Response) {
    const clientes = await prisma.cliente.findMany({
      include: {
        equipamentos: true,
        _count: { select: { ordensServico: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });

    return res.json(clientes);
  }

  // Buscar  por ID
async show(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: { equipamentos: true, ordensServico: true },
  });

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente não encontrado.' });
  }

  return res.json(cliente);
}
  }
