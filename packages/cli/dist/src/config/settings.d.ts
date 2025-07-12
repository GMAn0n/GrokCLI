/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { MCPServerConfig, BugCommandSettings, TelemetrySettings, AuthType } from '@grok/grok-cli-core';
export declare const SETTINGS_DIRECTORY_NAME = ".grok";
export declare const USER_SETTINGS_DIR: string;
export declare const USER_SETTINGS_PATH: string;
export declare const SYSTEM_SETTINGS_PATH: string;
export declare enum SettingScope {
    User = "User",
    Workspace = "Workspace",
    System = "System"
}
export interface CheckpointingSettings {
    enabled?: boolean;
}
export interface AccessibilitySettings {
    disableLoadingPhrases?: boolean;
}
export interface Settings {
    theme?: string;
    selectedAuthType?: AuthType;
    sandbox?: boolean | string;
    coreTools?: string[];
    excludeTools?: string[];
    toolDiscoveryCommand?: string;
    toolCallCommand?: string;
    mcpServerCommand?: string;
    mcpServers?: Record<string, MCPServerConfig>;
    showMemoryUsage?: boolean;
    contextFileName?: string | string[];
    accessibility?: AccessibilitySettings;
    telemetry?: TelemetrySettings;
    usageStatisticsEnabled?: boolean;
    preferredEditor?: string;
    bugCommand?: BugCommandSettings;
    checkpointing?: CheckpointingSettings;
    autoConfigureMaxOldSpaceSize?: boolean;
    fileFiltering?: {
        respectGitIgnore?: boolean;
        enableRecursiveFileSearch?: boolean;
    };
    hideWindowTitle?: boolean;
    hideTips?: boolean;
    maxSessionTurns?: number;
}
export interface SettingsError {
    message: string;
    path: string;
}
export interface SettingsFile {
    settings: Settings;
    path: string;
}
export declare class LoadedSettings {
    constructor(system: SettingsFile, user: SettingsFile, workspace: SettingsFile, errors: SettingsError[]);
    readonly system: SettingsFile;
    readonly user: SettingsFile;
    readonly workspace: SettingsFile;
    readonly errors: SettingsError[];
    private _merged;
    get merged(): Settings;
    private computeMergedSettings;
    forScope(scope: SettingScope): SettingsFile;
    setValue(scope: SettingScope, key: keyof Settings, value: string | Record<string, MCPServerConfig> | undefined): void;
}
export declare function setUpCloudShellEnvironment(envFilePath: string | null): void;
export declare function loadEnvironment(): void;
/**
 * Loads settings from user and workspace directories.
 * Project settings override user settings.
 */
export declare function loadSettings(workspaceDir: string): LoadedSettings;
export declare function saveSettings(settingsFile: SettingsFile): void;
