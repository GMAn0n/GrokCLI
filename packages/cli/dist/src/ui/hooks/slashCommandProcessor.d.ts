/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type PartListUnion } from '@google/genai';
import { UseHistoryManagerReturn } from './useHistoryManager.js';
import { Config } from '@grok/grok-cli-core';
import { HistoryItemWithoutId, HistoryItem, SlashCommandProcessorResult } from '../types.js';
import { LoadedSettings } from '../../config/settings.js';
import { type CommandContext, type SlashCommandActionReturn, type SlashCommand } from '../commands/types.js';
export interface LegacySlashCommand {
    name: string;
    altName?: string;
    description?: string;
    completion?: () => Promise<string[]>;
    action: (mainCommand: string, subCommand?: string, args?: string) => void | SlashCommandActionReturn | Promise<void | SlashCommandActionReturn>;
}
/**
 * Hook to define and process slash commands (e.g., /help, /clear).
 */
export declare const useSlashCommandProcessor: (config: Config | null, settings: LoadedSettings, history: HistoryItem[], addItem: UseHistoryManagerReturn["addItem"], clearItems: UseHistoryManagerReturn["clearItems"], loadHistory: UseHistoryManagerReturn["loadHistory"], refreshStatic: () => void, setShowHelp: React.Dispatch<React.SetStateAction<boolean>>, onDebugMessage: (message: string) => void, openThemeDialog: () => void, openAuthDialog: () => void, openEditorDialog: () => void, toggleCorgiMode: () => void, showToolDescriptions: boolean | undefined, setQuittingMessages: (message: HistoryItem[]) => void, openPrivacyNotice: () => void) => {
    handleSlashCommand: (rawQuery: PartListUnion) => Promise<SlashCommandProcessorResult | false>;
    slashCommands: SlashCommand[];
    pendingHistoryItems: HistoryItemWithoutId[];
    commandContext: CommandContext;
};
