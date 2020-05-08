import minimist from 'minimist';

export const minimistWrapper = (args: string[]): minimist.ParsedArgs => minimist(args);
