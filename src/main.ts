import * as vscode from 'vscode';
import * as path from 'path';
import { Config } from './configuration';
import { Application } from './definitions/application-definitions';
import { Configuration } from './definitions/configuration-definitions';


export const Main: Application = (context: vscode.ExtensionContext) => {
    const defaultConfig: Configuration = Config();

    const self = {
        config: defaultConfig,

        setConfig: (config: Configuration) => {
            self.config = config;
        },

        loadDisposables: () => {
            const languageFilter = self.config.languageFilter;

            languageFilter.forEach(languageId => {
                context.subscriptions.push(
                    vscode.languages.registerDocumentLinkProvider(
                        {language: languageId},
                        {
                            provideDocumentLinks: self.documentLinkProvider
                        }
                    )
                );
            });
        },

        documentLinkProvider: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
            const regex = new RegExp(/.*['"]([\w\-\/:]+\.html\.twig)['"].*/, 'g');
            const links: vscode.DocumentLink[] = [];

            for (let n = 0; n < document.lineCount; n++) {
                const line = document.lineAt(n);
                const matches = Array.from(line.text.matchAll(regex)).shift() ?? [];

                if (matches.length === 0) {
                    continue;
                }

                const wholeMatch = matches[0];
                const groupMatch = matches[1];
                const startPosition = wholeMatch.indexOf(groupMatch);
                const endPosition = startPosition + groupMatch.length;
                const range = new vscode.Range(
                    new vscode.Position(line.lineNumber, startPosition),
                    new vscode.Position(line.lineNumber, endPosition)
                );

                const uri = vscode.Uri.file(self.resolveFile(groupMatch));
                const link = new vscode.DocumentLink(
                    range,
                    uri
                );

                links.push(link);
            }
            
            return links;
        },

        resolveFile: (filePath: string): string => {
            filePath = filePath.replace(/[\/:]/g, path.sep);

            let file = `${self.config.workspacePath}${path.sep}`;
            file += `${self.config.templatesRootPath}${path.sep}`;
            file += `${filePath}`;

            return file;
        },
    };

    return self;
};