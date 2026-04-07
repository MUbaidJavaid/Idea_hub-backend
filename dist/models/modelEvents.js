import { EventEmitter } from 'node:events';
/**
 * Decouples Mongoose hooks from higher-level services (notifications, queues).
 * Register listeners during application bootstrap.
 */
export const modelEvents = new EventEmitter();
//# sourceMappingURL=modelEvents.js.map