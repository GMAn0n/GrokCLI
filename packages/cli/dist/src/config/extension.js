/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
export const EXTENSIONS_DIRECTORY_NAME = path.join('.grok', 'extensions');
export const EXTENSIONS_CONFIG_FILENAME = 'grok-extension.json';
export function loadExtensions(workspaceDir) {
    const allExtensions = [
        ...loadExtensionsFromDir(workspaceDir),
        ...loadExtensionsFromDir(os.homedir()),
    ];
    const uniqueExtensions = new Map();
    for (const extension of allExtensions) {
        if (!uniqueExtensions.has(extension.config.name)) {
            console.log(`Loading extension: ${extension.config.name} (version: ${extension.config.version})`);
            uniqueExtensions.set(extension.config.name, extension);
        }
    }
    return Array.from(uniqueExtensions.values());
}
function loadExtensionsFromDir(dir) {
    const extensionsDir = path.join(dir, EXTENSIONS_DIRECTORY_NAME);
    if (!fs.existsSync(extensionsDir)) {
        return [];
    }
    const extensions = [];
    for (const subdir of fs.readdirSync(extensionsDir)) {
        const extensionDir = path.join(extensionsDir, subdir);
        const extension = loadExtension(extensionDir);
        if (extension != null) {
            extensions.push(extension);
        }
    }
    return extensions;
}
function loadExtension(extensionDir) {
    if (!fs.statSync(extensionDir).isDirectory()) {
        console.error(`Warning: unexpected file ${extensionDir} in extensions directory.`);
        return null;
    }
    const configFilePath = path.join(extensionDir, EXTENSIONS_CONFIG_FILENAME);
    if (!fs.existsSync(configFilePath)) {
        console.error(`Warning: extension directory ${extensionDir} does not contain a config file ${configFilePath}.`);
        return null;
    }
    try {
        const configContent = fs.readFileSync(configFilePath, 'utf-8');
        const config = JSON.parse(configContent);
        if (!config.name || !config.version) {
            console.error(`Invalid extension config in ${configFilePath}: missing name or version.`);
            return null;
        }
        const contextFiles = getContextFileNames(config)
            .map((contextFileName) => path.join(extensionDir, contextFileName))
            .filter((contextFilePath) => fs.existsSync(contextFilePath));
        return {
            config,
            contextFiles,
        };
    }
    catch (e) {
        console.error(`Warning: error parsing extension config in ${configFilePath}: ${e}`);
        return null;
    }
}
function getContextFileNames(config) {
    if (!config.contextFileName) {
        return ['GROK.md'];
    }
    else if (!Array.isArray(config.contextFileName)) {
        return [config.contextFileName];
    }
    return config.contextFileName;
}
export function filterActiveExtensions(extensions, enabledExtensionNames) {
    if (enabledExtensionNames.length === 0) {
        return extensions;
    }
    const lowerCaseEnabledExtensions = new Set(enabledExtensionNames.map((e) => e.trim().toLowerCase()));
    if (lowerCaseEnabledExtensions.size === 1 &&
        lowerCaseEnabledExtensions.has('none')) {
        if (extensions.length > 0) {
            console.log('All extensions are disabled.');
        }
        return [];
    }
    const activeExtensions = [];
    const notFoundNames = new Set(lowerCaseEnabledExtensions);
    for (const extension of extensions) {
        const lowerCaseName = extension.config.name.toLowerCase();
        if (lowerCaseEnabledExtensions.has(lowerCaseName)) {
            console.log(`Activated extension: ${extension.config.name} (version: ${extension.config.version})`);
            activeExtensions.push(extension);
            notFoundNames.delete(lowerCaseName);
        }
        else {
            console.log(`Disabled extension: ${extension.config.name}`);
        }
    }
    for (const requestedName of notFoundNames) {
        console.log(`Extension not found: ${requestedName}`);
    }
    return activeExtensions;
}
//# sourceMappingURL=extension.js.map