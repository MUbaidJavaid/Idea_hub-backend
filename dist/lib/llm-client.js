import axios from 'axios';
const OPENAI_CHAT_BASE = 'https://api.openai.com/v1';
const GEMINI_OPENAI_COMPAT_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';
export function llmChatBaseUrl() {
    const explicit = process.env.VALIDATION_CHAT_BASE_URL?.trim();
    if (explicit)
        return explicit.replace(/\/$/, '');
    if (process.env.GEMINI_API_KEY?.trim()) {
        return GEMINI_OPENAI_COMPAT_BASE;
    }
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    if (openaiKey?.startsWith('AIza')) {
        return GEMINI_OPENAI_COMPAT_BASE;
    }
    return OPENAI_CHAT_BASE;
}
export function llmApiKey() {
    return (process.env.GEMINI_API_KEY?.trim() ||
        process.env.OPENAI_API_KEY?.trim() ||
        undefined);
}
/** Model for validation + coach unless OPENAI_COACH_MODEL overrides coach calls. */
export function llmModel() {
    return (process.env.OPENAI_VALIDATION_MODEL?.trim() || 'gpt-4o-mini');
}
export function coachLlmModel() {
    return (process.env.OPENAI_COACH_MODEL?.trim() ||
        llmModel());
}
export async function chatCompletionContent(params) {
    const key = llmApiKey();
    if (!key) {
        throw new Error('No LLM API key configured');
    }
    const url = `${llmChatBaseUrl()}/chat/completions`;
    const body = {
        model: params.model ?? llmModel(),
        temperature: params.temperature ?? 0.4,
        messages: params.messages,
    };
    if (params.responseFormatJson) {
        body.response_format = { type: 'json_object' };
    }
    const { data } = await axios.post(url, body, {
        headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        timeout: params.timeoutMs ?? 90_000,
    });
    const raw = data.choices?.[0]?.message?.content;
    if (!raw)
        throw new Error('Empty LLM response');
    return raw;
}
//# sourceMappingURL=llm-client.js.map