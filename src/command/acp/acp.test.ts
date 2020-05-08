import { sourcesToAdds, toAcp, addsToCommands } from "./acp";
import { minimistWrapper } from "../../utils/utest";

import typed_json from "../../asset/preset.typed.json";
import { TypedJSON } from "typedjson";
import Preset, { parse } from "../../preset";

describe("the sourcesToAdds function", () => {
  it("should return the correct format", () => {
    expect(sourcesToAdds([])).toEqual(["git add ."]);
    expect(sourcesToAdds(["a"])).toEqual(["git add a"]);
    expect(sourcesToAdds(["a", "b"])).toEqual(["git add a", "git add b"]);
  });
});

describe("the addsToCommands function", () => {
  it("should return the correct format", () => {
    const acp = toAcp([
      minimistWrapper(["a", "p", "my commit"]),
      parse(typed_json),
    ]);
    const branch = "master";
    expect(addsToCommands(acp)(branch)(["git add a", "git add b"])).toEqual([
      "git add a",
      "git add b",
      'git commit -m "[project] add: my commit"',
      "git push origin master",
    ]);
    expect(addsToCommands(acp)(branch)(["git add ."])).toEqual([
        "git add .",
        'git commit -m "[project] add: my commit"',
        "git push origin master",
      ]);
  });
});
