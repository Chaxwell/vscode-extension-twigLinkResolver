"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const configuration_1 = require("./configuration");
const configuration_definitions_1 = require("./definitions/configuration-definitions");
const main_1 = require("./main");
function activate(context) {
    const main = (0, main_1.Main)(context);
    main.loadDisposables();
    // When the configuration changes, we dispose and reload the subscriptions.
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (!e.affectsConfiguration(configuration_definitions_1.EXTENSION_NAME)) {
            return;
        }
        context.subscriptions.forEach(disposable => disposable.dispose());
        main.setConfig((0, configuration_1.Config)());
        main.loadDisposables();
    });
}
exports.activate = activate;
;
//# sourceMappingURL=extension.js.map