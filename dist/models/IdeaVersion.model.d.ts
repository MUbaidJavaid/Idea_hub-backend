import { type Document, type Model, type Types } from 'mongoose';
export interface IIdeaVersion {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId;
    versionNumber: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    editedBy: Types.ObjectId;
    createdAt: Date;
}
export type IIdeaVersionDocument = Document<Types.ObjectId, object, IIdeaVersion> & IIdeaVersion;
export type IIdeaVersionModel = Model<IIdeaVersion>;
export declare const IdeaVersion: IIdeaVersionModel;
//# sourceMappingURL=IdeaVersion.model.d.ts.map