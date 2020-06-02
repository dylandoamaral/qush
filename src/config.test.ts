import json from "./asset/default.config.json";
import {
    plainToConfig,
    Config,
    Instruction,
    Element,
    showElement,
    showInstruction,
    showConfig,
    applyTemplate,
    fromsToTos,
    validateElement,
    validateInstruction,
    validateConfig,
    validateCoherenceTemplateInstructions,
    getInstructionInTemplate,
} from "./config";
import { isRight, isLeft, left } from "fp-ts/lib/Either";
import { errorObjectHasNoAttribute, errorTemplateInstructionNotInInstructions } from "./utils/error";

const config = plainToConfig(JSON.stringify(json));

test("the parsing from json to Config", () => {
    expect(config).toBeInstanceOf(Config);
    expect(config.name).toEqual("default");
    expect(config.contributors).toEqual(["dylandoamaral"]);
    expect(config.version).toEqual("1.0.0");
    expect(config.instructions).toHaveLength(2);
    expect(config.instructions[0]).toBeInstanceOf(Instruction);
    expect(config.instructions[0].elements).toHaveLength(6);
    expect(config.instructions[0].elements[0]).toBeInstanceOf(Element);
    expect(config.instructions[0].elements[0].from).toEqual("a");
    expect(config.instructions[0].elements[0].to).toEqual("add");
});

