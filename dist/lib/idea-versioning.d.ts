import { type Types } from 'mongoose';
export declare function createInitialIdeaVersion(input: {
    ideaId: Types.ObjectId;
    title: string;
    description: string;
    category: string;
    tags: string[];
    editedBy: Types.ObjectId;
}): Promise<void>;
/**
 * If a published idea has no rows in `IdeaVersion` (legacy / missed snapshot),
 * create one from the live document so Changelog & diff work.
 */
export declare function ensurePublishedIdeaHasVersionHistory(ideaIdStr: string): Promise<void>;
export declare function appendIdeaVersionSnapshot(input: {
    ideaId: Types.ObjectId;
    nextVersionNumber: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    editedBy: Types.ObjectId;
}): Promise<void>;
export type VersionDiffField = 'title' | 'description' | 'category' | 'tags';
export type IdeaVersionDiff = {
    fromVersion: number;
    toVersion: number;
    changes: Array<{
        field: VersionDiffField;
        before: unknown;
        after: unknown;
    }>;
};
export declare function diffIdeaVersions(a: IIdeaVersionLean, b: IIdeaVersionLean): IdeaVersionDiff;
export type IIdeaVersionLean = {
    versionNumber: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
};
export declare function loadIdeaVersionLean(ideaId: string, versionNumber: number): Promise<IIdeaVersionLean | null>;
//# sourceMappingURL=idea-versioning.d.ts.map