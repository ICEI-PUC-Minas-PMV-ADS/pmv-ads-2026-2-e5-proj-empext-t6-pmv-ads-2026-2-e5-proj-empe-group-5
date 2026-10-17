import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class AgendamentoController {
  async list(req: Request, res: Response) {
    try {
      const { data, cliente, tecnico, busca } = req.query;

      const where: any = {};

      if (typeof cliente === 'string' && cliente.trim()) {
        where.cliente = {
          nome: {
            contains: cliente.trim(),
            mode: 'insensitive',
          },
        };
      }

      if (typeof tecnico === 'string' && tecnico.trim()) {
        where.tecnico = {
          nome: {
            contains: tecnico.trim(),
            mode: 'insensitive',
          },
        };
      }

      if (typeof busca === 'string' && busca.trim()) {
        const termo = busca.trim();
        where.OR = [
          { descricao: { contains: termo, mode: 'insensitive' } },
          { cliente: { nome: { contains: termo, mode: 'insensitive' } } },
          { cliente: { endereco: { contains: termo, mode: 'insensitive' } } },
          { equipamento: { nome: { contains: termo, mode: 'insensitive' } } },
          { equipamento: { modelo: { contains: termo, mode: 'insensitive' } } },
          { tecnico: { nome: { contains: termo, mode: 'insensitive' } } },
        ];
      }

      const ordens = await prisma.ordemServico.findMany({
        where,
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
              endereco: true,
            },
          },
          equipamento: {
            select: {
              id: true,
              nome: true,
              marca: true,
              modelo: true,
              localizacao: true,
              capacidadeBtu: true,
            },
          },
          tecnico: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          dataAgendada: 'asc',
        },
      });

      const agora = new Date();

      const eventos = ordens.map((os) => {
        const dataObj = new Date(os.dataAgendada);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const horas = String(dataObj.getHours()).padStart(2, '0');
        const minutos = String(dataObj.getMinutes()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;
        const horarioFormatado = `${horas}:${minutos}`;

        let situacaoTemporal: 'ACONTECENDO' | 'ACONTECERA' | 'JA_ACONTECEU';

        if (os.status === 'CONCLUIDO' || os.status === 'CANCELADO') {
          situacaoTemporal = 'JA_ACONTECEU';
        } else if (os.status === 'EM_ANDAMENTO') {
          situacaoTemporal = 'ACONTECENDO';
        } else {
          const diffMs = dataObj.getTime() - agora.getTime();
          const diffHoras = diffMs / (1000 * 60 * 60);

          if (diffHoras < -2) {
            situacaoTemporal = 'JA_ACONTECEU';
          } else if (diffHoras >= -2 && diffHoras <= 2) {
            situacaoTemporal = 'ACONTECENDO';
          } else {
            situacaoTemporal = 'ACONTECERA';
          }
        }

        return {
          id: os.id,
          ordemServicoId: os.id,
          data: dataFormatada,
          horario: horarioFormatado,
          dataAgendada: os.dataAgendada,
          cliente: os.cliente?.nome ?? 'Cliente não informado',
          telefone: os.cliente?.telefone ?? '',
          endereco: os.cliente?.endereco ?? '',
          equipamento: os.equipamento
            ? `${os.equipamento.nome} (${os.equipamento.marca} - ${os.equipamento.modelo})`
            : 'Equipamento não informado',
          equipamentoDetalhes: os.equipamento,
          servico: os.descricao,
          tipo: os.tipo,
          status: os.status,
          concluidoEm: os.concluidoEm,
          tecnico: os.tecnico?.nome ?? 'Não atribuído',
          tecnicoEmail: os.tecnico?.email ?? '',
          situacaoTemporal,
        };
      });

      if (typeof data === 'string' && data.trim()) {
        const eventosFiltradosPorData = eventos.filter((e) => e.data === data.trim());
        return res.json(eventosFiltradosPorData);
      }

      return res.json(eventos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar eventos da agenda.' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const os = await prisma.ordemServico.findUnique({
        where: { id },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
              endereco: true,
            },
          },
          equipamento: {
            select: {
              id: true,
              nome: true,
              marca: true,
              modelo: true,
              localizacao: true,
              capacidadeBtu: true,
            },
          },
          tecnico: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!os) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });
      }

      const dataObj = new Date(os.dataAgendada);
      const ano = dataObj.getFullYear();
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const horas = String(dataObj.getHours()).padStart(2, '0');
      const minutos = String(dataObj.getMinutes()).padStart(2, '0');

      const dataFormatada = `${ano}-${mes}-${dia}`;
      const horarioFormatado = `${horas}:${minutos}`;

      const agora = new Date();
      let situacaoTemporal: 'ACONTECENDO' | 'ACONTECERA' | 'JA_ACONTECEU';

      if (os.status === 'CONCLUIDO' || os.status === 'CANCELADO') {
        situacaoTemporal = 'JA_ACONTECEU';
      } else if (os.status === 'EM_ANDAMENTO') {
        situacaoTemporal = 'ACONTECENDO';
      } else {
        const diffMs = dataObj.getTime() - agora.getTime();
        const diffHoras = diffMs / (1000 * 60 * 60);

        if (diffHoras < -2) {
          situacaoTemporal = 'JA_ACONTECEU';
        } else if (diffHoras >= -2 && diffHoras <= 2) {
          situacaoTemporal = 'ACONTECENDO';
        } else {
          situacaoTemporal = 'ACONTECERA';
        }
      }

      return res.json({
        id: os.id,
        ordemServicoId: os.id,
        data: dataFormatada,
        horario: horarioFormatado,
        dataAgendada: os.dataAgendada,
        cliente: os.cliente?.nome ?? 'Cliente não informado',
        telefone: os.cliente?.telefone ?? '',
        endereco: os.cliente?.endereco ?? '',
        equipamento: os.equipamento
          ? `${os.equipamento.nome} (${os.equipamento.marca} - ${os.equipamento.modelo})`
          : 'Equipamento não informado',
        equipamentoDetalhes: os.equipamento,
        servico: os.descricao,
        tipo: os.tipo,
        status: os.status,
        concluidoEm: os.concluidoEm,
        tecnico: os.tecnico?.nome ?? 'Não atribuído',
        tecnicoEmail: os.tecnico?.email ?? '',
        situacaoTemporal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar evento da agenda.' });
    }
  }
}
