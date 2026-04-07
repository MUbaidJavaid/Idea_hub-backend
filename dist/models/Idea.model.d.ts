import { type Document, type Model, type Types } from 'mongoose';
export type IdeaCategory = 'tech' | 'health' | 'education' | 'environment' | 'finance' | 'social' | 'art' | 'other';
export type IdeaStatus = 'draft' | 'pending_review' | 'ai_scanning' | 'published' | 'rejected' | 'archived' | 'flagged';
export type IdeaVisibility = 'public' | 'private' | 'collaborators_only';
export type IdeaMediaType = 'image' | 'video' | 'pdf' | 'doc' | 'audio' | 'link';
export type MediaScanStatus = 'pending' | 'scanning' | 'approved' | 'rejected';
export type CollaboratorRole = 'contributor' | 'co_author' | 'reviewer' | 'mentor';
export interface IIdeaMedia {
    _id: Types.ObjectId;
    mediaType: IdeaMediaType;
    /** @deprecated Legacy Firebase Storage URL; prefer cdnUrl. */
    firebaseUrl: string;
    /** Cloudinary (or CDN) delivery URL. */
    cdnUrl: string;
    /** Cloudinary public_id for destroy / transforms. */
    publicId: string;
    thumbnailUrl: string;
    fileSizeBytes: number;
    mimeType: string;
    durationSeconds: number;
    scanStatus: MediaScanStatus;
    scanViolations: string[];
    metadata: Record<string, unknown>;
    uploadedAt: Date;
}
export interface IIdeaContentScanReport {
    textScore: number;
    imageScore: number;
    videoScore: number;
    docScore: number;
    violations: string[];
    reviewRequired: boolean;
    scannedAt: Date;
}
export interface IIdeaCollaborator {
    userId: Types.ObjectId;
    role: CollaboratorRole;
    joinedAt: Date;
}
export type IdeaValidationTrend = 'rising' | 'stable' | 'falling';
export interface IIdeaValidationInsights {
    strengths: string[];
    risks: string[];
    suggestedPivots: string[];
}
export interface IIdeaValidationScore {
    total: number;
    communityVotes: number;
    collaboratorWant: number;
    aiMarketScore: number;
    uniquenessScore: number;
    completenessScore: number;
    lastCalculated: Date;
    trend: IdeaValidationTrend;
    breakdown: {
        marketSize: 'small' | 'medium' | 'large' | 'massive';
        competition: 'low' | 'medium' | 'high';
        feasibility: 'hard' | 'medium' | 'easy';
        timing: 'too_early' | 'perfect' | 'too_late';
    };
    insights: IIdeaValidationInsights;
}
export interface IIdeaCoachImprovement {
    issue: string;
    fix: string;
    xpReward: number;
}
export interface IIdeaAiCoachFeedback {
    overallFeedback: string;
    strengths: string[];
    improvements: IIdeaCoachImprovement[];
    marketInsight: string;
    nextStep: string;
    generatedAt: Date;
}
export interface IIdeaPollCounts {
    yes_definitely: number;
    maybe: number;
    not_for_me: number;
    already_exists: number;
}
export interface IIdeaPoll {
    enabled: boolean;
    question: string;
    counts: IIdeaPollCounts;
}
export interface IIdea {
    _id: Types.ObjectId;
    authorId: Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    category: IdeaCategory;
    tags: string[];
    status: IdeaStatus;
    visibility: IdeaVisibility;
    media: IIdeaMedia[];
    contentScanScore: number;
    contentScanReport: IIdeaContentScanReport;
    collaboratorsOpen: boolean;
    requiredSkills: string[];
    collaborators: IIdeaCollaborator[];
    likeCount: number;
    viewCount: number;
    shareCount: number;
    commentCount: number;
    trendingScore: number;
    isFeatured: boolean;
    featuredAt: Date;
    aiSummary: string;
    aiSuggestedTags: string[];
    parentIdeaId?: Types.ObjectId;
    /** Response duet: side-by-side build on another published idea */
    isDuetResponse?: boolean;
    poll?: IIdeaPoll;
    version: number;
    location: string;
    rejectionReason: string;
    validationScore?: IIdeaValidationScore;
    /** Gamification: XP for trending awarded once per idea */
    trendingXpAwarded?: boolean;
    aiCoachFeedback?: IIdeaAiCoachFeedback;
    createdAt: Date;
    updatedAt: Date;
}
export type IIdeaDocument = Document<Types.ObjectId, object, IIdea> & IIdea;
export type IIdeaModel = Model<IIdea>;
export declare const Idea: IIdeaModel;
//# sourceMappingURL=Idea.model.d.ts.map