/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthType } from '@grok/grok-cli-core';
import { vi } from 'vitest';
import { validateAuthMethod } from './auth.js';

vi.mock('./settings.js', () => ({
  loadEnvironment: vi.fn(),
}));

describe('validateAuthMethod', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return null for OAUTH', () => {
    expect(validateAuthMethod(AuthType.OAUTH)).toBeNull();
  });

  it('should return null for CLOUD_SHELL', () => {
    expect(validateAuthMethod(AuthType.CLOUD_SHELL)).toBeNull();
  });

  describe('USE_GROK', () => {
    it('should return null if XAI_API_KEY is set', () => {
      process.env.XAI_API_KEY = 'test-key';
      expect(validateAuthMethod(AuthType.USE_GROK)).toBeNull();
    });

    it('should return an error message if XAI_API_KEY is not set', () => {
      expect(validateAuthMethod(AuthType.USE_GROK)).toBe(
        'XAI_API_KEY environment variable not found. Add that to your environment and try again (no reload needed if using .env)!',
      );
    });
  });

  it('should return an error message for an invalid auth method', () => {
    expect(validateAuthMethod('invalid-method')).toBe(
      'Invalid auth method selected.',
    );
  });
});