describe("the config show functions", () => {
    it("can show an element", () => {
        const element = config.instructions[0].elements[0];
        expect(showElement(element)).toContain(element.from);
        expect(showElement(element)).toContain(element.to);
        expect(showElement(element)).toContain(element.description);
    });

    it("can show an element without description", () => {
        const element: Element = {
            from: "a",
            to: "z",
        } as Element;
        expect(showElement(element)).toContain(element.from);
        expect(showElement(element)).toContain(element.to);
    });

    it("can show an instruction", () => {
        const instruction = config.instructions[0];
        expect(showInstruction(instruction)).toContain(instruction.name);
        expect(showInstruction(instruction)).toContain(instruction.description);
        for (const element of instruction.elements) {
            expect(showInstruction(instruction)).toContain(element.from);
            expect(showInstruction(instruction)).toContain(element.to);
        }
    });

    it("can show an instruction without a description", () => {
        const instruction: Instruction = {
            name: "a",
            elements: [...config.instructions[0].elements],
        } as Instruction;

        expect(showInstruction(instruction)).toContain(instruction.name);
        for (const element of instruction.elements) {
            expect(showInstruction(instruction)).toContain(element.from);
            expect(showInstruction(instruction)).toContain(element.to);
        }
    });

    it("can show a config", () => {
        expect(showConfig(config)).toContain(config.name);
        expect(showConfig(config)).toContain(config.contributors[0]);
        expect(showConfig(config)).toContain(config.version);
        expect(showConfig(config)).toContain(config.template);

        for (const instruction of config.instructions) {
            expect(showConfig(config)).toContain(instruction.description);
            for (const element of instruction.elements) {
                expect(showConfig(config)).toContain(element.from);
                expect(showConfig(config)).toContain(element.to);
            }
        }
    });

    describe("the config validation functions", () => {
        it("can validate an element", () => {
            const element = config.instructions[0].elements[0];
            expect(isRight(validateElement(element, 0, 0))).toEqual(true);
        });

        it("can unvalidate an element with no to", () => {
            const element: Element = {
                from: "a",
            } as Element;
            const object = "element n°0 of instruction n°0";
            expect(isLeft(validateElement(element, 0, 0))).toEqual(true);
            expect(validateElement(element, 0, 0)).toEqual(left([errorObjectHasNoAttribute(object, "to")]));
        });

        it("can unvalidate an element with no from", () => {
            const element: Element = {
                to: "z",
            } as Element;
            const object = "element n°0 of instruction n°0";
            expect(isLeft(validateElement(element, 0, 0))).toEqual(true);
            expect(validateElement(element, 0, 0)).toEqual(left([errorObjectHasNoAttribute(object, "from")]));
        });

        it("can validate an instruction", () => {
            const instruction = config.instructions[0];
            expect(isRight(validateInstruction(instruction, 0))).toEqual(true);
        });

        it("can unvalidate an instruction with no name", () => {
            const instruction: Instruction = {
                elements: [...config.instructions[0].elements]
            } as Instruction;
            const object = "instruction n°0";
            expect(isLeft(validateInstruction(instruction, 0))).toEqual(true);
            expect(validateInstruction(instruction, 0)).toEqual(left([errorObjectHasNoAttribute(object, "name")]));
        });

        it("can unvalidate an instruction with no elements", () => {
            const instruction: Instruction = {
                name: "name"
            } as Instruction;
            const object = "instruction n°0";
            expect(isLeft(validateInstruction(instruction, 0))).toEqual(true);
            expect(validateInstruction(instruction, 0)).toEqual(left([errorObjectHasNoAttribute(object, "elements")]));
        });

        it("can validate a config", () => {
            expect(isRight(validateConfig(config))).toEqual(true);
        });

        it("can unvalidate a config with no name", () => {
            let unvalidConfig: Config = {...config};
            delete unvalidConfig.name;
            expect(isLeft(validateConfig(unvalidConfig))).toEqual(true);
            expect(validateConfig(unvalidConfig)).toEqual(left([errorObjectHasNoAttribute("config", "name")]));
        });

        it("can validate the coherence between template and instruction", () => {
            expect(isRight(validateCoherenceTemplateInstructions(config))).toEqual(true);
        });

        it("can unvalidate the incoherence between template and instruction", () => {
            const unvalidConfig: Config = {...config, template: "[<target>] <action>: <message> <instruction>"};

            expect(isLeft(validateCoherenceTemplateInstructions(unvalidConfig))).toEqual(true);
            expect(validateCoherenceTemplateInstructions(unvalidConfig)).toEqual(left([errorTemplateInstructionNotInInstructions("instruction")]));
        });

        it("can unvalidate multiple incoherences between template and instruction", () => {
            const unvalidConfig: Config = {...config, template: "[<target>] <action>: <message> <instruction> <instruction2>"};

            expect(isLeft(validateCoherenceTemplateInstructions(unvalidConfig))).toEqual(true);
            expect(validateCoherenceTemplateInstructions(unvalidConfig)).toEqual(left([
                errorTemplateInstructionNotInInstructions("instruction"),
                errorTemplateInstructionNotInInstructions("instruction2")
            ]));
        });
    });

    test("the get instruction function in template", () => {
        const template1 = "[<target>] <action>: <message>";
        expect(getInstructionInTemplate(template1)).toContain("action");
        expect(getInstructionInTemplate(template1)).toContain("target");
        expect(getInstructionInTemplate(template1)).toHaveLength(2);
        const template2 = "[<target>] <action>: <message>  <instruction>";
        expect(getInstructionInTemplate(template2)).toContain("action");
        expect(getInstructionInTemplate(template2)).toContain("target");
        expect(getInstructionInTemplate(template2)).toContain("instruction");
        expect(getInstructionInTemplate(template2)).toHaveLength(3);
    });

    test("the apply function for template to get the answer", () => {
        expect(applyTemplate(config)("my commit", ["add", "project"])).toEqual("[project] add: my commit");
        expect(applyTemplate(config)("my commit", ["refactor", "documentation"])).toEqual("[documentation] refactor: my commit");
        expect(applyTemplate(config)("my commit", ["delete", "test"])).toEqual("[test] delete: my commit");
    });

    test("the froms to tos function", () => {
        expect(fromsToTos(config)(["a", "p"])).toEqual(["add", "project"]);
        expect(fromsToTos(config)(["r", "d"])).toEqual(["refactor", "documentation"]);
        expect(fromsToTos(config)(["d", "t"])).toEqual(["delete", "test"]);
    });
});
