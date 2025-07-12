/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { Config, GitService, Logger } from '@grok/grok-cli-core';
import { LoadedSettings } from '../../config/settings.js';
import { UseHistoryManagerReturn } from '../hooks/useHistoryManager.js';
import { SessionStatsState } from '../contexts/SessionContext.js';
export interface CommandContext {
    services: {
        config: Config | null;
        settings: LoadedSettings;
        git: GitService | undefined;
        logger: Logger;
    };
    ui: {
        /** Adds a new item to the history display. */
        addItem: UseHistoryManagerReturn['addItem'];
        /** Clears all history items and the console screen. */
        clear: () => void;
        /**
         * Sets the transient debug message displayed in the application footer in debug mode.
         */
        setDebugMessage: (message: string) => void;
    };
    session: {
        stats: SessionStatsState;
    };
}
/**
 * The return type for a command action that results in scheduling a tool call.
 */
export interface ToolActionReturn {
    type: 'tool';
    toolName: string;
    toolArgs: Record<string, unknown>;
}
/**
 * The return type for a command action that results in a simple message
 * being displayed to the user.
 */
export interface MessageActionReturn {
    type: 'message';
    messageType: 'info' | 'error';
    content: string;
}
/**
 * The return type for a command action that needs to open a dialog.
 */
export interface OpenDialogActionReturn {
    type: 'dialog';
    dialog: 'help';
}
export type SlashCommandActionReturn = ToolActionReturn | MessageActionReturn | OpenDialogActionReturn;
export interface SlashCommand {
    name: string;
    altName?: string;
    description?: string;
    action?: (context: CommandContext, args: string) => void | SlashCommandActionReturn | Promise<void | SlashCommandActionReturn>;
    completion?: (context: CommandContext, partialArg: string) => Promise<string[]>;
    subCommands?: SlashCommand[];
}
