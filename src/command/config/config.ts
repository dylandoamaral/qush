// eslint-disable-next-line no-unused-vars
import minimist from "minimist";
// eslint-disable-next-line no-unused-vars
import { Command } from "../command";
import { pipe } from "fp-ts/lib/pipeable";
import { findGitRoot } from "../../utils/git";
import { readConfig, showConfig } from "../../config";
import { chain, map } from "fp-ts/lib/IOEither";

export const configCommand = (args: minimist.ParsedArgs): Command => ({
    arguments: args,
    name: "preset",
    execute: () => pipe(findGitRoot, chain(readConfig), map(showConfig), map(console.log)),
});
