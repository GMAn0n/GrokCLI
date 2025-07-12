/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GrokClient } from '../core/grokClient.js';
import { Config, ConfigParameters } from './config.js';
import { GeminiClient } from '../core/client.js';
export declare class GrokConfig extends Config {
    private grokClient;
    constructor(params: ConfigParameters);
    initialize(): Promise<void>;
    getGrokClient(): GrokClient;
    getGeminiClient(): GeminiClient;
}
