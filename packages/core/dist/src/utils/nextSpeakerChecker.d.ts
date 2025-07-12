/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GeminiClient } from '../core/client.js';
import { GrokClient } from '../core/grokClient.js';
import { GeminiChat } from '../core/geminiChat.js';
import { GrokChat } from '../core/grokChat.js';
export interface NextSpeakerResponse {
    reasoning: string;
    next_speaker: 'user' | 'model';
}
export declare function checkNextSpeaker(chat: GeminiChat | GrokChat, client: GeminiClient | GrokClient, abortSignal: AbortSignal): Promise<NextSpeakerResponse | null>;
