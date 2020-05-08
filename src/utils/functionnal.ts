import { IO } from "fp-ts/lib/IO";
import { IOEither, fold } from 'fp-ts/lib/IOEither';
import { pipe } from 'fp-ts/lib/pipeable';
    
export function stay<A>(value: A): IO<A> {
    return () => value
}

export function merge<A>(ioeither: IOEither<A, A>): IO<A> {
    return pipe(
        ioeither,
        fold(stay, stay)
    )
}