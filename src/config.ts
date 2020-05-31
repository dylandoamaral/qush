import "reflect-metadata";
import { Type, plainToClass } from "class-transformer";
import fs from "fs";
// eslint-disable-next-line no-unused-vars
import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
// eslint-disable-next-line no-unused-vars
import { NonEmptyArray, getSemigroup } from "fp-ts/lib/NonEmptyArray";
import { pipe } from "fp-ts/lib/pipeable";
import { bold } from "chalk";
import { space } from "./utils/format";
// eslint-disable-next-line no-unused-vars
import { IO, map } from "fp-ts/lib/IO";
import { merge, applicativeValidation } from "./utils/functionnal";
import config from "./asset/default.config.json";
// eslint-disable-next-line no-unused-vars
import { getValidation, Either, left, right, map as eitherMap, chain } from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { array } from "fp-ts/lib/Array";
import { constVoid } from "fp-ts/lib/function";
import {
    errorObjectHasNoAttribute,
    errorObjectIsNotType,
    errorObjectIsNotTypeArray,
    errorTemplateInstructionNotInInstructions,
} from "./utils/error";

export class Element {
    from: string;
    to: string;
    description: string;
}

export class Instruction {
    name: string;
    description: string;

    @Type(() => Element)
    elements: Element[];
}

export class Config {
    name: string;
    contributors: string[];
    version: string;
    template: string;

    @Type(() => Instruction)
    instructions: Instruction[];
}

export const plainToConfig = (file: string): Config => plainToClass(Config, JSON.parse(file));

/**
 * read a file if it exists or return the default config file
 * @param path
 */
export const readFile = (path: string): IO<string> =>
    pipe(
        tryCatch(
            () => fs.readFileSync(path, "utf8"),
            () => JSON.stringify(config)
        ),
        merge
    );

/**
 * read a config from a particular path
 * @param path
 */
export const readConfig = (path: string): IOEither<NonEmptyArray<string>, Config> => {
    const configPath = `${path}/default.config.json`;

    return pipe(readFile(configPath), map(plainToConfig), map(validateConfig));
};

/**
 * show an element representation
 * @param element
 */
export const showElement = (element: Element): String =>
    element.description != undefined
        ? `${element.from} => ${element.to} : ${element.description}`
        : `${element.from} => ${element.to}`;

/**
 * show an instruction represention
 * @param instruction
 */
export const showInstruction = (instruction: Instruction): String => {
    const name = bold(instruction.name);

    return [
        instruction.description != undefined ? `${name} (${instruction.description}):` : `${name}:`,
        instruction.elements
            .map(showElement)
            .map((element) => `${space}${element}`)
            .join("\n"),
    ].join("\n");
};

/**
 * show a config representation
 * @param config
 */
export const showConfig = (config: Config): string => {
    const version = config.version != undefined ? ` (${config.version})` : "";
    return [
        `The current space use the config ${bold(config.name)} made by ${bold(config.contributors.join(", "))}${version}: `,
        "",
        `${bold("template:")} ${config.template}`,
        "",
        `${bold("instructions:")}`,
        config.instructions
            .map(showInstruction)
            .map((instruction) => `> ${instruction}`)
            .join("\n"),
        "",
        `${bold("examples:")}`,
        ["", "", ""].map(() => `${space}${showExample(config)}`).join("\n"),
    ].join("\n");
};

/**
 * show an example to use a particular config
 * @param config
 */
export const showExample = (config: Config): string => {
    const randomElements = config.instructions.map(randomElementFromInstruction);
    const command = `qush ${randomElements.map((element) => element.from).join(" ")}`;
    const result = `${applyTemplate(config)(
        "my commit",
        randomElements.map((element) => element.to)
    )}`;
    return `${command} => ${result}`;
};

/**
 * validate if an object has a certain attribute
 * @param object
 * @param ObjectName
 * @param2 attribute
 */
export const validateAttributeExist = (object: any, ObjectName: string) => (
    attribute: string
): Either<NonEmptyArray<string>, void> => {
    if (object[attribute] != undefined) return right(null);
    else return left([errorObjectHasNoAttribute(ObjectName, attribute)]);
};

/**
 * validate if an attribute as a certain type
 * @param attribute
 * @param attributeName
 * @param2 type
 */
export const validateAttributeType = (attribute: any, attributeName: string) => (
    type: string
): Either<NonEmptyArray<string>, void> => {
    if (typeof attribute == type) return right(null);
    else return left([errorObjectIsNotType(attributeName, type)]);
};

/**
 * validate if an attribute is an array and if it is composed by a certain type
 * @param attribute
 * @param attributeName
 * @param2 type
 */
export const validateAttributeTypeArray = <T>(attribute: Array<T>, attributeName: string) => (
    type: string
): Either<NonEmptyArray<string>, void> => {
    if (Array.isArray(attribute) && attribute.map((element) => typeof element == type).includes(false) == false)
        return right(null);
    else return left([errorObjectIsNotTypeArray(attributeName, type)]);
};

/**
 * validate if an element is well done or else return the errors
 * @param element
 * @param index the index of the element
 * @param indexInstruction the indes of the instruction
 */

