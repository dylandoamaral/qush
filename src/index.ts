#!/usr/bin/env node

import minimist from "minimist";
import { TypedJSON } from "typedjson";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";

import json from "./preset.default.json";
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


const get_commit_id = (args: string, name: string) => {
    try{
        return execSync(`git rev-parse ${args}`, {stdio: "ignore"}).toString();
    }catch{
        return `${name}: failed`;
    }
};

try {
    const help = args["H"] === true || args["help"] === true;
    const yes = args["Y"] === true || args["yes"] === true;

    if (help) {
        help_lines(preset).forEach((line) => {
            console.log(line);
        });
    } else {
        const update = execSync("git status --porcelain").toString() === "" ? true : false; 

        execSync("git fetch");
        const base = get_commit_id("@ @{u}", "base");
        const local = get_commit_id("@", "local");

        if(update){
            console.log("There is nothing to push");
        }else if(local === base){
            console.log("The current repository is not up to data, you have to pull before use this command.");
        }else{
            const branch = execSync("git branch --show-current").toString();
            const sources = get_flags(args, "S", "source");
            validate(args._, preset);
            const adds = sources.length === 0 ? [add(".")] : sources.map((source) => add(source));
            const commands = [...adds, commit(args._, preset), push(branch)];

            if (yes) {
                ["Acp execute these following commands for you", commands.map((c) => `    - ${c}`).join("\n")].forEach((command) =>
                    console.log(command)
                );
                commands.forEach((command) => execSync(command));
            } else {
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
        }
    }
} catch (e) {
    console.error(e);
}
