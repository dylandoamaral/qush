// eslint-disable-next-line no-unused-vars
import Preset from "./preset";
import { error_validator_excess, error_validator_need_multiple, error_validator_need_none, error_validator_arguments, error_validator_map } from './error';

/**
 * check if a sequence exist and is uniq inside a sentence
 * @param sequence
 * @param sentence
 */
const uniq = (sequence: string, sentence: string): boolean => {
    return sentence.split(sequence).length === 2;
};

/**
 * check if a needed sequence really exist once inside a sentence and return an error otherwise
 * @param sequence
 * @param sentence
 */
const need = (sequence: string, sentence: string): void => {
    if (!uniq(sequence, sentence)){
        if (sentence.includes(sequence)) throw new Error(error_validator_need_multiple(sequence, sentence));
        else throw new Error(error_validator_need_none(sequence, sentence));
    }
};

/**
 * check if a non needed sequence really not exist inside a sentence and return an error otherwise
 * @param sequence
 * @param sentence
 */
const excess = (sequence: string, sentence: string): void => {
    if (sentence.includes(sequence)) throw new Error(error_validator_excess(sequence, sentence));
};

/**
 * check if a key exist inside a map and return an error otherwise
 * @param key 
 * @param map 
 * @param map_name 
 */
const exist = (key: string, map: Map<string, string>, map_name: string): void => {
    if(!map.has(key)) throw new Error(error_validator_map(key, map, map_name));
};

const validate = (args: string[], preset: Preset): void => {
    switch (args.length) {
    case 1:
        need("<message>", preset.template);
        excess("<action>", preset.template);
        excess("<target>", preset.template);
        break;
    case 2:
        need("<message>", preset.template);
        need("<action>", preset.template);
        excess("<target>", preset.template);
        exist(args[0], preset.actions, "actions");
        break;
    case 3:
        need("<message>", preset.template);
        need("<action>", preset.template);
        need("<target>", preset.template);
        exist(args[0], preset.actions, "actions");
        exist(args[1], preset.targets, "targets");
        break;
    default:
        throw new Error(error_validator_arguments());
    }
};

export default validate;
