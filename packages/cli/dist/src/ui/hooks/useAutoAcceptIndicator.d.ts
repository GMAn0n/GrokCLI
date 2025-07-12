/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { ApprovalMode, type Config } from '@grok/grok-cli-core';
export interface UseAutoAcceptIndicatorArgs {
    config: Config;
}
export declare function useAutoAcceptIndicator({ config, }: UseAutoAcceptIndicatorArgs): ApprovalMode;
