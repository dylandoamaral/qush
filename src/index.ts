import minimist from "minimist";
import { TypedJSON } from "typedjson";

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
    console.log(commands); 
    // then execute them
} catch (e) {
    console.error(e);
}
