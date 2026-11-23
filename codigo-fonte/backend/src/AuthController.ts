
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma.js';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, senha, role } = req.body ?? {};

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

      if (
        role !== undefined &&
        role !== 'ADMIN' &&
        role !== 'TECNICO'
      ) {
        return res.status(400).json({
          error: 'Perfil inválido. Utilize ADMIN ou TECNICO.',
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email: emailNormalizado },
      });

      if (usuarioExiste) {
        return res.status(409).json({
          error: 'E-mail já cadastrado no sistema.',
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome: nome.trim(),
          email: emailNormalizado,
          senha: senhaHash,
          role: role === 'ADMIN' ? 'ADMIN' : 'TECNICO',
        },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      });

      return res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

      return res.status(500).json({
        error: 'Erro ao cadastrar usuário.',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body ?? {};

      if (
        typeof email !== 'string' ||
        typeof senha !== 'string' ||
        !email.trim() ||
        !senha
      ) {
        return res.status(400).json({
          error: 'Informe e-mail e senha.',
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: {
          email: email.trim().toLowerCase(),
        },
      });

      if (!usuario) {
        return res.status(401).json({
          error: 'E-mail ou senha incorretos.',
        });
      }

      const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
      );

      if (!senhaValida) {
        return res.status(401).json({
          error: 'E-mail ou senha incorretos.',
        });
      }

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        return res.status(500).json({
          error: 'JWT_SECRET não configurado no servidor.',
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          role: usuario.role,
        },
        jwtSecret,
        { expiresIn: '1d' }
      );

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
        token,
      });
    } catch (error) {
      console.error('Erro ao realizar login:', error);

      return res.status(500).json({
        error: 'Erro ao realizar login.',
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as Request & { userId?: string }).userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Usuário não autenticado.',
        });
      }

      const { nome, email, senhaAtual, novaSenha } = req.body ?? {};

      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
      });

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado.',
        });
      }

      let senhaHash = usuario.senha;

      if (novaSenha !== undefined) {
        if (
          typeof novaSenha !== 'string' ||
          novaSenha.length < 8
        ) {
          return res.status(400).json({
            error: 'A nova senha deve ter pelo menos 8 caracteres.',
          });
        }

        if (typeof senhaAtual !== 'string') {
          return res.status(400).json({
            error: 'Informe a senha atual.',
          });
        }

        const senhaValida = await bcrypt.compare(
          senhaAtual,
          usuario.senha
        );

        if (!senhaValida) {
          return res.status(400).json({
            error: 'Senha atual incorreta.',
          });
        }

        senhaHash = await bcrypt.hash(novaSenha, 10);
      }

      const novoNome =
        typeof nome === 'string' && nome.trim()
          ? nome.trim()
          : usuario.nome;

      const novoEmail =
        typeof email === 'string' && email.trim()
          ? email.trim().toLowerCase()
          : usuario.email;

      if (novoEmail !== usuario.email) {
        const emailExiste = await prisma.usuario.findUnique({
          where: { email: novoEmail },
        });

        if (emailExiste) {
          return res.status(409).json({
            error: 'Este e-mail já está em uso.',
          });
        }
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id: userId },
        data: {
          nome: novoNome,
          email: novoEmail,
          senha: senhaHash,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      });

      return res.json(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);

      return res.status(500).json({
        error: 'Erro ao atualizar perfil.',
      });
    }
  }
}
