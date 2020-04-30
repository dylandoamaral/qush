#!/usr/bin/env node

import minimist from "minimist";
import { TypedJSON } from "typedjson";
import fs from "fs";

import json from "./preset.default.json";
import Preset from "./preset";
import validate from "./command/acp/validator";
import { typify } from "./command/acp/translator";
import { help_lines } from "./command/help/help";

import { pipe } from "fp-ts/lib/pipeable";
import { space } from "./utils/format";
import { execute } from "./command/acp/acp";
import { fold } from "fp-ts/lib/Either";

const serializer = new TypedJSON(Preset);

const args: minimist.ParsedArgs = minimist(process.argv.slice(2));

const config_path = `${process.cwd()}/acp.config.json`;
const raw = fs.existsSync(config_path) ? JSON.parse(fs.readFileSync(config_path, { encoding: "utf8" })) : json;
const preset = serializer.parse(typify(raw));

const show_error = (errors: string[]): void => {
    console.error("Error(s) occured during the acp process.");
    errors.forEach((error) => `${space}${error}`);
};

try {
    const help = args["H"] === true || args["help"] === true;

    if (help) {
        help_lines(preset).forEach((line) => {
            console.log(line);
        });
    } else {
        pipe(validate(args, preset), fold(show_error, execute));
    }
} catch (e) {
    console.error(e);
}
