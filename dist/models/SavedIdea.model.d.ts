import { type Document, type Model, type Types } from 'mongoose';
export interface ISavedIdea {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    ideaId: Types.ObjectId;
    createdAt: Date;
}
export type ISavedIdeaDocument = Document<Types.ObjectId, object, ISavedIdea> & ISavedIdea;
export type ISavedIdeaModel = Model<ISavedIdea>;
export declare const SavedIdea: ISavedIdeaModel;
//# sourceMappingURL=SavedIdea.model.d.ts.map