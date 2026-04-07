import { ideaToApi } from '../lib/serialize-idea.js';
import { userToApi, userToApiPublic } from '../lib/serialize-user.js';
export declare function getUserDashboardData(userId: string): Promise<{
    profile: ReturnType<typeof userToApi>;
    stats: {
        totalIdeas: number;
        totalLikes: number;
        totalViews: number;
        totalComments: number;
        totalCollaborators: number;
        totalFollowers: number;
    };
    ideas: {
        published: number;
        draft: number;
        pending: number;
        rejected: number;
        topIdea: ReturnType<typeof ideaToApi> | null;
    };
    recentActivity: Array<{
        type: 'like' | 'comment' | 'collab' | 'follow';
        from: ReturnType<typeof userToApiPublic>;
        idea?: ReturnType<typeof ideaToApi>;
        createdAt: string;
    }>;
    weeklyViews: Array<{
        date: string;
        views: number;
    }>;
    collaborations: Array<{
        idea: ReturnType<typeof ideaToApi>;
        role: string;
        status: string;
    }>;
    pendingCollabRequests: Array<{
        idea: ReturnType<typeof ideaToApi>;
        status: string;
        createdAt: string;
    }>;
}>;
/** Full list for /users/me/collaborations (dashboard only includes a short preview). */
export declare function getUserCollaborationsList(userId: string): Promise<{
    accepted: Array<{
        idea: ReturnType<typeof ideaToApi>;
        role: string;
        status: string;
        acceptedAt: string;
    }>;
    pending: Array<{
        idea: ReturnType<typeof ideaToApi>;
        status: string;
        createdAt: string;
    }>;
}>;
//# sourceMappingURL=user-dashboard.service.d.ts.map