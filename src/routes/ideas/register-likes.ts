import type { Router } from 'express';
import mongoose from 'mongoose';

import { requireAuth } from '../../middleware/require-auth.js';
import { Idea, Like } from '../../models/index.js';
import { requireDb } from './guards.js';

export function registerLikeRoutes(ideasRouter: Router): void {
  ideasRouter.post('/:id/like', requireDb, requireAuth, async (req, res) => {
    const { id: ideaId } = req.params;
    const userId = res.locals.authUserId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({
        success: false,
        message: 'Invalid session',
        data: null,
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid idea id',
        data: null,
      });
      return;
    }

    const ideaOid = new mongoose.Types.ObjectId(ideaId);
    const userOid = new mongoose.Types.ObjectId(userId);

    const ideaExists = await Idea.exists({ _id: ideaOid });
    if (!ideaExists) {
      res.status(404).json({
        success: false,
        message: 'Idea not found',
        data: null,
      });
      return;
    }

    const existing = await Like.findOneAndDelete({
      userId: userOid,
      ideaId: ideaOid,
    });

    if (existing) {
      const idea = await Idea.findById(ideaOid).select('likeCount').lean();
      res.json({
        success: true,
        message: 'OK',
        data: {
          liked: false,
          likeCount: Math.max(0, idea?.likeCount ?? 0),
        },
      });
      return;
    }

    try {
      await Like.create({ userId: userOid, ideaId: ideaOid });
    } catch (err) {
      const dup =
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: number }).code === 11000;
      if (!dup) {
        console.error(err);
        res.status(500).json({
          success: false,
          message: 'Like failed',
          data: null,
        });
        return;
      }
    }

    const idea = await Idea.findById(ideaOid).select('likeCount').lean();
    res.json({
      success: true,
      message: 'OK',
      data: {
        liked: true,
        likeCount: idea?.likeCount ?? 0,
      },
    });
  });
}
