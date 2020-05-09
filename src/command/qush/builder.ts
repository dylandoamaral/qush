// eslint-disable-next-line no-unused-vars
import Preset from "../../preset";

export const add = (path: string): string => {
    return `git add ${path}`;
};

export const commit = (args: string[], preset: Preset): string => {
    let message = "";
    if (args.length == 1) message = preset.template.replace("<message>", args[0]);
    else if (args.length == 2)
        message = preset.template.replace("<action>", preset.actions.get(args[0]).value).replace("<message>", args[1]);
    else
        message = preset.template
            .replace("<action>", preset.actions.get(args[0]).value)
            .replace("<target>", preset.targets.get(args[1]).value)
            .replace("<message>", args[2]);
    return `git commit -m "${message}"`;
};

export const push = (branch: string): string => {
    return `git push origin ${branch}`;
};
