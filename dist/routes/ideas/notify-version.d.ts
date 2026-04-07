import mongoose from 'mongoose';
export declare function notifyFollowersOfIdeaVersion(input: {
    ideaId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    authorDisplay: string;
    ideaTitle: string;
    version: number;
}): Promise<void>;
//# sourceMappingURL=notify-version.d.ts.map