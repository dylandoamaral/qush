import "reflect-metadata";
import { jsonObject, jsonMember, jsonMapMember } from "typedjson";

@jsonObject
export default class Preset {
    @jsonMapMember(String, String)
    public actions: Map<string, string>;

    @jsonMapMember(String, String)
    public targets: Map<string, string>;

    @jsonMember
    public template: string;
}