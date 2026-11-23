
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class EquipamentoController {

  // Cadastrar equipamento
  async create(req: Request, res: Response) {
    try {
      const {
        nome,
        marca,
        modelo,
        localizacao,
        capacidadeBtu,
        clienteId,
      } = req.body;

      if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof marca !== 'string' || !marca.trim() ||
        typeof modelo !== 'string' || !modelo.trim() ||
        typeof localizacao !== 'string' || !localizacao.trim() ||
        typeof clienteId !== 'string' || !clienteId ||
        !Number.isInteger(capacidadeBtu) || capacidadeBtu <= 0
      ) {
        return res.status(400).json({
          error: 'Preencha corretamente todos os campos do equipamento.',
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

      const equipamento = await prisma.equipamento.create({
        data: {
          nome: nome.trim(),
          marca: marca.trim(),
          modelo: modelo.trim(),
          localizacao: localizacao.trim(),
          capacidadeBtu,
          clienteId,
        },
      });

      return res.status(201).json(equipamento);

    } catch (erro) {
      console.error('Erro ao cadastrar equipamento:', erro);

      return res.status(500).json({
        error: 'Erro ao cadastrar equipamento.',
      });
    }
  }

  // Listar equipamentos
  async list(req: Request, res: Response) {
    try {
      const equipamentos = await prisma.equipamento.findMany({
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: {
          criadoEm: 'desc',
        },
      });

      return res.json(equipamentos);

    } catch (erro) {
      console.error('Erro ao listar equipamentos:', erro);

      return res.status(500).json({
        error: 'Erro ao listar equipamentos.',
      });
    }
  }

  // Buscar equipamento por ID
  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        return res.status(400).json({
          error: 'ID inválido.',
        });
      }

      const equipamento = await prisma.equipamento.findUnique({
        where: { id },
        include: {
          cliente: true,
        },
      });

      if (!equipamento) {
        return res.status(404).json({
          error: 'Equipamento não encontrado.',
        });
      }

      return res.json(equipamento);

    } catch (erro) {
      console.error('Erro ao buscar equipamento:', erro);

      return res.status(500).json({
        error: 'Erro ao buscar equipamento.',
      });
    }
  }
}
