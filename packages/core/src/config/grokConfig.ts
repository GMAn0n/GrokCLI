/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GrokClient } from '../core/grokClient.js';
import { Config, ConfigParameters } from './config.js';
import { AuthType } from '../core/contentGenerator.js';
import { GeminiClient } from '../core/client.js';

export class GrokConfig extends Config {
  private grokClient!: GrokClient;

  constructor(params: ConfigParameters) {
    super(params);
  }

  async initialize(): Promise<void> {
    await super.initialize();
    
    // Initialize contentGeneratorConfig for Grok if not already set
    if (!this.contentGeneratorConfig) {
      await this.refreshAuth(AuthType.USE_GROK);
    }
    
    this.grokClient = new GrokClient(this);
    await this.grokClient.initialize(this.contentGeneratorConfig);
  }

  getGrokClient(): GrokClient {
    return this.grokClient;
  }
  // For compatibility with code expecting GeminiClient
  getGeminiClient(): GeminiClient {
    return this.grokClient as unknown as GeminiClient;
  }
}
