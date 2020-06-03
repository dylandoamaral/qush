import json from "../../asset/default.config.json";
import { sourcesToAdds, toQush, addsToCommands } from "./qush";
import { plainToConfig } from "../../config";
import minimist from "minimist";

describe("the sourcesToAdds function", () => {
    it("should return the correct format", () => {
        expect(sourcesToAdds([])).toEqual(["git add ."]);
        expect(sourcesToAdds(["a"])).toEqual(["git add a"]);
        expect(sourcesToAdds(["a", "b"])).toEqual(["git add a", "git add b"]);
    });
});

describe("the addsToCommands function", () => {
    it("should return the correct format", () => {
        const Qush = toQush([minimist(["a", "p", "my commit"]), plainToConfig(JSON.stringify(json))]);
        const branch = "master";

        expect(addsToCommands(Qush)(branch)(["git add a", "git add b"])).toEqual([
            "git add a",
            "git add b",
            "git commit -m \"[project] add: my commit\"",
            "git push origin master",
        ]);
        expect(addsToCommands(Qush)(branch)(["git add ."])).toEqual([
            "git add .",
            "git commit -m \"[project] add: my commit\"",
            "git push origin master",
        ]);
    });
});
