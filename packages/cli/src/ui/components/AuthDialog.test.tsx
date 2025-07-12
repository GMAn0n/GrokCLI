/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { render } from 'ink-testing-library';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthDialog } from './AuthDialog.js';
import { LoadedSettings, SettingScope } from '../../config/settings.js';
import { AuthType } from '@grok/grok-cli-core';

describe('AuthDialog', () => {
  const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.XAI_API_KEY = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should show an error if the initial auth type is invalid', () => {
    process.env.XAI_API_KEY = '';

    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: {},
        path: '',
      },
      {
        settings: {
          selectedAuthType: AuthType.USE_GROK,
        },
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      [],
    );

    const { lastFrame } = render(
      <AuthDialog
        onSelect={() => {}}
        settings={settings}
        initialErrorMessage="XAI_API_KEY environment variable not found"
      />,
    );

    expect(lastFrame()).toContain(
      'XAI_API_KEY environment variable not found',
    );
  });

  it('should detect XAI_API_KEY environment variable', () => {
    process.env.XAI_API_KEY = 'foobar';

    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: {
          selectedAuthType: undefined,
        },
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      [],
    );

    const { lastFrame } = render(
      <AuthDialog onSelect={() => {}} settings={settings} />,
    );

    expect(lastFrame()).toContain('Existing API key detected (XAI_API_KEY)');
  });

  it('should prevent exiting when no auth method is selected and show error message', async () => {
    const onSelect = vi.fn();
    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: {},
        path: '',
      },
      {
        settings: {
          selectedAuthType: undefined,
        },
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      [],
    );

    const { lastFrame, stdin, unmount } = render(
      <AuthDialog onSelect={onSelect} settings={settings} />,
    );
    await wait();

    // Simulate pressing escape key
    stdin.write('\u001b'); // ESC key
    await wait();

    // Should show error message instead of calling onSelect
    expect(lastFrame()).toContain(
      'You must select an auth method to proceed. Press Ctrl+C twice to exit.',
    );
    expect(onSelect).not.toHaveBeenCalled();
    unmount();
  });

  it('should not exit if there is already an error message', async () => {
    const onSelect = vi.fn();
    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: {},
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      [],
    );

    const { lastFrame, stdin, unmount } = render(
      <AuthDialog
        onSelect={onSelect}
        settings={settings}
        initialErrorMessage="Initial error"
      />,
    );
    await wait();

    expect(lastFrame()).toContain('Initial error');

    // Simulate pressing escape key
    stdin.write('\u001b'); // ESC key
    await wait();

    // Should not call onSelect
    expect(onSelect).not.toHaveBeenCalled();
    unmount();
  });

  it('should allow exiting when auth method is already selected', async () => {
    const onSelect = vi.fn();
    const settings: LoadedSettings = new LoadedSettings(
      {
        settings: {},
        path: '',
      },
      {
        settings: {
          selectedAuthType: AuthType.USE_GROK,
        },
        path: '',
      },
      {
        settings: {},
        path: '',
      },
      [],
    );

    const { stdin, unmount } = render(
      <AuthDialog onSelect={onSelect} settings={settings} />,
    );
    await wait();

    // Simulate pressing escape key
    stdin.write('\u001b'); // ESC key
    await wait();

    // Should call onSelect with undefined to exit
    expect(onSelect).toHaveBeenCalledWith(undefined, SettingScope.User);
    unmount();
  });
});
