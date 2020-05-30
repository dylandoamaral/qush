export const errorGitIsInstalled = (): string => "the command git doesn't exist in this session";

export const errorUpdateRemoteFailed = (): string => "impossible to update repository from remote";

export const errorFolderIsGitRepo = (): string => "the command is running outside à git repository";

export const errorFolderIsNotUpToDate = (): string => "nothing to push, the repository is up to data";

export const errorFolderDontNeedPull = (): string =>
    "the current repository is not up to data, you have to pull before use this command.";

export const errorNoFile = (field: string): string => `can't find the file "${field}"`;

export const errorObjectHasNoAttribute = (ObjectName: string, attribute: string): string =>
    `the ${ObjectName} has no attribute ${attribute}`;

export const errorObjectIsNotType = (attributeName: string, type: string): string =>
    `the object  ${attributeName} is not of type ${type}`;

export const errorObjectIsNotTypeArray = (attributeName: string, type: string): string =>
    `the attribute ${attributeName} is not of type Array[${type}]`;
