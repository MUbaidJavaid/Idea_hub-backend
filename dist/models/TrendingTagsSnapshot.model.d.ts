import { type Document, type Model, type Types } from 'mongoose';
export interface ITrendingTagRow {
    tag: string;
    score: number;
}
export interface ITrendingTagsSnapshot {
    _id: Types.ObjectId;
    tags: ITrendingTagRow[];
    updatedAt: Date;
}
export type ITrendingTagsSnapshotDocument = Document<Types.ObjectId, object, ITrendingTagsSnapshot> & ITrendingTagsSnapshot;
export type ITrendingTagsSnapshotModel = Model<ITrendingTagsSnapshot>;
export declare const TrendingTagsSnapshot: ITrendingTagsSnapshotModel;
export declare const TRENDING_TAGS_DOC_ID: Types.ObjectId;
//# sourceMappingURL=TrendingTagsSnapshot.model.d.ts.map