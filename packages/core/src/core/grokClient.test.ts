/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GrokClient } from './grokClient.js';
import { Config } from '../config/config.js';
import { AuthType } from './contentGenerator.js';
import { ToolRegistry } from '../tools/tool-registry.js';

// Mock dependencies
vi.mock('../config/config.js');
vi.mock('../tools/tool-registry.js');
vi.mock('./contentGenerator.js', async () => {
  const actual = await vi.importActual('./contentGenerator.js');
  return {
    ...actual,
    createContentGenerator: vi.fn().mockResolvedValue({
      generateContent: vi.fn().mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [{ text: 'I will help you read the file.' }],
            },
          },
        ],
        usageMetadata: {
          promptTokenCount: 10,
          candidatesTokenCount: 5,
          totalTokenCount: 15,
        },
        text: 'I will help you read the file.',
        functionCalls: [
          {
            id: 'call_123',
            type: 'function',
            function: {
              name: 'read_file',
              arguments: '{"path": "/test/file.txt"}',
            },
          },
        ],
      }),
    }),
  };
});

// Mock fetch globally
global.fetch = vi.fn();

describe('GrokClient', () => {
  let mockConfig: Config;
  let grokClient: GrokClient;

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'I will help you read the file.',
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
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    // Mock Config
    mockConfig = {
      getSessionId: vi.fn().mockReturnValue('test-session'),
      getModel: vi.fn().mockReturnValue('grok-4'),
      getContentGeneratorConfig: vi.fn().mockReturnValue({
        apiKey: 'test-api-key',
        authType: AuthType.USE_GROK,
      }),
      getUserMemory: vi.fn().mockReturnValue(''),
      getProxy: vi.fn().mockReturnValue(null),
      getEmbeddingModel: vi.fn().mockReturnValue(undefined),
      getWorkingDir: vi.fn().mockReturnValue('/mock/dir'),
      getFileService: vi.fn().mockReturnValue(undefined),
      getFullContext: vi.fn().mockReturnValue(false),
      getToolRegistry: vi.fn().mockResolvedValue({
        getFunctionDeclarations: vi.fn().mockReturnValue([
          {
            name: 'read_file',
            description: 'Read a file',
            parameters: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the file'
                }
              },
              required: ['path']
            }
          }
        ]),
        getTool: vi.fn().mockReturnValue({
          execute: vi.fn().mockResolvedValue('File content here')
        })
      }),
    } as unknown as Config;

    grokClient = new GrokClient(mockConfig);
  });

  it('should initialize with tools and handle tool calls', async () => {
    await grokClient.initialize({
      apiKey: 'test-api-key',
      authType: AuthType.USE_GROK,
      model: 'grok-4',
    });

    // Verify that the client was initialized with tools
    const toolRegistry = await mockConfig.getToolRegistry();
    expect(toolRegistry.getFunctionDeclarations).toHaveBeenCalled();

    // Test that the client can generate content with tools
    const result = await grokClient.generateContent(
      [{ role: 'user', parts: [{ text: 'Read the file test.txt' }] }],
      {},
      new AbortController().signal
    );

    // Verify that the API was called with tools
    expect(fetch).toHaveBeenCalledWith(
      'https://api.x.ai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
      })
    );

    const requestBody = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);
    expect(requestBody).toHaveProperty('tools');
    expect(requestBody).toHaveProperty('tool_choice', 'auto');
  });
}); 