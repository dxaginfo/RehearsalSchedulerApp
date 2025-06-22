import express from 'express';
import { body, param } from 'express-validator';
import * as bandController from '../controllers/band.controller';
import { protect, restrictToBandLeader, restrictToBandMember } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all bands for the current user
router.get('/', bandController.getUserBands);

// Create a new band
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Band name is required'),
    body('description').optional(),
  ],
  validateRequest,
  bandController.createBand
);

// Get band by ID
router.get(
  '/:bandId',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
  ],
  validateRequest,
  restrictToBandMember,
  bandController.getBandById
);

// Update band
router.patch(
  '/:bandId',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
    body('name').optional().notEmpty().withMessage('Band name cannot be empty'),
    body('description').optional(),
  ],
  validateRequest,
  restrictToBandLeader,
  bandController.updateBand
);

// Get band members
router.get(
  '/:bandId/members',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
  ],
  validateRequest,
  restrictToBandMember,
  bandController.getBandMembers
);

// Invite a new member
router.post(
  '/:bandId/members',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').optional().isIn(['member', 'admin']).withMessage('Role must be member or admin'),
  ],
  validateRequest,
  restrictToBandLeader,
  bandController.inviteMember
);

// Remove a member
router.delete(
  '/:bandId/members/:memberId',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
    param('memberId').isUUID().withMessage('Invalid member ID'),
  ],
  validateRequest,
  restrictToBandLeader,
  bandController.removeMember
);

export { router as bandRoutes };
