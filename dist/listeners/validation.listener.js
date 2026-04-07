import { logger } from '../lib/logger.js';
import { modelEvents, } from '../models/modelEvents.js';
import { scheduleValidationRecalculate } from '../services/ValidationEngine.js';
function onIdeaId(ideaId) {
    scheduleValidationRecalculate(ideaId);
}
export function registerValidationListeners() {
    modelEvents.on('like:created', (p) => {
        onIdeaId(p.ideaId);
    });
    modelEvents.on('like:removed', (p) => {
        onIdeaId(p.ideaId);
    });
    modelEvents.on('collab:request-created', (p) => {
        onIdeaId(p.ideaId);
    });
    modelEvents.on('comment:created', (p) => {
        onIdeaId(p.ideaId);
    });
    logger.child({ module: 'validation' }).info('event listeners registered');
}
//# sourceMappingURL=validation.listener.js.map