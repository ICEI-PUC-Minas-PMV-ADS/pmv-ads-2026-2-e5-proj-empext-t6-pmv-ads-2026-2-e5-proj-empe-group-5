
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

export class TecnicoController {
  async list(req: Request, res: Response) {
    try {
      const tecnicos = await prisma.usuario.findMany({
        where: { role: 'TECNICO' },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
        orderBy: { nome: 'asc' },
      });

      return res.json(tecnicos);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao listar técnicos.',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body ?? {};

      if (
        typeof nome !== 'string' ||
        typeof email !== 'string' ||
        typeof senha !== 'string' ||
        !nome.trim() ||
        !email.trim() ||
        senha.length < 8
      ) {
        return res.status(400).json({
          error: 'Informe nome, e-mail e senha com pelo menos 8 caracteres.',
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email: emailNormalizado },
      });

      if (usuarioExiste) {
        return res.status(409).json({
          error: 'Este e-mail já está cadastrado.',
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const tecnico = await prisma.usuario.create({
        data: {
          nome: nome.trim(),
          email: emailNormalizado,
          senha: senhaHash,
          role: 'TECNICO',
        },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      });

      return res.status(201).json(tecnico);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao cadastrar técnico.',
      });
    }
  }
}
