export type Configuration = {
    workspacePath: string;
    templatesRootPath: string;
    languageFilter: Array<string>;
    bundleMode: boolean;
};

export const EXTENSION_NAME = 'twigLinkResolver';