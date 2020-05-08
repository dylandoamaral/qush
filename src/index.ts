#!/usr/bin/env node

import { pipe } from "fp-ts/lib/pipeable";
import {
  loadArguments,
  routeCommands,
  executeCommand,
  showError,
} from "./command/command";
import { IO } from "fp-ts/lib/IO";
import { getOrElse } from "fp-ts/lib/IOEither";

const program: IO<void> = pipe(
  loadArguments(),
  routeCommands,
  executeCommand,
  getOrElse(showError)
);

program();
