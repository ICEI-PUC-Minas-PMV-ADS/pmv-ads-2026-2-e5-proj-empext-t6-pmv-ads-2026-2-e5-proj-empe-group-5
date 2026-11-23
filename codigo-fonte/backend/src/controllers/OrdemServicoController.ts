
import type { Request, Response } from 'express';
import { Prisma, StatusOS, TipoManutencao } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

const dadosRelacionados = {
  cliente: {
    select: { id: true, nome: true, telefone: true, endereco: true },
  },
  equipamento: {
    select: { id: true, nome: true, marca: true, modelo: true, localizacao: true, capacidadeBtu: true },
  },
  tecnico: {
    select: { id: true, nome: true, email: true },
  },
};

function tratarErro(res: Response, erro: unknown) {
  console.error('Erro na ordem de serviço:', erro);

  if (
    erro instanceof Prisma.PrismaClientKnownRequestError &&
    erro.code === 'P2025'
  ) {
    return res.status(404).json({
      error: 'Registro não encontrado.',
    });
  }

  return res.status(500).json({
    error: 'Erro interno ao processar a ordem de serviço.',
  });
}

export class OrdemServicoController {
  // Listar todas as ordens de serviço
  async list(req: Request, res: Response) {
    try {
      const ordens = await prisma.ordemServico.findMany({
        include: dadosRelacionados,
        orderBy: { dataAgendada: 'asc' },
      });

      return res.json(ordens);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  // Buscar ordem de serviço por ID
  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;

if (typeof id !== 'string') {
  return res.status(400).json({
    error: 'ID da ordem de serviço inválido.',
  });
}

      const ordem = await prisma.ordemServico.findUnique({
        where: { id },
        include: dadosRelacionados,
      });

      if (!ordem) {
        return res.status(404).json({
          error: 'Ordem de serviço não encontrada.',
        });
      }

      return res.json(ordem);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  // Criar uma ordem de serviço
  async create(req: Request, res: Response) {
    try {
      const {
        descricao,
        tipo,
        dataAgendada,
        clienteId,
        equipamentoId,
        tecnicoId,
      } = req.body;

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

      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId },
      });

      if (!cliente) {
        return res.status(404).json({
          error: 'Cliente não encontrado.',
        });
      }

      const equipamento = await prisma.equipamento.findUnique({
        where: { id: equipamentoId },
      });

      if (!equipamento) {
        return res.status(404).json({
          error: 'Equipamento não encontrado.',
        });
      }

      if (equipamento.clienteId !== clienteId) {
        return res.status(400).json({
          error: 'O equipamento não pertence ao cliente informado.',
        });
      }

      if (tecnicoId != null) {
        if (typeof tecnicoId !== 'string') {
          return res.status(400).json({
            error: 'Técnico inválido.',
          });
        }

        const tecnico = await prisma.usuario.findUnique({
          where: { id: tecnicoId },
        });

        if (!tecnico || tecnico.role !== 'TECNICO') {
          return res.status(400).json({
            error: 'Técnico não encontrado ou perfil inválido.',
          });
        }
      }

      const ordem = await prisma.ordemServico.create({
        data: {
          descricao: descricao.trim(),
          tipo: tipoOS,
          dataAgendada: data,
          clienteId,
          equipamentoId,
          tecnicoId: tecnicoId ?? null,
        },
        include: dadosRelacionados,
      });

      return res.status(201).json(ordem);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  // Editar uma ordem de serviço
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;

if (typeof id !== 'string') {
  return res.status(400).json({
    error: 'ID da ordem de serviço inválido.',
  });
}
      const {
        descricao,
        tipo,
        dataAgendada,
        clienteId,
        equipamentoId,
        tecnicoId,
      } = req.body;

      const atual = await prisma.ordemServico.findUnique({
        where: { id },
      });

      if (!atual) {
        return res.status(404).json({
          error: 'Ordem de serviço não encontrada.',
        });
      }

      if (
        descricao !== undefined &&
        (typeof descricao !== 'string' || !descricao.trim())
      ) {
        return res.status(400).json({
          error: 'Descrição inválida.',
        });
      }

      if (
        tipo !== undefined &&
        !Object.values(TipoManutencao).includes(tipo)
      ) {
        return res.status(400).json({
          error: 'Tipo de manutenção inválido.',
        });
      }

      let data: Date | undefined;

      if (dataAgendada !== undefined) {
        if (typeof dataAgendada !== 'string') {
          return res.status(400).json({
            error: 'Data inválida.',
          });
        }

        data = new Date(dataAgendada);

        if (Number.isNaN(data.getTime())) {
          return res.status(400).json({
            error: 'Data inválida.',
          });
        }
      }

      const clienteFinal = clienteId ?? atual.clienteId;
      const equipamentoFinal = equipamentoId ?? atual.equipamentoId;

      if (
        typeof clienteFinal !== 'string' ||
        typeof equipamentoFinal !== 'string'
      ) {
        return res.status(400).json({
          error: 'Cliente ou equipamento inválido.',
        });
      }

      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteFinal },
      });

      const equipamento = await prisma.equipamento.findUnique({
        where: { id: equipamentoFinal },
      });

      if (!cliente || !equipamento) {
        return res.status(404).json({
          error: 'Cliente ou equipamento não encontrado.',
        });
      }

      if (equipamento.clienteId !== clienteFinal) {
        return res.status(400).json({
          error: 'O equipamento não pertence ao cliente informado.',
        });
      }

      if (tecnicoId !== undefined && tecnicoId !== null) {
        if (typeof tecnicoId !== 'string') {
          return res.status(400).json({
            error: 'Técnico inválido.',
          });
        }

        const tecnico = await prisma.usuario.findUnique({
          where: { id: tecnicoId },
        });

        if (!tecnico || tecnico.role !== 'TECNICO') {
          return res.status(400).json({
            error: 'Técnico não encontrado ou perfil inválido.',
          });
        }
      }

      const ordem = await prisma.ordemServico.update({
        where: { id },
        data: {
          ...(descricao !== undefined && {
            descricao: descricao.trim(),
          }),
          ...(tipo !== undefined && { tipo }),
          ...(data !== undefined && { dataAgendada: data }),
          clienteId: clienteFinal,
          equipamentoId: equipamentoFinal,
          ...(tecnicoId !== undefined && { tecnicoId }),
        },
        include: dadosRelacionados,
      });

      return res.json(ordem);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  // Atualizar somente o status
  async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;

