import * as vscode from 'vscode';
import { Config } from './configuration';
import { EXTENSION_NAME } from './definitions/configuration-definitions';
import { Main } from './main';

export function activate(context: vscode.ExtensionContext) {
    const main = Main(context);
    main.loadDisposables();

    // When the configuration changes, we dispose and reload the subscriptions.
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (! e.affectsConfiguration(EXTENSION_NAME)) {
            return;
        }
        
        context.subscriptions.forEach(disposable => disposable.dispose());
        main.setConfig(Config());
        main.loadDisposables();
    });
};
