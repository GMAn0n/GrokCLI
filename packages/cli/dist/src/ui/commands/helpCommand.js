/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export const helpCommand = {
    name: 'help',
    altName: '?',
    description: 'for help on gemini-cli',
    action: (_context, _args) => {
        console.debug('Opening help UI ...');
        return {
            type: 'dialog',
            dialog: 'help',
        };
    },
};
//# sourceMappingURL=helpCommand.js.map