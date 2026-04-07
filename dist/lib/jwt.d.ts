export declare function signAccessToken(userId: string): string;
export declare function signRefreshToken(userId: string): string;
export declare function verifyAccessToken(token: string): {
    sub: string;
};
export declare function verifyRefreshToken(token: string): {
    sub: string;
};
export declare function signTokenPair(userId: string): {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=jwt.d.ts.map