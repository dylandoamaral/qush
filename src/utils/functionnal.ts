import { IO } from "fp-ts/lib/IO";
import { IOEither, fold } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";

export function stay<A>(value: A): IO<A> {
  return () => value;
}

export function merge<A>(ioeither: IOEither<A, A>): IO<A> {
  return pipe(ioeither, fold(stay, stay));
}

export function isIORight<A, E>(ioeither: IOEither<A, E>): boolean {
  return pipe(
    ioeither,
    fold(
      () => () => false,
      () => () => true
    ),
    (func) => func()
  );
}

export function isIOLeft<A, E>(ioeither: IOEither<A, E>): boolean {
  return !isIORight(ioeither);
}

export function condition<A, E>(
  cond: boolean,
  left: IOEither<A, E>,
  right: IOEither<A, E>
): IOEither<A, E> {
  return cond ? right : left;
}
