import { jsonObject, jsonMember, jsonArrayMember, jsonMapMember } from "typedjson";

@jsonObject
export default class Preset {
    @jsonMember({ constructor: String })
    public name: string;

    @jsonArrayMember(String)
    public contributors: string;

    @jsonMapMember(String, String)
    public actions: Map<string, string>;

    @jsonMapMember(String, String)
    public targets: Map<string, string>;

    @jsonMember({ constructor: String })
    public template: string;
}