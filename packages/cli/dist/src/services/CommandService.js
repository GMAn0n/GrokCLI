/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { memoryCommand } from '../ui/commands/memoryCommand.js';
import { helpCommand } from '../ui/commands/helpCommand.js';
import { clearCommand } from '../ui/commands/clearCommand.js';
const loadBuiltInCommands = async () => [
    clearCommand,
    helpCommand,
    memoryCommand,
];
export class CommandService {
    commandLoader;
    commands = [];
    constructor(commandLoader = loadBuiltInCommands) {
        this.commandLoader = commandLoader;
        // The constructor can be used for dependency injection in the future.
    }
    async loadCommands() {
        // For now, we only load the built-in commands.
        // File-based and remote commands will be added later.
        this.commands = await this.commandLoader();
    }
    getCommands() {
        return this.commands;
    }
}
//# sourceMappingURL=CommandService.js.map