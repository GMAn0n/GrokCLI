/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { SlashCommand } from '../ui/commands/types.js';
export declare class CommandService {
    private commandLoader;
    private commands;
    constructor(commandLoader?: () => Promise<SlashCommand[]>);
    loadCommands(): Promise<void>;
    getCommands(): SlashCommand[];
}
