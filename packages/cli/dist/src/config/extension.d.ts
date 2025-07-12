/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { MCPServerConfig } from '@grok/grok-cli-core';
export declare const EXTENSIONS_DIRECTORY_NAME: string;
export declare const EXTENSIONS_CONFIG_FILENAME = "grok-extension.json";
export interface Extension {
    config: ExtensionConfig;
    contextFiles: string[];
}
export interface ExtensionConfig {
    name: string;
    version: string;
    mcpServers?: Record<string, MCPServerConfig>;
    contextFileName?: string | string[];
    excludeTools?: string[];
}
export declare function loadExtensions(workspaceDir: string): Extension[];
export declare function filterActiveExtensions(extensions: Extension[], enabledExtensionNames: string[]): Extension[];
