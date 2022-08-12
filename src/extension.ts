import * as vscode from 'vscode';
import { EXTENSION_NAME } from './definitions/configuration-definitions';
import { loadDisposables } from './main';

export function activate(context: vscode.ExtensionContext) {
    loadDisposables(context);

    // When the configuration changes, we dispose and reload the subscriptions.
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (! e.affectsConfiguration(EXTENSION_NAME)) {
            return;
        }
        
        context.subscriptions.forEach(disposable => disposable.dispose());
        loadDisposables(context);
    });
};