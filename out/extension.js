"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const configuration_definitions_1 = require("./definitions/configuration-definitions");
const main_1 = require("./main");
function activate(context) {
    (0, main_1.loadDisposables)(context);
    // When the configuration changes, we dispose and reload the subscriptions.
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (!e.affectsConfiguration(configuration_definitions_1.EXTENSION_NAME)) {
            return;
        }
        context.subscriptions.forEach(disposable => disposable.dispose());
        (0, main_1.loadDisposables)(context);
    });
}
exports.activate = activate;
;
//# sourceMappingURL=extension.js.map