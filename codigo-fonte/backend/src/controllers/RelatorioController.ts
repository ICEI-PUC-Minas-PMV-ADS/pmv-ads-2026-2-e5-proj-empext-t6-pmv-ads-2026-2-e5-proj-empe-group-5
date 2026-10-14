import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function listarRelatorios(
  req: Request,
  res: Response
) {
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

export async function criarRelatorio(
  req: Request,
  res: Response
) {
  try {
    const {
      descricao,
      cliente,
      equipamento,
      dataServico,
      funcionario,
      endereco,
    } = req.body;

    if (
      !descricao ||
      !cliente ||
      !equipamento ||
      !dataServico ||
      !funcionario ||
      !endereco
    ) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios.',
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
        equipamento: equipamento.trim(),
        funcionario: funcionario.trim(),
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