if (typeof id !== 'string') {
  return res.status(400).json({
    error: 'ID da ordem de serviço inválido.',
  });
}
      const { status } = req.body;

      if (!Object.values(StatusOS).includes(status)) {
        return res.status(400).json({
          error: 'Status inválido.',
        });
      }

      const atual = await prisma.ordemServico.findUnique({
        where: { id },
      });

      if (!atual) {
        return res.status(404).json({
          error: 'Ordem de serviço não encontrada.',
        });
      }

      const ordem = await prisma.ordemServico.update({
        where: { id },
        data: {
          status,
          concluidoEm:
            status === StatusOS.CONCLUIDO
              ? atual.concluidoEm ?? new Date()
              : null,
        },
        include: dadosRelacionados,
      });

      return res.json(ordem);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  // Excluir uma ordem de serviço
  async remove(req: Request, res: Response) {
    try {
      if ((req as any).userRole !== 'ADMIN') {
        return res.status(403).json({
          error: 'Somente administradores podem excluir ordens de serviço.',
        });
      }

      const id = req.params.id;

if (typeof id !== 'string') {
  return res.status(400).json({
    error: 'ID da ordem de serviço inválido.',
  });
}

      const ordem = await prisma.ordemServico.findUnique({
        where: { id },
      });

      if (!ordem) {
        return res.status(404).json({
          error: 'Ordem de serviço não encontrada.',
        });
      }

      await prisma.ordemServico.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }
}
