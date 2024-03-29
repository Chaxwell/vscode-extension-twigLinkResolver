import * as vscode from 'vscode';
import * as path from 'path';
import { getConfiguration } from './configuration';

/**
 * @public
 */
export const loadDisposables = (context: vscode.ExtensionContext) => {
    const { languageFilter } = getConfiguration();

    languageFilter.forEach(languageId => {
        context.subscriptions.push(
            vscode.languages.registerDocumentLinkProvider(
                {language: languageId},
                {
                    provideDocumentLinks: documentLinkProvider
                }
            )
        );
    });
};

/**
 * @private
 */
export const documentLinkProvider = (document: vscode.TextDocument, token: vscode.CancellationToken) => {
    const regex = new RegExp(/.*?['"](.+?\.twig)['"]/, 'gi');
    const links: vscode.DocumentLink[] = [];

    for (let n = 0; n < document.lineCount; n++) {
        const line = document.lineAt(n);
        const matches = Array.from(line.text.matchAll(regex));

        if (matches.length === 0) {
            continue;
        }

        let contentVisited: string = "";
        matches.forEach(match => {
            const wholeMatch = match[0];
            contentVisited += wholeMatch;

            const groupMatch = match[1];
            const startPosition = contentVisited.lastIndexOf(groupMatch);
            const endPosition = startPosition + groupMatch.length;

            const range = new vscode.Range(
                new vscode.Position(line.lineNumber, startPosition),
                new vscode.Position(line.lineNumber, endPosition)
            );

            const uri = vscode.Uri.file(resolveFile(groupMatch));
            const link = new vscode.DocumentLink(
                range,
                uri
            );

            links.push(link);
        });
    }

    return links;
};

/**
 * @private
 */
export const resolveFile = (filePath: string): string => {
    const configuration = getConfiguration();

    filePath = filePath.replace(/[\/:]/g, path.sep);

    let file = `${configuration.workspacePath}${path.sep}`;
    file += `${configuration.templatesRootPath}${path.sep}`;
    file += `${filePath}`;

    return file;
};
