import Preset from "./preset";
import json from "./preset.typed.json";
import { TypedJSON } from "typedjson";

test("the parsing from json to Preset", () => {
    const serializer = new TypedJSON(Preset);
    const object = serializer.parse(json);

    expect(object).toBeInstanceOf(Preset);
    expect(object.template).toBe(json.template);
    expect(object.actions.get("a")).toBe("add");
    expect(object.targets.get("d")).toBe("documentation");
});
