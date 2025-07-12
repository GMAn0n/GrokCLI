/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CountTokensResponse, GenerateContentResponse, GenerateContentParameters, CountTokensParameters, EmbedContentResponse, EmbedContentParameters } from '@google/genai';
import { Config } from '../config/config.js';
import { UserTierId } from '../code_assist/types.js';
export declare enum AuthType {
    OAUTH = "oauth-personal",
    CLOUD_SHELL = "cloud-shell",
    USE_GROK = "grok-api-key"
}
/**
 * Interface abstracting the core functionalities for generating content and counting tokens.
 */
export interface ContentGenerator {
    generateContent(request: GenerateContentParameters): Promise<GenerateContentResponse>;
    generateContentStream(request: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse>>;
    countTokens(request: CountTokensParameters): Promise<CountTokensResponse>;
    embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse>;
    getTier?(): Promise<UserTierId | undefined>;
}
export type ContentGeneratorConfig = {
    model: string;
    apiKey?: string;
    vertexai?: boolean;
    authType?: AuthType | undefined;
};
export declare function createContentGeneratorConfig(model: string | undefined, authType: AuthType | undefined): Promise<ContentGeneratorConfig>;
export declare function createContentGenerator(config: ContentGeneratorConfig, gcConfig: Config, sessionId?: string): Promise<ContentGenerator>;
