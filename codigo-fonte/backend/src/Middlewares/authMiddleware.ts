import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: String;
  role: String;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_default');
    const { id, role } = data as TokenPayload;

    // Injeta o ID e o papel do usuário logado na requisição
    (req as any).userId = id;
    (req as any).userRole = role;

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}