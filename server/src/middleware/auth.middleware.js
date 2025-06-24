const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

// Validate request based on express-validator
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Authenticate user with JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user exists
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

// Authorize user based on role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }

    next();
  };
};

// Check if user is part of a group
exports.isGroupMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const { GroupMember } = require('../models');
    const membership = await GroupMember.findOne({
      where: { userId, groupId }
    });

    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Attach membership role to request
    req.groupRole = membership.role;
    next();
  } catch (error) {
    console.error('Group membership check error:', error);
    res.status(500).json({ message: 'Error checking group membership', error: error.message });
  }
};

// Check if user is an admin of a group
exports.isGroupAdmin = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // System admin can access all groups
    if (req.user.role === 'admin') {
      return next();
    }

    const { GroupMember } = require('../models');
    const membership = await GroupMember.findOne({
      where: { userId, groupId, role: 'admin' }
    });

    if (!membership) {
      return res.status(403).json({ message: 'You are not an admin of this group' });
    }

    next();
  } catch (error) {
    console.error('Group admin check error:', error);
    res.status(500).json({ message: 'Error checking group admin status', error: error.message });
  }
};