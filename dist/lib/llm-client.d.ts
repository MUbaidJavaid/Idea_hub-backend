export declare function llmChatBaseUrl(): string;
export declare function llmApiKey(): string | undefined;
/** Model for validation + coach unless OPENAI_COACH_MODEL overrides coach calls. */
export declare function llmModel(): string;
export declare function coachLlmModel(): string;
export declare function chatCompletionContent(params: {
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
    temperature?: number;
    responseFormatJson?: boolean;
    model?: string;
    timeoutMs?: number;
}): Promise<string>;
//# sourceMappingURL=llm-client.d.ts.map