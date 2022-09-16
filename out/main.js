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
    const regex = new RegExp(/.*['"]([\w\-\/:]+(?:\.html)?\.twig)['"].*/, 'gi');
    const links = [];
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
        const range = new vscode.Range(new vscode.Position(line.lineNumber, startPosition), new vscode.Position(line.lineNumber, endPosition));
        const uri = vscode.Uri.file((0, exports.resolveFile)(groupMatch));
        const link = new vscode.DocumentLink(range, uri);
        links.push(link);
    }
    return links;
};
exports.documentLinkProvider = documentLinkProvider;
/**
 * @private
 */
const resolveFile = (filePath) => {
    const configuration = (0, configuration_1.getConfiguration)();
    filePath = filePath.replace(/[\/:]/g, path.sep);
    let file = `${configuration.workspacePath}${path.sep}`;
    file += `${configuration.templatesRootPath}${path.sep}`;
    file += `${filePath}`;
    return file;
};
exports.resolveFile = resolveFile;
//# sourceMappingURL=main.js.map