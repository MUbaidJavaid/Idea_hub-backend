import { deletedAuthorPlaceholder } from './author-utils.js';
export function leanCommentToApi(c, authors) {
    const aid = String(c.authorId);
    return {
        _id: String(c._id),
        ideaId: String(c.ideaId),
        authorId: authors.get(aid) ?? deletedAuthorPlaceholder(aid),
        parentCommentId: c.parentCommentId ? String(c.parentCommentId) : null,
        content: c.content,
        likeCount: c.likeCount ?? 0,
        status: c.status ?? 'visible',
        createdAt: c.createdAt instanceof Date
            ? c.createdAt.toISOString()
            : String(c.createdAt),
        updatedAt: c.updatedAt instanceof Date
            ? c.updatedAt.toISOString()
            : String(c.updatedAt),
    };
}
//# sourceMappingURL=comment-serialize.js.map