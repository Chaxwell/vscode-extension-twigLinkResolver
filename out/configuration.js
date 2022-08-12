"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = void 0;
const vscode = require("vscode");
const configuration_definitions_1 = require("./definitions/configuration-definitions");
const getConfiguration = () => {
    const resolver = vscode.workspace.getConfiguration(configuration_definitions_1.EXTENSION_NAME);
    const config = {
        workspacePath: vscode.workspace.workspaceFolders[0]?.uri.fsPath ?? "",
        templatesRootPath: resolver.get('templatesRootPath'),
        languageFilter: resolver.get('languageFilter'),
    };
    return config;
};
exports.getConfiguration = getConfiguration;
//# sourceMappingURL=configuration.js.map