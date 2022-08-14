"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const vscode = require("vscode");
const path = require("path");
const configuration_1 = require("./configuration");
const Main = (context) => {
    const defaultConfig = (0, configuration_1.Config)();
    const self = {
        config: defaultConfig,
        setConfig: (config) => {
            self.config = config;
        },
        loadDisposables: () => {
            const languageFilter = self.config.languageFilter;
            languageFilter.forEach(languageId => {
                context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: languageId }, {
                    provideDocumentLinks: self.documentLinkProvider
                }));
            });
        },
        documentLinkProvider: (document, token) => {
            const regex = new RegExp(/.*['"]([\w\-\/:]+\.html\.twig)['"].*/, 'g');
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
                const uri = vscode.Uri.file(self.resolveFile(groupMatch));
                const link = new vscode.DocumentLink(range, uri);
                links.push(link);
            }
            return links;
        },
        resolveFile: (filePath) => {
            filePath = filePath.replace(/[\/:]/g, path.sep);
            let file = `${self.config.workspacePath}${path.sep}`;
            file += `${self.config.templatesRootPath}${path.sep}`;
            if (self.config.bundleMode) {
                const bundleName = filePath.substring(0, filePath.indexOf(path.sep));
                // We insert the resources/views hierarchy.
                filePath = filePath.replace(bundleName, `${bundleName}${path.sep}resources${path.sep}views`);
            }
            file += `${filePath}`;
            return file;
        },
    };
    return self;
};
exports.Main = Main;
//# sourceMappingURL=main.js.map