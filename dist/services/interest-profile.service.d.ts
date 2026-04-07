import mongoose from 'mongoose';
import type { BehaviorDeviceType, BehaviorEventSource, BehaviorEventType } from '../models/BehaviorEvent.model.js';
/**
 * Persists a behavior row and nudges the viewer's `interestProfile` from the idea's category/tags.
 */
export declare function recordBehaviorAndUpdateProfile(input: {
    userId: mongoose.Types.ObjectId;
    eventType: BehaviorEventType;
    ideaId: mongoose.Types.ObjectId | null;
    sessionId: string;
    durationMs?: number;
    scrollPercent?: number;
    source: BehaviorEventSource;
    deviceType: BehaviorDeviceType;
}): Promise<void>;
//# sourceMappingURL=interest-profile.service.d.ts.map