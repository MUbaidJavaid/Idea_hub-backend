/** Live rooms — Daily.co (or mock) + participant limits */
export declare const LIVE_FREE_MAX_PARTICIPANTS = 10;
export declare const LIVE_PRO_MAX_PARTICIPANTS = 200;
export type LiveRoomProvider = 'daily' | 'mock';
export declare function liveRoomsEnabled(): boolean;
export declare function liveRoomProvider(): LiveRoomProvider;
export declare function dailyDomain(): string;
//# sourceMappingURL=live.config.d.ts.map