export const validateElement = (
    element: Element,
    index: number,
    indexInstruction: number
): Either<NonEmptyArray<string>, void> => {
    const validateAttributeExistElement = validateAttributeExist(
        element,
        `element n°${index} of instruction n°${indexInstruction}`
    );

    const validateFrom = (element: Element): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistElement("from"),
            chain(() => validateAttributeType(element.from, "from")("string"))
        );

    const validateTo = (element: Element): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistElement("to"),
            chain(() => validateAttributeType(element.to, "to")("string"))
        );

    return pipe(sequenceT(applicativeValidation)(validateFrom(element), validateTo(element)), eitherMap(constVoid));
};

/**
 * validate if an instruction is well done or else return the errors
 * @param instruction
 * @param index the index of the instruction
 */
export const validateInstruction = (instruction: Instruction, index: number): Either<NonEmptyArray<string>, void> => {
    const validateAttributeExistInstruction = validateAttributeExist(instruction, `instruction n°${index}`);

    const validateName = (instruction: Instruction): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistInstruction("name"),
            chain(() => validateAttributeType(instruction.name, "name")("string"))
        );

    const validateElements = (instruction: Instruction): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistInstruction("elements"),
            chain(() => validateAttributeTypeArray(instruction.elements, "elements")("object")),
            chain(() => array.sequence(applicativeValidation)(instruction.elements.map((v, i) => validateElement(v, i, index)))),
            eitherMap(constVoid)
        );

    return pipe(sequenceT(applicativeValidation)(validateName(instruction), validateElements(instruction)), eitherMap(constVoid));
};

/**
 * validate if a config is well done or else return the errors
 * @param config
 */
export const validateConfig = (config: Config): Either<NonEmptyArray<string>, Config> => {
    const validateAttributeExistConfig = validateAttributeExist(config, "config");

    const validateName = (config: Config): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistConfig("name"),
            chain(() => validateAttributeType(config.name, "name")("string"))
        );

    const validateContributors = (config: Config): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistConfig("contributors"),
            chain(() => validateAttributeTypeArray(config.contributors, "contributors")("string"))
        );

    const validateTemplate = (config: Config): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistConfig("template"),
            chain(() => validateAttributeType(config.template, "template")("string"))
        );

    const validateInstructions = (config: Config): Either<NonEmptyArray<string>, void> =>
        pipe(
            validateAttributeExistConfig("instructions"),
            chain(() => validateAttributeTypeArray(config.instructions, "instructions")("object")),
            chain(() => array.sequence(applicativeValidation)(config.instructions.map((v, i) => validateInstruction(v, i)))),
            chain(() => validateCoherenceTemplateInstructions(config)),
            eitherMap(constVoid)
        );

    return pipe(
        sequenceT(applicativeValidation)(
            validateName(config),
            validateContributors(config),
            validateTemplate(config),
            validateInstructions(config)
        ),
        chain(() => validateCoherenceTemplateInstructions(config)),
        eitherMap(() => config)
    );
};

/**
 * validate a preset according to the coherence between the template and the instructions
 * @param config 
 */
export const validateCoherenceTemplateInstructions = (config: Config): Either<NonEmptyArray<string>, void> => {
    const instructionNames = config.instructions.map((instruction) => instruction.name);
    const instructionsInTemplate = config.template
        .match(/<\w+>/g)
        .map((instruction) => instruction.substring(1, instruction.length - 1))
        .filter((instruction) => instruction !== "message");

    return pipe(
        array.sequence(applicativeValidation)(
            instructionsInTemplate.map((v) => {
                if (instructionNames.includes(v)) return right(constVoid);
                return left([errorTemplateInstructionNotInInstructions(v)]);
            })
        ),
        eitherMap(constVoid)
    );
};

/**
 * choose a random element from a particular instruction
 * ! should be functionnal, here we have a side effect
 * @param instruction
 */
export const randomElementFromInstruction = (instruction: Instruction): Element => {
    return instruction.elements[Math.floor(Math.random() * Math.floor(instruction.elements.length))];
};

/**
 * transform a template into an answer according to a particular config
 * ! should be functionnal, using a foldLeft for example
 * ! should return an IOEither<NonEmptyArray<string>, string>
 * @param config
 * @param2 message
 * @param2 tos list of element's to
 */
export const applyTemplate = (config: Config) => (message: string, tos: string[]): string => {
    const instructionNames = config.instructions.map((instruction) => instruction.name);
    let template = config.template;
    for (let index = 0; index < instructionNames.length; index++) {
        const name = instructionNames[index];
        const to = tos[index];
        template = template.replace(`<${name}>`, to);
    }

    template = template.replace("<message>", message);

    return template;
};

/**
 * transform each from into their to representation
 * @param config
 */
export const fromsToTos = (config: Config) => (froms: string[]): string[] => {
    // We assume that we always gonna find an equivalent
    const fromToTo = (instruction: Instruction, from: string): string => {
        for (const element of instruction.elements) {
            if (element.from == from) return element.to;
        }
    };

    return froms.map((from, i) => {
        const instruction = config.instructions[i];
        return fromToTo(instruction, from);
    });
};
