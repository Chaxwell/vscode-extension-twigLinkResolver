export type Configuration = {
    workspacePath: string;
    templatesRootPath: string;
    languageFilter: Array<string>;
    loaderPaths: Array<LoaderPath>;
};

type LoaderPath = {namespace: Namespace, folderPath: FolderRelativePath};
type Namespace = string;
type FolderRelativePath = string;

export const EXTENSION_NAME = 'twigLinkResolver';