/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType } from '@grok/grok-cli-core';
import { loadEnvironment } from './settings.js';
export const validateAuthMethod = (authMethod) => {
    loadEnvironment();
    if (authMethod === AuthType.OAUTH ||
        authMethod === AuthType.CLOUD_SHELL) {
        return null;
    }
    if (authMethod === AuthType.USE_GROK) {
        if (!process.env.XAI_API_KEY) {
            return 'XAI_API_KEY environment variable not found. Add that to your environment and try again (no reload needed if using .env)!';
        }
        return null;
    }
    return 'Invalid auth method selected.';
};
//# sourceMappingURL=auth.js.map