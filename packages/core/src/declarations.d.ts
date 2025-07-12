/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

declare module 'xai-sdk' {
  export class Client {
    constructor(args: { apiKey?: string | undefined });
    chat: {
      create: (params: { model: string }) => {
        append: (message: { role: string; content: string }) => void;
        sample: () => Promise<{ content: string }>;
      };
    };
  }
}
