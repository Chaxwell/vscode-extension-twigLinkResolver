"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const vscode = require("vscode");
const configuration_definitions_1 = require("./definitions/configuration-definitions");
const Config = () => {
    const resolver = vscode.workspace.getConfiguration(configuration_definitions_1.EXTENSION_NAME);
    const config = {
        workspacePath: vscode.workspace.workspaceFolders[0]?.uri.fsPath ?? "",
        templatesRootPath: resolver.get('templatesRootPath'),
        languageFilter: resolver.get('languageFilter'),
        bundleMode: resolver.get('bundleMode'),
    };
    return config;
};
exports.Config = Config;
//# sourceMappingURL=configuration.js.map