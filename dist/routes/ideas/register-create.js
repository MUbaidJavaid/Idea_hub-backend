import { requireAuth } from '../../middleware/require-auth.js';
import { postCreateIdea } from './post-create-idea.js';
import { requireDb } from './guards.js';
export function registerCreateRoute(ideasRouter) {
    ideasRouter.post('/', requireDb, requireAuth, (req, res) => {
        void postCreateIdea(req, res);
    });
}
//# sourceMappingURL=register-create.js.map