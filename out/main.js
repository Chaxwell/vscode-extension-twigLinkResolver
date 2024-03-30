"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFile = exports.documentLinkProvider = exports.loadDisposables = void 0;
const vscode = require("vscode");
const path = require("path");
const configuration_1 = require("./configuration");
/**
 * @public
 */
const loadDisposables = (context) => {
    const { languageFilter } = (0, configuration_1.getConfiguration)();
    languageFilter.forEach(languageId => {
        context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: languageId }, {
            provideDocumentLinks: exports.documentLinkProvider
        }));
    });
};
exports.loadDisposables = loadDisposables;
/**
 * @private
 */
const documentLinkProvider = (document, token) => {
    const regex = new RegExp(/.*?['"](.+?\.twig)['"]/, 'gi');
    const links = [];
    for (let n = 0; n < document.lineCount; n++) {
        const line = document.lineAt(n);
        const matches = Array.from(line.text.matchAll(regex));
        if (matches.length === 0) {
            continue;
        }
        let contentVisited = "";
        matches.forEach(match => {
            const wholeMatch = match[0];
            contentVisited += wholeMatch;
            const groupMatch = match[1];
            const startPosition = contentVisited.lastIndexOf(groupMatch);
            const endPosition = startPosition + groupMatch.length;
            const range = new vscode.Range(new vscode.Position(line.lineNumber, startPosition), new vscode.Position(line.lineNumber, endPosition));
            const uri = vscode.Uri.file((0, exports.resolveFile)(groupMatch));
            const link = new vscode.DocumentLink(range, uri);
            links.push(link);
        });
    }
    return links;
};
exports.documentLinkProvider = documentLinkProvider;
/**
 * @private
 */
const resolveFile = (filePath) => {
    const configuration = (0, configuration_1.getConfiguration)();
    filePath = filePath.replace(/\//g, path.sep);
    const matchExactNamespace = (filePath, nsLength, namespace) => {
        return filePath.slice(0, nsLength + 1) === namespace + '/';
    };
    for (const { namespace, folderPath } of configuration.loaderPaths) {
        const nsLength = namespace.length;
        if (nsLength === 0) {
            return `${configuration.workspacePath}${path.sep}${folderPath}${path.sep}${filePath}`;
        }
        if (!matchExactNamespace(filePath, nsLength, namespace)) {
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
exports.resolveFile = resolveFile;
//# sourceMappingURL=main.js.map