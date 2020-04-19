import minimist from "minimist";
import { TypedJSON } from "typedjson";
import { execSync } from "child_process";
import inquirer from "inquirer";

import json from "./preset.test.json";
import Preset from "./preset";
import validate from "./validator";
import { add, commit, push } from "./builder";

const serializer = new TypedJSON(Preset);

const args: minimist.ParsedArgs = minimist(process.argv.slice(2));
const preset = serializer.parse(json);

try {
    validate(args._, preset);
    const commands = [add(), commit(args._, preset), push()];
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "value",
                message: [
                    "Acp is going to execute these following commands for you",
                    commands.map((c) => `    - ${c}`).join("\n"),
                    "Are you agree to run them ?",
                ].join("\n"),
                default: function () {
                    return false;
                },
            },
        ])
        .then((answers) => {
            if (answers.value) commands.forEach((command) => execSync(command));
            else console.log("commands canceled with sucess !");
        });
} catch (e) {
    console.error(e);
}
