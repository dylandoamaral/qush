// eslint-disable-next-line no-unused-vars
import { Config, applyTemplate, fromsToTos } from "../../config";

export const add = (path: string): string => {
    return `git add ${path}`;
};

export const commit = (args: string[], config: Config): string => {
    const argsSize = args.length;
    const froms = args.slice(0, argsSize - 1);
    const message = args.slice(-1)[0];
    const answer = applyTemplate(config)(message, fromsToTos(config)(froms));
    return `git commit -m "${answer}"`;
    
};

export const push = (branch: string): string => {
    return `git push origin ${branch}`;
};
