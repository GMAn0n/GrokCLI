/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createCodeAssistContentGenerator } from '../code_assist/codeAssist.js';
import { DEFAULT_GROK_MODEL } from '../config/models.js';
export var AuthType;
(function (AuthType) {
    AuthType["OAUTH"] = "oauth-personal";
    AuthType["CLOUD_SHELL"] = "cloud-shell";
    AuthType["USE_GROK"] = "grok-api-key";
})(AuthType || (AuthType = {}));
export async function createContentGeneratorConfig(model, authType) {
    const apiKey = process.env.XAI_API_KEY || undefined;
    // Use runtime model from config if available, otherwise fallback to parameter or default
    const effectiveModel = model || DEFAULT_GROK_MODEL;
    const contentGeneratorConfig = {
        model: effectiveModel,
        authType,
    };
    // If we are using Google auth or we are in Cloud Shell, there is nothing else to validate for now
    if (authType === AuthType.OAUTH ||
        authType === AuthType.CLOUD_SHELL) {
        return contentGeneratorConfig;
    }
    if (authType === AuthType.USE_GROK && apiKey) {
        contentGeneratorConfig.apiKey = apiKey;
        return contentGeneratorConfig;
    }
    return contentGeneratorConfig;
}
export async function createContentGenerator(config, gcConfig, sessionId) {
    const version = process.env.CLI_VERSION || process.version;
    const httpOptions = {
        headers: {
            'User-Agent': `GrokCLI/${version} (${process.platform}; ${process.arch})`,
        },
    };
    if (config.authType === AuthType.OAUTH ||
        config.authType === AuthType.CLOUD_SHELL) {
        return createCodeAssistContentGenerator(httpOptions, config.authType, gcConfig, sessionId);
    }
    if (config.authType === AuthType.USE_GROK) {
        return createGrokContentGenerator(config);
    }
    throw new Error(`Error creating contentGenerator: Unsupported authType: ${config.authType}`);
}
// Helper to normalize request.contents to Content[]
function normalizeContents(contents) {
    if (Array.isArray(contents)) {
        // If it's an array of Content or Part
        if (contents.length === 0)
            return [];
        if ('role' in contents[0]) {
            // Already Content[]
            return contents;
        }
        else if ('text' in contents[0] || 'inlineData' in contents[0]) {
            // Array of PartUnion
            return contents.map((part) => ({ role: 'user', parts: [part] }));
        }
    }
    else if (typeof contents === 'string') {
        return [{ role: 'user', parts: [{ text: contents }] }];
    }
    else if (contents && typeof contents === 'object' && 'role' in contents) {
        return [contents];
    }
    return [];
}
async function createGrokContentGenerator(config) {
    // Create HTTP client for xAI API
    const xaiClient = {
        chat: {
            create: ({ model }) => {
                const messages = [];
                return {
                    append: (message) => {
                        messages.push(message);
                    },
                    sample: async () => {
                        // Make HTTP request to xAI API
                        const response = await fetch('https://api.x.ai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${config.apiKey}`,
                            },
                            body: JSON.stringify({
                                model: model || 'grok-4',
                                messages: messages,
                                stream: false,
                            }),
                        });
                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`xAI API error: ${response.status} ${errorText}`);
                        }
                        const data = await response.json();
                        return {
                            content: data.choices[0]?.message?.content || 'No response from Grok',
                        };
                    },
                };
            },
        },
    };
    const client = xaiClient;
    return {
        async generateContent(request) {
            const chat = client.chat.create({ model: request.model || 'grok-4' });
            // Convert the request contents to xAI format
            const contents = normalizeContents(request.contents);
            for (const content of contents) {
                if (content.role === 'user') {
                    const userContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        if ('inlineData' in part) {
                            return part.inlineData.data;
                        }
                        return '';
                    }).join(' ') || '';
                    chat.append({ role: 'user', content: userContent });
                }
                else if (content.role === 'model') {
                    const modelContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        return '';
                    }).join(' ') || '';
                    chat.append({ role: 'assistant', content: modelContent });
                }
                else if (content.role === 'system') {
                    const systemContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        return '';
                    }).join(' ') || '';
                    chat.append({ role: 'system', content: systemContent });
                }
            }
            // Add tools to the request if available
            const tools = request.config?.tools;
            const messages = [];
            // Collect messages from the chat
            for (const content of contents) {
                if (content.role === 'user') {
                    const userContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        if ('inlineData' in part) {
                            return part.inlineData.data;
                        }
                        return '';
                    }).join(' ') || '';
                    messages.push({ role: 'user', content: userContent });
                }
                else if (content.role === 'model') {
                    const modelContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        return '';
                    }).join(' ') || '';
                    messages.push({ role: 'assistant', content: modelContent });
                }
                else if (content.role === 'system') {
                    const systemContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        return '';
                    }).join(' ') || '';
                    messages.push({ role: 'system', content: systemContent });
                }
            }
            const requestBody = {
                model: request.model || 'grok-4',
                messages: messages,
                stream: false,
            };
            if (tools && tools.length > 0) {
                requestBody.tools = tools;
                requestBody.tool_choice = 'auto';
            }
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`xAI API error: ${response.status} ${errorText}`);
            }
            const data = await response.json();
            const choice = data.choices[0];
            return {
                candidates: [
                    {
                        content: {
                            parts: choice.message.content ? [{ text: choice.message.content }] : [],
                        },
                    },
                ],
                usageMetadata: {
                    promptTokenCount: data.usage?.prompt_tokens || 0,
                    candidatesTokenCount: data.usage?.completion_tokens || 0,
                    totalTokenCount: data.usage?.total_tokens || 0,
                },
                text: choice.message.content || '',
                data: undefined,
                functionCalls: choice.message.tool_calls,
                executableCode: undefined,
                codeExecutionResult: undefined,
            };
        },
        async generateContentStream(request) {
            const chat = client.chat.create({ model: request.model || 'grok-4' });
            // Convert the request contents to xAI format and collect messages
            const contents = normalizeContents(request.contents);
            const messages = [];
            for (const content of contents) {
                if (content.role === 'user') {
                    const userContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        if ('inlineData' in part) {
                            return part.inlineData.data;
                        }
                        return '';
                    }).join(' ') || '';
                    chat.append({ role: 'user', content: userContent });
                    messages.push({ role: 'user', content: userContent });
                }
                else if (content.role === 'model') {
                    const modelContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        return '';
                    }).join(' ') || '';
                    chat.append({ role: 'assistant', content: modelContent });
                    messages.push({ role: 'assistant', content: modelContent });
                }
                else if (content.role === 'system') {
                    const systemContent = content.parts?.map((part) => {
                        if ('text' in part) {
                            return part.text;
                        }
                        return '';
                    }).join(' ') || '';
                    chat.append({ role: 'system', content: systemContent });
                    messages.push({ role: 'system', content: systemContent });
                }
            }
            // Add tools to the request if available
            const tools = request.config?.tools;
            const requestBody = {
                model: request.model || 'grok-4',
                messages: messages,
                stream: true,
            };
            if (tools && tools.length > 0) {
                requestBody.tools = tools;
                requestBody.tool_choice = 'auto';
            }
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`xAI API error: ${response.status} ${errorText}`);
            }
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body for streaming');
            }
            const decoder = new TextDecoder();
            let buffer = '';
            const streamGenerator = async function* () {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done)
                            break;
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    return;
                                }
                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices?.[0]?.delta?.content;
                                    if (content) {
                                        yield {
                                            candidates: [
                                                {
                                                    content: {
                                                        parts: [{ text: content }],
                                                    },
                                                },
                                            ],
                                            usageMetadata: {
                                                promptTokenCount: 0,
                                                candidatesTokenCount: 0,
                                                totalTokenCount: 0,
                                            },
                                            text: content,
                                            data: undefined,
                                            functionCalls: undefined,
                                            executableCode: undefined,
                                            codeExecutionResult: undefined,
                                        };
                                    }
                                }
                                catch (e) {
                                    // Ignore parsing errors for incomplete chunks
                                }
                            }
                        }
                    }
                }
                finally {
                    reader.releaseLock();
                }
            };
            return streamGenerator();
        },
        async countTokens(request) {
            // xAI doesn't provide token counting in the same format
            // Return a placeholder response
            return {
                totalTokens: 0,
            };
        },
        async embedContent(request) {
            // xAI doesn't provide embeddings in the same format
            // Return a placeholder response
            return {
                embeddings: [],
            };
        },
    };
}
async function getEffectiveModel(apiKey, model) {
    // For Grok, we don't need to validate the model against the API
    // since we're using xAI's Grok models
    return model;
}
//# sourceMappingURL=contentGenerator.js.map