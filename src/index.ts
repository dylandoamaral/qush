#!/usr/bin/env node

import minimist from "minimist";
import { TypedJSON } from "typedjson";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";

import json from "./preset.typed.json";
import Preset from "./preset";
import validate from "./validator";
import { add, commit, push } from "./builder";
import { typify } from "./translator";
import { get_flags } from "./flags";
import { help_lines } from "./help";

const serializer = new TypedJSON(Preset);

const args: minimist.ParsedArgs = minimist(process.argv.slice(2));

const config_path = `${process.cwd()}/acp.config.json`;
const raw = fs.existsSync(config_path) ? JSON.parse(fs.readFileSync(config_path, { encoding: "utf8" })) : json;
const preset = serializer.parse(typify(raw));

try {
    const help = args["H"] === true || args["help"] === true;
    if (help) {
        help_lines(preset).forEach(line => {
            console.log(line);
        });
    } else {
        const branch = execSync("git branch --show-current").toString();
        const sources = get_flags(args, "S", "source");
        validate(args._, preset);
        const adds = sources.length === 0 ? [add(".")] : sources.map((source) => add(source));
        const commands = [...adds, commit(args._, preset), push(branch)];
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
    }
} catch (e) {
    console.error(e);
}
