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
    const regex = new RegExp(/[^'"]+\.twig/, 'gi');
    const links: vscode.DocumentLink[] = [];

    for (let n = 0; n < document.lineCount; n++) {
        const line = document.lineAt(n);
        const matches = Array.from(line.text.matchAll(regex));

        if (matches.length === 0) {
            continue;
        }

        matches.forEach(match => {
            const theMatch = match[0];
            const startPosition = line.text.lastIndexOf(theMatch);
            const endPosition = startPosition + theMatch.length;

            const range = new vscode.Range(
                new vscode.Position(line.lineNumber, startPosition),
                new vscode.Position(line.lineNumber, endPosition)
            );

            const uri = vscode.Uri.file(resolveFile(theMatch));
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
    filePath = filePath.replace(/\//g, path.sep);

    const matchExactNamespace = (filePath: string, nsLength: number, namespace: string) => {
        return filePath.slice(0, nsLength + 1) === namespace + '/'
    }

    for (const {namespace, folderPath} of configuration.loaderPaths) {
        const nsLength = namespace.length;

        if (nsLength === 0) {
            return `${configuration.workspacePath}${path.sep}${folderPath}${path.sep}${filePath}`;
        }

        if (! matchExactNamespace(filePath, nsLength, namespace)) {
            continue;
        }

        const filePathToResolve = filePath.replace(`${namespace}`, folderPath);

        return `${configuration.workspacePath}${path.sep}${filePathToResolve}`;
    }

    let result = `${configuration.workspacePath}${path.sep}`;
    result += `${configuration.templatesRootPath}${path.sep}`;
    result += `${filePath}`;

    return result;
};
