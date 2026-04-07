import { type Document, type Model, type Types } from 'mongoose';
export type CommentStatus = 'visible' | 'hidden' | 'flagged';
export interface IComment {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId;
    authorId: Types.ObjectId;
    parentCommentId: Types.ObjectId | null;
    content: string;
    likeCount: number;
    isEdited: boolean;
    editedAt: Date;
    status: CommentStatus;
    createdAt: Date;
    updatedAt: Date;
}
export type ICommentDocument = Document<Types.ObjectId, object, IComment> & IComment;
export type ICommentModel = Model<IComment>;
export declare const Comment: ICommentModel;
//# sourceMappingURL=Comment.model.d.ts.map