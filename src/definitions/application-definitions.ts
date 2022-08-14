import * as vscode from 'vscode';
import { Configuration } from './configuration-definitions';


export type Application = (context: vscode.ExtensionContext) => {
    loadDisposables: () => void;
    setConfig: (config: Configuration) => void;
};