import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { AppError } from './errorHandler';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1) Getting token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; iat: number; exp: number };

    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

export const restrictToBandMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bandId = req.params.bandId || req.body.bandId;
    
    if (!bandId) {
      return next(new AppError('Band ID is required', 400));
    }

    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    // Check if user is a member of the band
    const membership = await prisma.bandMember.findUnique({
      where: {
        bandId_userId: {
          bandId,
          userId: req.user.id,
        },
      },
    });

    if (!membership) {
      return next(new AppError('You are not a member of this band', 403));
    }

    next();
  } catch (error) {
    return next(new AppError('Error checking band membership', 500));
  }
};

export const restrictToBandLeader = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bandId = req.params.bandId || req.body.bandId;
    
    if (!bandId) {
      return next(new AppError('Band ID is required', 400));
    }

    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    // Check if user is a leader of the band
    const membership = await prisma.bandMember.findUnique({
      where: {
        bandId_userId: {
          bandId,
          userId: req.user.id,
        },
      },
    });

    if (!membership || membership.role !== 'leader') {
      return next(new AppError('You must be a band leader to perform this action', 403));
    }

    next();
  } catch (error) {
    return next(new AppError('Error checking band leadership', 500));
  }
};
