export declare function dailyCreateRoom(roomName: string): Promise<void>;
export declare function dailyMeetingToken(params: {
    roomName: string;
    userName: string;
    isOwner: boolean;
}): Promise<string>;
export declare function dailyRoomJoinUrl(roomName: string, token: string): string;
//# sourceMappingURL=daily-live.service.d.ts.map