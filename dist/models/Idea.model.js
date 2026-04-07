import mongoose, { Schema, } from 'mongoose';
import shortid from 'shortid';
import slugifyModule from 'slugify';
const slugify = slugifyModule;
const ideaMediaSchema = new Schema({
    mediaType: {
        type: String,
        enum: {
            values: ['image', 'video', 'pdf', 'doc', 'audio', 'link'],
            message: '{VALUE} is not a valid media type',
        },
        required: true,
    },
    firebaseUrl: { type: String, default: '', trim: true, maxlength: 2048 },
    cdnUrl: { type: String, default: '', trim: true, maxlength: 2048 },
    publicId: { type: String, default: '', trim: true, maxlength: 512 },
    thumbnailUrl: { type: String, default: '', trim: true, maxlength: 2048 },
    fileSizeBytes: { type: Number, default: 0, min: 0 },
    mimeType: { type: String, default: '', trim: true, maxlength: 200 },
    durationSeconds: { type: Number, default: 0, min: 0 },
    scanStatus: {
        type: String,
        enum: ['pending', 'scanning', 'approved', 'rejected'],
        default: 'pending',
    },
    scanViolations: { type: [String], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
    uploadedAt: { type: Date, default: () => new Date() },
}, { _id: true });
ideaMediaSchema.pre('validate', function mediaUrlPreValidate(next) {
    const cdn = String(this.get('cdnUrl') ?? '').trim();
    const leg = String(this.get('firebaseUrl') ?? '').trim();
    if (!cdn && !leg) {
        next(new Error('Each media item requires cdnUrl (or legacy firebaseUrl)'));
        return;
    }
    next();
});
const defaultPollCounts = () => ({
    yes_definitely: 0,
    maybe: 0,
    not_for_me: 0,
    already_exists: 0,
});
const ideaPollSchema = new Schema({
    enabled: { type: Boolean, default: false },
    question: { type: String, default: '', maxlength: 280, trim: true },
    counts: {
        type: {
            yes_definitely: { type: Number, default: 0, min: 0 },
            maybe: { type: Number, default: 0, min: 0 },
            not_for_me: { type: Number, default: 0, min: 0 },
            already_exists: { type: Number, default: 0, min: 0 },
        },
        default: defaultPollCounts,
    },
}, { _id: false });
const contentScanReportSchema = new Schema({
    textScore: { type: Number, default: 0, min: 0, max: 1 },
    imageScore: { type: Number, default: 0, min: 0, max: 1 },
    videoScore: { type: Number, default: 0, min: 0, max: 1 },
    docScore: { type: Number, default: 0, min: 0, max: 1 },
    violations: { type: [String], default: [] },
    reviewRequired: { type: Boolean, default: false },
    scannedAt: { type: Date },
}, { _id: false });
const collaboratorSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
        type: String,
        enum: ['contributor', 'co_author', 'reviewer', 'mentor'],
        required: true,
    },
    joinedAt: { type: Date, default: () => new Date() },
}, { _id: false });
const validationInsightsSchema = new Schema({
    strengths: { type: [String], default: [] },
    risks: { type: [String], default: [] },
    suggestedPivots: { type: [String], default: [] },
}, { _id: false });
const coachImprovementSchema = new Schema({
    issue: { type: String, required: true, maxlength: 500 },
    fix: { type: String, required: true, maxlength: 1000 },
    xpReward: { type: Number, required: true, min: 0, max: 10_000 },
}, { _id: false });
const aiCoachFeedbackSchema = new Schema({
    overallFeedback: { type: String, required: true, maxlength: 4000 },
    strengths: {
        type: [String],
        default: [],
        validate: [(v) => v.length <= 12, 'Max 12 strengths'],
    },
    improvements: {
        type: [coachImprovementSchema],
        default: [],
        validate: [(v) => v.length <= 12, 'Max 12 improvements'],
    },
    marketInsight: { type: String, required: true, maxlength: 2000 },
    nextStep: { type: String, required: true, maxlength: 2000 },
    generatedAt: { type: Date, required: true, default: Date.now },
}, { _id: false });
const validationScoreSchema = new Schema({
    total: { type: Number, required: true, min: 0, max: 100 },
    communityVotes: { type: Number, required: true, min: 0, max: 100 },
    collaboratorWant: { type: Number, required: true, min: 0, max: 100 },
    aiMarketScore: { type: Number, required: true, min: 0, max: 100 },
    uniquenessScore: { type: Number, required: true, min: 0, max: 100 },
    completenessScore: { type: Number, required: true, min: 0, max: 100 },
    lastCalculated: { type: Date, required: true },
    trend: {
        type: String,
        enum: ['rising', 'stable', 'falling'],
        required: true,
    },
    breakdown: {
        marketSize: {
            type: String,
            enum: ['small', 'medium', 'large', 'massive'],
            required: true,
        },
        competition: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true,
        },
        feasibility: {
            type: String,
            enum: ['hard', 'medium', 'easy'],
            required: true,
        },
        timing: {
            type: String,
            enum: ['too_early', 'perfect', 'too_late'],
            required: true,
        },
    },
    insights: { type: validationInsightsSchema, required: true },
}, { _id: false });
function buildBaseSlug(title) {
    const base = slugify(title, { lower: true, strict: true, trim: true });
    return base.length > 0 ? base : 'idea';
}
async function generateUniqueSlug(title, excludeId) {
    const IdeaModel = mongoose.model('Idea');
    const base = buildBaseSlug(title);
    for (let attempt = 0; attempt < 25; attempt += 1) {
        const suffix = shortid.generate();
        const candidate = `${base}-${suffix}`;
        const exists = await IdeaModel.exists({
            slug: candidate,
            ...(excludeId ? { _id: { $ne: excludeId } } : {}),
        });
        if (!exists)
            return candidate;
    }
    return `${base}-${shortid.generate()}-${Date.now().toString(36)}`;
}
const ideaSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [10000, 'Description cannot exceed 10000 characters'],
        default: '',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [280, 'Slug is too long'],
    },
    category: {
        type: String,
        enum: {
            values: [
                'tech',
                'health',
                'education',
                'environment',
                'finance',
                'social',
                'art',
                'other',
            ],
            message: '{VALUE} is not a valid category',
        },
        required: true,
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator(tags) {
                if (tags.length > 10)
                    return false;
                return tags.every((t) => typeof t === 'string' && t.length > 0 && t.length <= 64);
            },
            message: 'Max 10 tags, each non-empty and max 64 chars',
        },
        set: (tags) => tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean),
    },
    status: {
        type: String,
        enum: {
            values: [
                'draft',
                'pending_review',
                'ai_scanning',
                'published',
                'rejected',
                'archived',
                'flagged',
            ],
            message: '{VALUE} is not a valid status',
        },
        default: 'draft',
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'collaborators_only'],
        default: 'public',
    },
    media: { type: [ideaMediaSchema], default: [] },
    contentScanScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
    },
    contentScanReport: {
        type: contentScanReportSchema,
        default: () => ({
            textScore: 0,
            imageScore: 0,
            videoScore: 0,
            docScore: 0,
            violations: [],
            reviewRequired: false,
        }),
    },
    collaboratorsOpen: { type: Boolean, default: false },
    requiredSkills: {
        type: [String],
        default: [],
        validate: {
            validator: (v) => v.length <= 30,
            message: 'Too many required skills',
        },
    },
    collaborators: { type: [collaboratorSchema], default: [] },
    likeCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    trendingScore: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    featuredAt: { type: Date },
    aiSummary: { type: String, default: '', maxlength: 2000 },
    aiSuggestedTags: { type: [String], default: [] },
    parentIdeaId: { type: Schema.Types.ObjectId, ref: 'Idea' },
    isDuetResponse: { type: Boolean, default: false },
    poll: {
        type: ideaPollSchema,
        default: () => ({
            enabled: false,
            question: '',
            counts: defaultPollCounts(),
        }),
    },
    version: { type: Number, default: 1, min: 1 },
    location: { type: String, default: '', trim: true, maxlength: 200 },
    rejectionReason: { type: String, default: '', maxlength: 2000 },
    validationScore: { type: validationScoreSchema, required: false },
    trendingXpAwarded: { type: Boolean, default: false },
    aiCoachFeedback: { type: aiCoachFeedbackSchema, required: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
ideaSchema.index({ authorId: 1, createdAt: -1 });
ideaSchema.index({ status: 1, visibility: 1, createdAt: -1 });
ideaSchema.index({ tags: 1 });
ideaSchema.index({ category: 1, status: 1 });
ideaSchema.index({ trendingScore: -1 });
ideaSchema.index({ 'media.scanStatus': 1 });
/** Configure Atlas Search in Atlas UI on: title, description, tags, category, aiSummary */
ideaSchema.virtual('collaboratorCount').get(function () {
    return Array.isArray(this.collaborators) ? this.collaborators.length : 0;
});
// Run before `required` validation so `slug` exists on first insert.
ideaSchema.pre('validate', async function ideaSlugPreValidate(next) {
    const shouldRegenSlug = this.isNew || this.isModified('title') || !this.slug;
    if (!shouldRegenSlug) {
        return next();
    }
    if (!this.title) {
        return next();
    }
    try {
        const newSlug = await generateUniqueSlug(this.title, this._id);
        this.set('slug', newSlug);
        next();
    }
    catch (err) {
        next(err);
    }
});
export const Idea = mongoose.models.Idea ??
    mongoose.model('Idea', ideaSchema);
//# sourceMappingURL=Idea.model.js.map