import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createBand = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { name, description } = req.body;

    const band = await prisma.band.create({
      data: {
        name,
        description,
        createdBy: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'leader',
          },
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: band,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBands = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const userBands = await prisma.bandMember.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        band: true,
      },
    });

    const bands = userBands.map((membership) => ({
      ...membership.band,
      role: membership.role,
    }));

    res.status(200).json({
      status: 'success',
      results: bands.length,
      data: bands,
    });
  } catch (error) {
    next(error);
  }
};

export const getBandById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { bandId } = req.params;

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

    const band = await prisma.band.findUnique({
      where: {
        id: bandId,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!band) {
      return next(new AppError('Band not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...band,
        role: membership.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBandMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { bandId } = req.params;

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

    const members = await prisma.bandMember.findMany({
      where: {
        bandId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: members.length,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { bandId } = req.params;
    const { email, role } = req.body;

    // Check if user is a leader of the band
    const leadership = await prisma.bandMember.findUnique({
      where: {
        bandId_userId: {
          bandId,
          userId: req.user.id,
        },
      },
    });

    if (!leadership || leadership.role !== 'leader') {
      return next(new AppError('Only band leaders can invite members', 403));
    }

    // Check if user exists
    const userToInvite = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userToInvite) {
      return next(new AppError('User with this email does not exist', 404));
    }

    // Check if user is already a member
    const existingMembership = await prisma.bandMember.findUnique({
      where: {
        bandId_userId: {
          bandId,
          userId: userToInvite.id,
        },
      },
    });

    if (existingMembership) {
      return next(new AppError('User is already a member of this band', 400));
    }

    // Create membership
    const newMembership = await prisma.bandMember.create({
      data: {
        bandId,
        userId: userToInvite.id,
        role: role || 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: newMembership,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { bandId, memberId } = req.params;

    // Check if user is a leader of the band
    const leadership = await prisma.bandMember.findUnique({
      where: {
        bandId_userId: {
          bandId,
          userId: req.user.id,
        },
      },
    });

    if (!leadership || leadership.role !== 'leader') {
      return next(new AppError('Only band leaders can remove members', 403));
    }

    // Check if member exists
    const memberToRemove = await prisma.bandMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!memberToRemove || memberToRemove.bandId !== bandId) {
      return next(new AppError('Member not found in this band', 404));
    }

    // Cannot remove yourself as a leader
    if (memberToRemove.userId === req.user.id) {
      return next(new AppError('You cannot remove yourself from the band', 400));
    }

    // Delete membership
    await prisma.bandMember.delete({
      where: {
        id: memberId,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateBand = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { bandId } = req.params;
    const { name, description } = req.body;

    // Check if user is a leader of the band
    const leadership = await prisma.bandMember.findUnique({
      where: {
        bandId_userId: {
          bandId,
          userId: req.user.id,
        },
      },
    });

    if (!leadership || leadership.role !== 'leader') {
      return next(new AppError('Only band leaders can update the band', 403));
    }

    // Update band
    const updatedBand = await prisma.band.update({
      where: {
        id: bandId,
      },
      data: {
        name,
        description,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedBand,
    });
  } catch (error) {
    next(error);
  }
};
