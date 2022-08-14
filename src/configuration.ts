import * as vscode from 'vscode';
import { Configuration, EXTENSION_NAME } from "./definitions/configuration-definitions";

export const Config = (): Configuration => {
    const resolver = vscode.workspace.getConfiguration(EXTENSION_NAME);
    const config: Configuration = {
        workspacePath: vscode.workspace.workspaceFolders[0]?.uri.fsPath ?? "",
        templatesRootPath: resolver.get('templatesRootPath'),
        languageFilter: resolver.get('languageFilter'),
        bundleMode: resolver.get('bundleMode'),
    };

    return config;
};