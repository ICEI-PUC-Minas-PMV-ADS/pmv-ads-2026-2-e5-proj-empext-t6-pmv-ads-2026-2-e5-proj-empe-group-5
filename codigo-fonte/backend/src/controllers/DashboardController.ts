import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const totalClientes = await prisma.cliente.count();
      const totalOS = await prisma.ordemServico.count();
      const osPendentes = await prisma.ordemServico.count({
        where: { status: 'PENDENTE' },
      });
      const osEmAndamento = await prisma.ordemServico.count({
        where: { status: 'EM_ANDAMENTO' },
      });
      const osConcluidas = await prisma.ordemServico.count({
        where: { status: 'CONCLUIDO' },
      });

      
      const ultimasOS = await prisma.ordemServico.findMany({
        take: 5,
        orderBy: { criadoEm: 'desc' },
        include: {
          cliente: { select: { nome: true } },
          tecnico: { select: { nome: true } },
        },
      });

      return res.json({
        totalClientes,
        totalOS,
        osPendentes,
        osEmAndamento,
        osConcluidas,
        ultimasOS,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao carregar dados da dashboard.' });
    }
  }
}