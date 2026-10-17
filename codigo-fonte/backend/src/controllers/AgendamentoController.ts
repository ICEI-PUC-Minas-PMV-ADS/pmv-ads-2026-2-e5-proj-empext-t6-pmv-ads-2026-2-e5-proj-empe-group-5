import type { Request, Response } from 'express';
import { StatusOS, TipoManutencao } from '@prisma/client';
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
          tecnicoId: os.tecnicoId,
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

  async create(req: Request, res: Response) {
    try {
      const {
        descricao,
        tipo,
        dataAgendada,
        clienteId,
        equipamentoId,
        tecnicoId,
        status,
      } = req.body ?? {};

      if (
        typeof descricao !== 'string' ||
        !descricao.trim() ||
        typeof clienteId !== 'string' ||
        !clienteId ||
        typeof equipamentoId !== 'string' ||
        !equipamentoId ||
        typeof dataAgendada !== 'string'
      ) {
        return res.status(400).json({
          error: 'Descrição, cliente, equipamento e data são obrigatórios.',
        });
      }

      const tipoOS = tipo ?? TipoManutencao.PREVENTIVA;
      if (!Object.values(TipoManutencao).includes(tipoOS)) {
        return res.status(400).json({
          error: 'Tipo de manutenção inválido.',
        });
      }

      const data = new Date(dataAgendada);
      if (Number.isNaN(data.getTime())) {
        return res.status(400).json({
          error: 'Data agendada inválida.',
        });
      }

      const novaOS = await prisma.ordemServico.create({
        data: {
          descricao: descricao.trim(),
          tipo: tipoOS,
          status: status ?? StatusOS.PENDENTE,
          dataAgendada: data,
          clienteId,
          equipamentoId,
          tecnicoId: tecnicoId || null,
        },
        include: {
          cliente: {
            select: { id: true, nome: true, telefone: true, email: true, endereco: true },
          },
          equipamento: {
            select: { id: true, nome: true, marca: true, modelo: true, localizacao: true, capacidadeBtu: true },
          },
          tecnico: {
            select: { id: true, nome: true, email: true },
          },
        },
      });

      return res.status(201).json(novaOS);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar agendamento de ordem de serviço.' });
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
        tecnicoId: os.tecnicoId,
        tecnicoEmail: os.tecnico?.email ?? '',
        situacaoTemporal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar evento da agenda.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const atual = await prisma.ordemServico.findUnique({
        where: { id },
      });

      if (!atual) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });
      }

      const {
        descricao,
        tipo,
        status,
        dataAgendada,
        tecnicoId,
      } = req.body ?? {};

      let data: Date | undefined;

      if (dataAgendada !== undefined) {
        if (typeof dataAgendada !== 'string') {
          return res.status(400).json({ error: 'Data inválida.' });
        }

        data = new Date(dataAgendada);

        if (Number.isNaN(data.getTime())) {
          return res.status(400).json({ error: 'Data inválida.' });
        }
      }

      const dadosParaAtualizar: any = {};

      if (typeof descricao === 'string' && descricao.trim()) {
        dadosParaAtualizar.descricao = descricao.trim();
      }

      if (tipo && Object.values(TipoManutencao).includes(tipo)) {
        dadosParaAtualizar.tipo = tipo;
      }

      if (status && Object.values(StatusOS).includes(status)) {
        dadosParaAtualizar.status = status;
        dadosParaAtualizar.concluidoEm =
          status === StatusOS.CONCLUIDO
            ? atual.concluidoEm ?? new Date()
            : null;
      }

      if (data) {
        dadosParaAtualizar.dataAgendada = data;
      }

      if (tecnicoId !== undefined) {
        if (tecnicoId === '' || tecnicoId === null) {
          dadosParaAtualizar.tecnicoId = null;
        } else if (typeof tecnicoId === 'string') {
          dadosParaAtualizar.tecnicoId = tecnicoId;
        }
      }

      const ordemAtualizada = await prisma.ordemServico.update({
        where: { id },
        data: dadosParaAtualizar,
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

      const dataObj = new Date(ordemAtualizada.dataAgendada);
      const ano = dataObj.getFullYear();
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const horas = String(dataObj.getHours()).padStart(2, '0');
      const minutos = String(dataObj.getMinutes()).padStart(2, '0');

      const dataFormatada = `${ano}-${mes}-${dia}`;
      const horarioFormatado = `${horas}:${minutos}`;

      const agora = new Date();
      let situacaoTemporal: 'ACONTECENDO' | 'ACONTECERA' | 'JA_ACONTECEU';

      if (ordemAtualizada.status === 'CONCLUIDO' || ordemAtualizada.status === 'CANCELADO') {
        situacaoTemporal = 'JA_ACONTECEU';
      } else if (ordemAtualizada.status === 'EM_ANDAMENTO') {
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
        id: ordemAtualizada.id,
        ordemServicoId: ordemAtualizada.id,
        data: dataFormatada,
        horario: horarioFormatado,
        dataAgendada: ordemAtualizada.dataAgendada,
        cliente: ordemAtualizada.cliente?.nome ?? 'Cliente não informado',
        telefone: ordemAtualizada.cliente?.telefone ?? '',
        endereco: ordemAtualizada.cliente?.endereco ?? '',
        equipamento: ordemAtualizada.equipamento
          ? `${ordemAtualizada.equipamento.nome} (${ordemAtualizada.equipamento.marca} - ${ordemAtualizada.equipamento.modelo})`
          : 'Equipamento não informado',
        equipamentoDetalhes: ordemAtualizada.equipamento,
        servico: ordemAtualizada.descricao,
        tipo: ordemAtualizada.tipo,
        status: ordemAtualizada.status,
        concluidoEm: ordemAtualizada.concluidoEm,
        tecnico: ordemAtualizada.tecnico?.nome ?? 'Não atribuído',
        tecnicoId: ordemAtualizada.tecnicoId,
        tecnicoEmail: ordemAtualizada.tecnico?.email ?? '',
        situacaoTemporal,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar ordem de serviço.' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const atual = await prisma.ordemServico.findUnique({
        where: { id },
      });

      if (!atual) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });
      }

      await prisma.ordemServico.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir ordem de serviço.' });
    }
  }
}
