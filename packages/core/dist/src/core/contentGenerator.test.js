/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { createContentGenerator, AuthType, createContentGeneratorConfig, } from './contentGenerator.js';
import { createCodeAssistContentGenerator } from '../code_assist/codeAssist.js';
import { GoogleGenAI, Type } from '@google/genai';
vi.mock('../code_assist/codeAssist.js');
vi.mock('@google/genai');
// Mock fetch globally
global.fetch = vi.fn();
const mockConfig = {};
describe('createContentGenerator', () => {
    it('should create a CodeAssistContentGenerator', async () => {
        const mockGenerator = {};
        vi.mocked(createCodeAssistContentGenerator).mockResolvedValue(mockGenerator);
        const generator = await createContentGenerator({
            model: 'test-model',
            authType: AuthType.OAUTH,
        }, mockConfig);
        expect(createCodeAssistContentGenerator).toHaveBeenCalled();
        expect(generator).toBe(mockGenerator);
    });
    it('should create a Grok content generator with tools', async () => {
        const mockGenerator = {
            models: {},
        };
        vi.mocked(GoogleGenAI).mockImplementation(() => mockGenerator);
        // Mock successful API response
        const mockResponse = {
            ok: true,
            json: vi.fn().mockResolvedValue({
                choices: [{
                        message: {
                            content: 'Test response from Grok',
                            tool_calls: [
                                {
                                    id: 'call_123',
                                    type: 'function',
                                    function: {
                                        name: 'read_file',
                                        arguments: '{"path": "/test/file.txt"}'
                                    }
                                }
                            ]
                        }
                    }],
                usage: {
                    prompt_tokens: 10,
                    completion_tokens: 5,
                    total_tokens: 15
                }
            })
        };
        vi.mocked(fetch).mockResolvedValue(mockResponse);
        const generator = await createContentGenerator({
            model: 'test-model',
            apiKey: 'test-api-key',
            authType: AuthType.USE_GROK,
        }, mockConfig);
        // Test that the generator can handle tools
        const result = await generator.generateContent({
            model: 'grok-4',
            contents: [{ role: 'user', parts: [{ text: 'Read the file test.txt' }] }],
            config: {
                tools: [{
                        functionDeclarations: [{
                                name: 'read_file',
                                description: 'Read a file',
                                parameters: {
                                    type: Type.OBJECT,
                                    properties: {
                                        path: {
                                            type: Type.STRING,
                                            description: 'Path to the file'
                                        }
                                    },
                                    required: ['path']
                                }
                            }]
                    }]
            }
        });
        // Verify that fetch was called with the correct request body
        const fetchCall = vi.mocked(fetch).mock.calls[0];
        expect(fetchCall[0]).toBe('https://api.x.ai/v1/chat/completions');
        expect(fetchCall[1]).toMatchObject({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-api-key',
            },
        });
        const requestBody = JSON.parse(fetchCall[1]?.body);
        expect(requestBody).toHaveProperty('tools');
        expect(requestBody).toHaveProperty('tool_choice', 'auto');
        expect(JSON.stringify(requestBody)).toContain('read_file');
        // Verify the response structure
        expect(result.candidates).toBeDefined();
        expect(result.functionCalls).toBeDefined();
        expect(result.text).toBe('Test response from Grok');
    });
});
describe('createContentGeneratorConfig', () => {
    const originalEnv = process.env;
    beforeEach(() => {
        // Reset modules to re-evaluate imports and environment variables
        vi.resetModules();
        // Restore process.env before each test
        process.env = { ...originalEnv };
    });
    afterAll(() => {
        // Restore original process.env after all tests
        process.env = originalEnv;
    });
    it('should configure for Grok using XAI_API_KEY when set', async () => {
        process.env.XAI_API_KEY = 'env-xai-key';
        const config = await createContentGeneratorConfig(undefined, AuthType.USE_GROK);
        expect(config.apiKey).toBe('env-xai-key');
        expect(config.vertexai).toBeUndefined();
    });
    it('should not configure for Grok if XAI_API_KEY is empty', async () => {
        process.env.XAI_API_KEY = '';
        const config = await createContentGeneratorConfig(undefined, AuthType.USE_GROK);
        expect(config.apiKey).toBeUndefined();
        expect(config.vertexai).toBeUndefined();
    });
});
//# sourceMappingURL=contentGenerator.test.js.map