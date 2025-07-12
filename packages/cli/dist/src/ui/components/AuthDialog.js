import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Colors } from '../colors.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { SettingScope } from '../../config/settings.js';
import { AuthType } from '@grok/grok-cli-core';
import { validateAuthMethod } from '../../config/auth.js';
export function AuthDialog({ onSelect, settings, initialErrorMessage, }) {
    const [errorMessage, setErrorMessage] = useState(initialErrorMessage
        ? initialErrorMessage
        : process.env.XAI_API_KEY
            ? 'Existing API key detected (XAI_API_KEY). Select "Grok (xAI) API Key" option to use it.'
            : null);
    const items = [
        {
            label: 'Login with Google',
            value: AuthType.OAUTH,
        },
        ...(process.env.CLOUD_SHELL === 'true'
            ? [
                {
                    label: 'Use Cloud Shell user credentials',
                    value: AuthType.CLOUD_SHELL,
                },
            ]
            : []),
        {
            label: 'Grok (xAI) API Key',
            value: AuthType.USE_GROK,
        },
    ];
    const initialAuthIndex = items.findIndex((item) => {
        if (settings.merged.selectedAuthType) {
            return item.value === settings.merged.selectedAuthType;
        }
        if (process.env.XAI_API_KEY) {
            return item.value === AuthType.USE_GROK;
        }
        return item.value === AuthType.OAUTH;
    });
    const handleAuthSelect = (authMethod) => {
        const error = validateAuthMethod(authMethod);
        if (error) {
            setErrorMessage(error);
        }
        else {
            setErrorMessage(null);
            onSelect(authMethod, SettingScope.User);
        }
    };
    useInput((_input, key) => {
        if (key.escape) {
            // Prevent exit if there is an error message.
            // This means they user is not authenticated yet.
            if (errorMessage) {
                return;
            }
            if (settings.merged.selectedAuthType === undefined) {
                // Prevent exiting if no auth method is set
                setErrorMessage('You must select an auth method to proceed. Press Ctrl+C twice to exit.');
                return;
            }
            onSelect(undefined, SettingScope.User);
        }
    });
    return (_jsxs(Box, { borderStyle: "round", borderColor: Colors.Gray, flexDirection: "column", padding: 1, width: "100%", children: [_jsx(Text, { bold: true, children: "Get started" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { children: "How would you like to authenticate for this project?" }) }), _jsx(Box, { marginTop: 1, children: _jsx(RadioButtonSelect, { items: items, initialIndex: initialAuthIndex, onSelect: handleAuthSelect, isFocused: true }) }), errorMessage && (_jsx(Box, { marginTop: 1, children: _jsx(Text, { color: Colors.AccentRed, children: errorMessage }) })), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: Colors.Gray, children: "(Use Enter to select)" }) }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { children: "Terms of Services and Privacy Notice for GrokCLI" }) }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: Colors.AccentBlue, children: 'https://github.com/xai-org/grok-cli/blob/main/docs/tos-privacy.md' }) })] }));
}
//# sourceMappingURL=AuthDialog.js.map