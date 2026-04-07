import { type Document, type Model, type Types } from 'mongoose';
export type IdeaPollOptionKey = 'yes_definitely' | 'maybe' | 'not_for_me' | 'already_exists';
export declare const IDEA_POLL_OPTION_KEYS: IdeaPollOptionKey[];
export declare function isPollOptionKey(s: string): s is IdeaPollOptionKey;
export interface IIdeaPollVote {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId;
    userId: Types.ObjectId;
    optionKey: IdeaPollOptionKey;
    createdAt: Date;
}
export type IIdeaPollVoteDocument = Document<Types.ObjectId, object, IIdeaPollVote> & IIdeaPollVote;
export type IIdeaPollVoteModel = Model<IIdeaPollVote>;
export declare const IdeaPollVote: IIdeaPollVoteModel;
//# sourceMappingURL=IdeaPollVote.model.d.ts.map