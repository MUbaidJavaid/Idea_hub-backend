import type { Router } from 'express';
import mongoose from 'mongoose';

import { optionalAuth } from '../../middleware/optional-auth.js';
import { Idea } from '../../models/index.js';
import { mapIdeasForPublicApi } from './map-public.js';
import { requireDb } from './guards.js';

export function registerGetOneRoute(ideasRouter: Router): void {
  ideasRouter.get('/:id', requireDb, optionalAuth, async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid idea id',
        data: null,
      });
      return;
    }
    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404).json({
        success: false,
        message: 'Idea not found',
        data: null,
      });
      return;
    }
    const viewer = res.locals.authUserId as string | undefined;
    const [payload] = await mapIdeasForPublicApi([idea], viewer ?? null);
    res.json({
      success: true,
      message: 'OK',
      data: payload,
    });
  });
}
