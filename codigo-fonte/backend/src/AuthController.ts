import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma.js';

export class AuthController {
  async register(req: Request, res: Response) {
    const { nome, email, senha, role } = req.body;

    const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ error: 'E-mail já cadastrado no sistema.' });
    }

    const senhaHash = await bcrypt.hash(senha, 8);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: role || 'TECNICO',
      },
      select: { id: true, nome: true, email: true, role: true },
    });

    return res.status(201).json(usuario);
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || 'secret_default',
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
  }

  // Atualizar dados do Perfil MEstre (Nome, E-mail ou Senha)
async updateProfile(req: Request, res: Response) {
  const userId = (req as any).userId; 
  const { nome, email, senhaAtual, novaSenha } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Se for alterar a senha valida a senha atual primeiro
  let senhaHash = usuario.senha;
  if (novaSenha) {
    if (!senhaAtual) {
      return res.status(400).json({ error: 'Informe a senha atual para definir uma nova.' });
    }
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Senha atual incorreta.' });
    }
    senhaHash = await bcrypt.hash(novaSenha, 8);
  }

  const usuarioAtualizado = await prisma.usuario.update({
    where: { id: userId },
    data: {
      nome: nome || usuario.nome,
      email: email || usuario.email,
      senha: senhaHash,
    },
    select: { id: true, nome: true, email: true, role: true },
  });

  return res.json(usuarioAtualizado);
}
}