
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class RelatorioController {
  // LISTAR RELATÓRIOS
  async listar(req: Request, res: Response) {
    try {
      const relatorios = await prisma.relatorio.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(relatorios);
    } catch (error) {
      console.error('Erro ao listar relatórios:', error);

      return res.status(500).json({
        message: 'Erro interno ao buscar os relatórios.',
      });
    }
  }

  // CRIAR RELATÓRIO
  async criar(req: Request, res: Response) {
    try {
      const {
        descricao,
        dataServico,
        cliente,
        funcionario,
        equipamento,
        endereco,
      } = req.body ?? {};

      const campos = {
        descricao,
        cliente,
        funcionario,
        equipamento,
        endereco,
      };

      for (const [campo, valor] of Object.entries(campos)) {
        if (typeof valor !== 'string' || !valor.trim()) {
          return res.status(400).json({
            message: `O campo ${campo} é obrigatório.`,
          });
        }
      }

      if (typeof dataServico !== 'string' || !dataServico.trim()) {
        return res.status(400).json({
          message: 'A data do serviço é obrigatória.',
        });
      }

      const data = new Date(dataServico);

      if (Number.isNaN(data.getTime())) {
        return res.status(400).json({
          message: 'Data do serviço inválida.',
        });
      }

      const relatorio = await prisma.relatorio.create({
        data: {
          descricao: descricao.trim(),
          cliente: cliente.trim(),
          funcionario: funcionario.trim(),
          equipamento: equipamento.trim(),
          endereco: endereco.trim(),
          dataServico: data,
        },
      });

      return res.status(201).json(relatorio);
    } catch (error) {
      console.error('Erro ao criar relatório:', error);

      return res.status(500).json({
        message: 'Erro interno ao criar o relatório.',
      });
    }
  }

  // EDITAR RELATÓRIO
  async atualizar(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          message: 'ID inválido.',
        });
      }

      const {
        descricao,
        dataServico,
        cliente,
        funcionario,
        equipamento,
        endereco,
      } = req.body ?? {};

      const existente = await prisma.relatorio.findUnique({
        where: { id },
      });

      if (!existente) {
        return res.status(404).json({
          message: 'Relatório não encontrado.',
        });
      }

      const campos = {
        descricao,
        cliente,
        funcionario,
        equipamento,
        endereco,
      };

      for (const [campo, valor] of Object.entries(campos)) {
        if (typeof valor !== 'string' || !valor.trim()) {
          return res.status(400).json({
            message: `O campo ${campo} é obrigatório.`,
          });
        }
      }

      if (typeof dataServico !== 'string' || !dataServico.trim()) {
        return res.status(400).json({
          message: 'A data do serviço é obrigatória.',
        });
      }

      const data = new Date(dataServico);

      if (Number.isNaN(data.getTime())) {
        return res.status(400).json({
          message: 'Data do serviço inválida.',
        });
      }

      const relatorio = await prisma.relatorio.update({
        where: { id },
        data: {
          descricao: descricao.trim(),
          cliente: cliente.trim(),
          funcionario: funcionario.trim(),
          equipamento: equipamento.trim(),
          endereco: endereco.trim(),
          dataServico: data,
        },
      });

      return res.status(200).json(relatorio);
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);

      return res.status(500).json({
        message: 'Erro interno ao atualizar o relatório.',
      });
    }
  }

  // EXCLUIR RELATÓRIO
  async excluir(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          message: 'ID inválido.',
        });
      }

      const existente = await prisma.relatorio.findUnique({
        where: { id },
      });

      if (!existente) {
        return res.status(404).json({
          message: 'Relatório não encontrado.',
        });
      }

      await prisma.relatorio.delete({
        where: { id },
      });

      return res.status(200).json({
        message: 'Relatório excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);

      return res.status(500).json({
        message: 'Erro interno ao excluir o relatório.',
      });
    }
  }
}
