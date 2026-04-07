import type { IIdeaAiCoachFeedback, IIdeaDocument } from '../models/Idea.model.js';
export declare function aiCoachFeedbackToApi(f: IIdeaAiCoachFeedback): Record<string, unknown>;
/** Attach coach feedback only when the viewer is the idea author. */
export declare function attachAiCoachForAuthor(idea: IIdeaDocument, payload: Record<string, unknown>, viewerUserId?: string | null): void;
export declare function ideaToApi(idea: IIdeaDocument): Record<string, unknown>;
//# sourceMappingURL=serialize-idea.d.ts.map