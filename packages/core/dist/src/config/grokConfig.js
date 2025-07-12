/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GrokClient } from '../core/grokClient.js';
import { Config } from './config.js';
import { AuthType } from '../core/contentGenerator.js';
export class GrokConfig extends Config {
    grokClient;
    constructor(params) {
        super(params);
    }
    async initialize() {
        await super.initialize();
        // Initialize contentGeneratorConfig for Grok if not already set
        if (!this.contentGeneratorConfig) {
            await this.refreshAuth(AuthType.USE_GROK);
        }
        this.grokClient = new GrokClient(this);
        await this.grokClient.initialize(this.contentGeneratorConfig);
    }
    getGrokClient() {
        return this.grokClient;
    }
    // For compatibility with code expecting GeminiClient
    getGeminiClient() {
        return this.grokClient;
    }
}
//# sourceMappingURL=grokConfig.js.map