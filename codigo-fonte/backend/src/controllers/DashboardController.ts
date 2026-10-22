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

      // Busca os ultimos 5 trem
      const ultimasOS = await prisma.ordemServico.findMany({
        take: 5,
        orderBy: { criadoEm: 'desc' },
        include: {
          cliente: { select: { nome: true } },
          tecnico: { select: { nome: true } },
          equipamento: { select: { nome: true, modelo: true } }, 
        },
      });

      // Mapeia para garantir que a dataAgendada no front-end receba a data correta
      const ultimasOSFormatadas = ultimasOS.map((os: any) => ({
        ...os,
        dataAgendada: os.dataAgendada || os.criadoEm,
      }));

      return res.json({
        totalClientes,
        totalOS,
        osPendentes,
        osEmAndamento,
        osConcluidas,
        ultimasOS: ultimasOSFormatadas,
      });
    } catch (error) {
      console.error('Erro no DashboardController:', error);
      return res.status(500).json({ error: 'Erro ao carregar dados da dashboard.' });
    }
  }
// dale dale na notificação
  async getNotificacoes(req: Request, res: Response) {
    try {
      const hoje = new Date();
      
      // aqui é onde ele vai chamar a data de 6 meses atrás para verificar se o cliente precisa de manutenção preventiva
      const seisMesesAtras = new Date();
      seisMesesAtras.setMonth(hoje.getMonth() - 6);

      // 1. serviços proximos 
      const proximosServicos = await prisma.ordemServico.findMany({
        where: {
          status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
        },
        orderBy: { criadoEm: 'asc' },
        take: 10,
        include: {
          cliente: { select: { nome: true, telefone: true } },
          equipamento: { select: { nome: true, modelo: true } },
          tecnico: { select: { nome: true } },
        },
      });

      // 2. Clientes precisando de Manutenção Preventiva (>6 meses sem serviço ou nunca fizeram)
      const todosClientes = await prisma.cliente.findMany({
        include: {
          ordensServico: {
            where: { status: 'CONCLUIDO' },
            orderBy: { criadoEm: 'desc' },
            take: 1,
          },
          equipamentos: { select: { nome: true, modelo: true } },
        },
      });

      const alertasManutencao = todosClientes
        .map((cliente: any) => {
          const ultimaOS = cliente.ordensServico[0];
          const ultimaData = ultimaOS ? new Date(ultimaOS.criadoEm) : null;
          
          // Se nunca fez OS ou a última foi há mais de 6 meses
          const precisaManutencao = !ultimaData || ultimaData < seisMesesAtras;
          const diasSemManutencao = ultimaData
            ? Math.floor((hoje.getTime() - ultimaData.getTime()) / (1000 * 3600 * 24))
            : null;

          return {
            clienteId: cliente.id,
            nomeCliente: cliente.nome,
            telefone: cliente.telefone || 'Não informado',
            totalEquipamentos: cliente.equipamentos.length,
            ultimaManutencao: ultimaData,
            diasSemManutencao,
            precisaManutencao,
          };
        })
        .filter((item: any) => item.precisaManutencao);

      return res.json({
        proximosServicos,
        alertasManutencao,
      });
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return res.status(500).json({ error: 'Erro ao carregar notificações.' });
    }
  }
}