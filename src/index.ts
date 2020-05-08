#!/usr/bin/env node

import { pipe } from "fp-ts/lib/pipeable";
import {
  loadArguments,
  routeCommands,
  executeCommand,
  showError,
} from "./command/command";
import { IO } from "fp-ts/lib/IO";
import { getOrElse } from "fp-ts/lib/IOEither";

/** 
const serializer = new TypedJSON(Preset);

const args: minimist.ParsedArgs = minimist(process.argv.slice(2));

const config_path = `${process.cwd()}/acp.config.json`;
const raw = fs.existsSync(config_path) ? JSON.parse(fs.readFileSync(config_path, { encoding: "utf8" })) : json;
const preset = serializer.parse(
    pipe(
        typify(raw),
        getOrElse(() => typed_json)
    )
);


const show_error = (errors: string[]): void => {
    console.error("Error(s) occured during the acp process.");
    errors.forEach((error) => console.error(`${space}${error}`));
};

const help = args["H"] === true || args["help"] === true;

if (help || args._.length == 0) {
    help_lines(preset).forEach((line) => {
        console.log(line);
    });
} else {
    pipe(validate(args, preset), fold(show_error, execute));
}
*/

// start here
const program: IO<void> = pipe(
  loadArguments(),
  routeCommands,
  executeCommand,
  getOrElse(showError)
);

program();
