import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class AgendamentoController {
  async list(req: Request, res: Response) {
    try {
      const { data, cliente, tecnico, busca } = req.query;

      const where: any = {};

      if (typeof data === 'string' && data.trim()) {
        where.data = data.trim();
      }

      if (typeof cliente === 'string' && cliente.trim()) {
        where.cliente = {
          contains: cliente.trim(),
          mode: 'insensitive',
        };
      }

      if (typeof tecnico === 'string' && tecnico.trim()) {
        where.tecnico = {
          contains: tecnico.trim(),
          mode: 'insensitive',
        };
      }

      if (typeof busca === 'string' && busca.trim()) {
        const termo = busca.trim();
        where.OR = [
          { cliente: { contains: termo, mode: 'insensitive' } },
          { servico: { contains: termo, mode: 'insensitive' } },
          { tecnico: { contains: termo, mode: 'insensitive' } },
          { endereco: { contains: termo, mode: 'insensitive' } },
          { observacoes: { contains: termo, mode: 'insensitive' } },
        ];
      }

      const agendamentos = await prisma.agendamento.findMany({
        where,
        orderBy: [
          { data: 'asc' },
          { horario: 'asc' },
        ],
      });

      return res.json(agendamentos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const agendamento = await prisma.agendamento.findUnique({
        where: { id },
      });

      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      return res.json(agendamento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamento.' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { data, horario, cliente, servico, tecnico, endereco, observacoes } = req.body ?? {};

      if (
        typeof data !== 'string' || !data.trim() ||
        typeof horario !== 'string' || !horario.trim() ||
        typeof cliente !== 'string' || !cliente.trim() ||
        typeof servico !== 'string' || !servico.trim() ||
        typeof tecnico !== 'string' || !tecnico.trim() ||
        typeof endereco !== 'string' || !endereco.trim()
      ) {
        return res.status(400).json({
          error: 'Data, horário, cliente, serviço, técnico e endereço são obrigatórios.',
        });
      }

      const agendamento = await prisma.agendamento.create({
        data: {
          data: data.trim(),
          horario: horario.trim(),
          cliente: cliente.trim(),
          servico: servico.trim(),
          tecnico: tecnico.trim(),
          endereco: endereco.trim(),
          observacoes: typeof observacoes === 'string' && observacoes.trim() ? observacoes.trim() : null,
        },
      });

      return res.status(201).json(agendamento);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar agendamento.' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const agendamento = await prisma.agendamento.findUnique({
        where: { id },
      });

      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      await prisma.agendamento.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir agendamento.' });
    }
  }
}
