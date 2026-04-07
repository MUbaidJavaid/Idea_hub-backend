export function getDecision(score) {
    if (score >= 0.85)
        return 'approved';
    if (score >= 0.5)
        return 'pending_review';
    return 'rejected';
}
//# sourceMappingURL=types.js.map