import { ideaToApi } from '../lib/serialize-idea.js';
import { userToApi } from '../lib/serialize-user.js';
export declare function getAdminDashboardStats(): Promise<{
    overview: {
        totalUsers: number;
        activeUsers: number;
        totalIdeas: number;
        publishedIdeas: number;
        totalLikes: number;
        totalCollabs: number;
    };
    trends: {
        usersPct: number;
        ideasPct: number;
        signupsTodayPct: number;
        queuePct: number;
    };
    today: {
        newUsers: number;
        newIdeas: number;
        newLikes: number;
        scanJobsRan: number;
    };
    scanQueue: {
        pending: number;
        approvedToday: number;
        rejectedToday: number;
        avgScore: number;
    };
    topIdeas: ReturnType<typeof ideaToApi>[];
    recentUsers: ReturnType<typeof userToApi>[];
    categoryBreakdown: Record<string, number>;
    weeklyActivity: Array<{
        date: string;
        ideas: number;
        users: number;
    }>;
    legacy: {
        dau: number;
        mau: number;
        ideasTrend: Array<{
            label: string;
            value: number;
        }>;
        categoryDistribution: Array<{
            name: string;
            value: number;
        }>;
        engagementBuckets: Array<{
            name: string;
            value: number;
        }>;
        rejectionRate: number;
    };
    /** Primary KPI row — all from live DB counts */
    kpis: {
        totalIdeas: number;
        /** Accepted collaboration requests (active “projects”) */
        activeProjects: number;
        totalUsers: number;
        /** Published ideas (public “shipped” ideas) */
        publishedIdeas: number;
    };
    ideasTrend6Months: Array<{
        label: string;
        value: number;
    }>;
    ideasByStatus: Record<string, number>;
    monthlyGrowth: {
        ideasPct: number;
        usersPct: number;
    };
    recentIdeasFeed: ReturnType<typeof ideaToApi>[];
    topContributors: Array<{
        userId: string;
        username: string;
        fullName: string;
        ideasCount: number;
        votesReceived: number;
    }>;
    pendingApprovals: ReturnType<typeof ideaToApi>[];
    comments: {
        total: number;
        flagged: number;
    };
}>;
//# sourceMappingURL=admin-dashboard.service.d.ts.map