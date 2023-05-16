import { getApplicativeMonoid } from './Applicative.js';
import { ap as ap_, apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup as getApplySemigroup_ } from './Apply.js';
import * as chainable from './Chain.js';
import { compact as compact_, separate as separate_ } from './Compactable.js';
import * as E from './Either.js';
import * as ET from './EitherT.js';
import { filter as filter_, filterMap as filterMap_, partition as partition_, partitionMap as partitionMap_ } from './Filterable.js';
import { chainFirstEitherK as chainFirstEitherK_, chainOptionK as chainOptionK_, filterOrElse as filterOrElse_, fromEitherK as fromEitherK_, fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { chainFirstTaskK as chainFirstTaskK_, chainTaskK as chainTaskK_, fromTaskK as fromTaskK_ } from './FromTask.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as T from './Task.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export const left = /*#__PURE__*/ ET.left(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export const right = /*#__PURE__*/ ET.right(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightTask = /*#__PURE__*/ ET.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftTask = /*#__PURE__*/ ET.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightIO = /*#__PURE__*/ flow(T.fromIO, rightTask);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftIO = /*#__PURE__*/ flow(T.fromIO, leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.7.0
 */
export const fromIO = rightIO;
/**
 * @category conversions
 * @since 2.7.0
 */
export const fromTask = rightTask;
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither = T.of;
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIOEither = T.fromIO;
/**
 * @category conversions
 * @since 2.11.0
 */
export const fromTaskOption = (onNone) => T.map(E.fromOption(onNone));
/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match = 
/*#__PURE__*/ ET.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchW = match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchE = /*#__PURE__*/ ET.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export const fold = matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchEW = matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const foldW = matchEW;
/**
 * @category error handling
 * @since 2.0.0
 */
export const getOrElse = 
/*#__PURE__*/ ET.getOrElse(T.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
export const getOrElseW = getOrElse;
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
export const tryCatch = (f, onRejected) => async () => {
    try {
        return await f().then(_.right);
    }
    catch (reason) {
        return _.left(onRejected(reason));
    }
};
/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
export const tryCatchK = (f, onRejected) => (...a) => tryCatch(() => f(...a), onRejected);
/**
 * @category conversions
 * @since 2.10.0
 */
export const toUnion = /*#__PURE__*/ ET.toUnion(T.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromNullable = /*#__PURE__*/ ET.fromNullable(T.Pointed);
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const fromNullableK = /*#__PURE__*/ ET.fromNullableK(T.Pointed);
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainNullableK = 
/*#__PURE__*/ ET.chainNullableK(T.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
export const orElse = 
/*#__PURE__*/ ET.orElse(T.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
export const orElseW = orElse;
/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 2.15.0
 */
export const tapError = /*#__PURE__*/ dual(2, ET.tapError(T.Monad));
/**
 * @category error handling
 * @since 2.12.0
 */
export const orElseFirstIOK = (onLeft) => tapError(fromIOK(onLeft));
/**
 * @category error handling
 * @since 2.12.0
 */
export const orElseFirstTaskK = (onLeft) => tapError(fromTaskK(onLeft));
/**
 * @category error handling
 * @since 2.11.0
 */
export const orLeft = 
/*#__PURE__*/ ET.orLeft(T.Monad);
/**
 * @since 2.0.0
 */
export const swap = /*#__PURE__*/ ET.swap(T.Functor);
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromTaskOptionK = (onNone) => {
    const from = fromTaskOption(onNone);
    return (f) => flow(f, from);
};
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.12.3
 */
export const chainTaskOptionKW = (onNone) => (f) => (ma) => flatMap(ma, fromTaskOptionK(onNone)(f));
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainTaskOptionK = chainTaskOptionKW;
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromIOEitherK = (f) => flow(f, fromIOEither);
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.6.1
 */
export const chainIOEitherKW = (f) => flatMap(fromIOEitherK(f));
/**
 * @category sequencing
 * @since 2.4.0
 */
export const chainIOEitherK = chainIOEitherKW;
const _map = (fa, f) => pipe(fa, map(f));
const _apPar = (fab, fa) => pipe(fab, ap(fa));
const _apSeq = (fab, fa) => flatMap(fab, (f) => pipe(fa, map(f)));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = /*#__PURE__*/ ET.map(T.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export const bimap = 
/*#__PURE__*/ ET.bimap(T.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
export const mapLeft = 
/*#__PURE__*/ ET.mapLeft(T.Functor);
/**
 * @since 2.0.0
 */
export const ap = 
/*#__PURE__*/ ET.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
export const apW = ap;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, ET.flatMap(T.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const flattenW = 
/*#__PURE__*/ flatMap(identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt = 
/*#__PURE__*/ ET.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW = alt;
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = right;
/**
 * @since 2.7.0
 */
export const throwError = left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'TaskEither';
/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 * import * as T from 'fp-ts/Task'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * interface User {
 *   readonly id: string
 *   readonly name: string
 * }
 *
 * const remoteDatabase: ReadonlyArray<User> = [
 *   { id: 'id1', name: 'John' },
 *   { id: 'id2', name: 'Mary' },
 *   { id: 'id3', name: 'Joey' }
 * ]
 *
 * const fetchUser = (id: string): TE.TaskEither<string, User> =>
 *   pipe(
 *     remoteDatabase,
 *     RA.findFirst((user) => user.id === id),
 *     TE.fromOption(() => `${id} not found`)
 *   )
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(TE.ApplicativePar)(fetchUser))(),
 *     E.left('id4 not found') // <= first error
 *   )
 *
 *   const Applicative = TE.getApplicativeTaskValidation(
 *     T.ApplyPar,
 *     pipe(string.Semigroup, S.intercalate(', '))
 *   )
 *
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(Applicative)(fetchUser))(),
 *     E.left('id4 not found, id5 not found') // <= all errors
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.7.0
 */
export function getApplicativeTaskValidation(A, S) {
    const ap = ap_(A, E.getApplicativeValidation(S));
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: (fab, fa) => pipe(fab, ap(fa)),
        of
    };
}
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getAltValidation`](./Either.ts.html#getaltvalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export function getAltTaskValidation(S) {
    const alt = ET.altValidation(T.Monad, S);
    return {
        URI,
        _E: undefined,
        map: _map,
        alt: (fa, that) => pipe(fa, alt(that))
    };
}
/**
 * @category filtering
 * @since 2.10.0
 */
export const getCompactable = (M) => {
    const C = E.getCompactable(M);
    return {
        URI,
        _E: undefined,
        compact: compact_(T.Functor, C),
        separate: separate_(T.Functor, C, E.Functor)
    };
};
/**
 * @category filtering
 * @since 2.1.0
 */
export function getFilterable(M) {
    const F = E.getFilterable(M);
    const C = getCompactable(M);
    const filter = filter_(T.Functor, F);
    const filterMap = filterMap_(T.Functor, F);
    const partition = partition_(T.Functor, F);
    const partitionMap = partitionMap_(T.Functor, F);
    return {
        URI,
        _E: undefined,
        map: _map,
        compact: C.compact,
        separate: C.separate,
        filter: (fa, predicate) => pipe(fa, filter(predicate)),
        filterMap: (fa, f) => pipe(fa, filterMap(f)),
        partition: (fa, predicate) => pipe(fa, partition(predicate)),
        partitionMap: (fa, f) => pipe(fa, partitionMap(f))
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
export const Functor = {
    URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
export const Pointed = {
    URI,
    of
};
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
export const ApplyPar = {
    URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(ApplyPar);
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
export const apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(ApplyPar);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
export const apSecondW = apSecond;
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
export const ApplicativePar = {
    URI,
    map: _map,
    ap: _apPar,
    of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
export const ApplySeq = {
    URI,
    map: _map,
    ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
export const ApplicativeSeq = {
    URI,
    map: _map,
    ap: _apSeq,
    of
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Chain = {
    URI,
    map: _map,
    ap: _apPar,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Monad = {
    URI,
    map: _map,
    ap: _apPar,
    chain: flatMap,
    of
};
/**
 * @category instances
 * @since 2.10.0
 */
export const MonadIO = {
    URI,
    map: _map,
    ap: _apPar,
    chain: flatMap,
    of,
    fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
export const MonadTask = {
    URI,
    map: _map,
    ap: _apPar,
    chain: flatMap,
    of,
    fromIO,
    fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
export const MonadThrow = {
    URI,
    map: _map,
    ap: _apPar,
    chain: flatMap,
    of,
    throwError
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
export const tap = /*#__PURE__*/ dual(2, chainable.tap(Chain));
/**
 * @category instances
 * @since 2.7.0
 */
export const Bifunctor = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Alt = {
    URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.10.0
 */
export const FromEither = {
    URI,
    fromEither
};
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromOption = 
/*#__PURE__*/ fromOption_(FromEither);
/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const fromOptionK = 
/*#__PURE__*/ fromOptionK_(FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainOptionK = /*#__PURE__*/ chainOptionK_(FromEither, Chain);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
export const chainOptionKW = 
/*#__PURE__*/ chainOptionK;
/** @internal */
const _FromEither = {
    fromEither: FromEither.fromEither
};
/**
 * @category lifting
 * @since 2.15.0
 */
export const liftNullable = /*#__PURE__*/ _.liftNullable(_FromEither);
/**
 * @category lifting
 * @since 2.15.0
 */
export const liftOption = /*#__PURE__*/ _.liftOption(_FromEither);
/** @internal */
const _FlatMap = {
    flatMap
};
/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapNullable = /*#__PURE__*/ _.flatMapNullable(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapOption = /*#__PURE__*/ _.flatMapOption(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
export const flatMapEither = /*#__PURE__*/ _.flatMapEither(_FromEither, _FlatMap);
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
export const chainEitherK = flatMapEither;
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.6.1
 */
export const chainEitherKW = flatMapEither;
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainFirstEitherK = 
/*#__PURE__*/ chainFirstEitherK_(FromEither, Chain);
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.12.0
 */
export const chainFirstEitherKW = chainFirstEitherK;
/**
 * @category lifting
 * @since 2.0.0
 */
export const fromPredicate = /*#__PURE__*/ fromPredicate_(FromEither);
/**
 * @category filtering
 * @since 2.0.0
 */
export const filterOrElse = /*#__PURE__*/ filterOrElse_(FromEither, Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
export const filterOrElseW = filterOrElse;
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromEitherK = /*#__PURE__*/ fromEitherK_(FromEither);
/**
 * @category instances
 * @since 2.10.0
 */
export const FromIO = {
    URI,
    fromIO
};
/**
 * @category lifting
 * @since 2.10.0
 */
export const fromIOK = /*#__PURE__*/ fromIOK_(FromIO);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainIOK = 
/*#__PURE__*/ chainIOK_(FromIO, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainFirstIOK = 
/*#__PURE__*/ chainFirstIOK_(FromIO, Chain);
/**
 * @category instances
 * @since 2.10.0
 */
export const FromTask = {
    URI,
    fromIO,
    fromTask
};
/**
 * @category lifting
 * @since 2.10.0
 */
export const fromTaskK = /*#__PURE__*/ fromTaskK_(FromTask);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainTaskK = 
/*#__PURE__*/ chainTaskK_(FromTask, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainFirstTaskK = 
/*#__PURE__*/ chainFirstTaskK_(FromTask, Chain);
export function taskify(f) {
    return function () {
        const args = Array.prototype.slice.call(arguments);
        return () => new Promise((resolve) => {
            const cbResolver = (e, r) => (e != null ? resolve(_.left(e)) : resolve(_.right(r)));
            f.apply(null, args.concat(cbResolver));
        });
    };
}
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
export const bracket = (acquire, use, release) => bracketW(acquire, use, release);
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
export const bracketW = (acquire, use, release) => flatMap(acquire, (a) => T.flatMap(use(a), (e) => flatMap(release(a, e), () => T.of(e))));
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
export const Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor);
const let_ = /*#__PURE__*/ let__(Functor);
export { 
/**
 * @category do notation
 * @since 2.13.0
 */
let_ as let };
/**
 * @category do notation
 * @since 2.8.0
 */
export const bind = /*#__PURE__*/ chainable.bind(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export const bindW = bind;
/**
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(ApplyPar);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
export const apSW = apS;
/**
 * @since 2.11.0
 */
export const ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => flow(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(E.traverseReadonlyNonEmptyArrayWithIndex(SK)));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndexSeq = (f) => (as) => () => _.tail(as).reduce((acc, a, i) => acc.then((ebs) => _.isLeft(ebs)
    ? acc
    : f(i + 1, a)().then((eb) => {
        if (_.isLeft(eb)) {
            return eb;
        }
        ebs.right.push(eb.right);
        return ebs;
    })), f(0, _.head(as))().then(E.map(_.singleton)));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndexSeq = (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseArray = (f) => traverseReadonlyArrayWithIndex((_, a) => f(a));
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceArray = 
/*#__PURE__*/ traverseArray(identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseSeqArrayWithIndex = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const traverseSeqArray = (f) => traverseReadonlyArrayWithIndexSeq((_, a) => f(a));
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
export const sequenceSeqArray = 
/*#__PURE__*/ traverseSeqArray(identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chain = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
export const chainW = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst = tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
export const chainFirstW = tap;
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const orElseFirst = tapError;
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const orElseFirstW = tapError;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEither`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const taskEither = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of,
    ap: _apPar,
    chain: flatMap,
    alt: _alt,
    fromIO,
    fromTask,
    throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEitherSeq`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const taskEitherSeq = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of,
    ap: _apSeq,
    chain: flatMap,
    alt: _alt,
    fromIO,
    fromTask,
    throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplySemigroup = 
/*#__PURE__*/ getApplySemigroup_(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplyMonoid = 
/*#__PURE__*/ getApplicativeMonoid(ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup = (S) => getApplySemigroup_(T.ApplySeq)(E.getSemigroup(S));
/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export function getTaskValidation(SE) {
    const applicativeTaskValidation = getApplicativeTaskValidation(T.ApplicativePar, SE);
    const altTaskValidation = getAltTaskValidation(SE);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: applicativeTaskValidation.ap,
        of,
        chain: flatMap,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: altTaskValidation.alt,
        fromIO,
        fromTask,
        throwError
    };
}
//# sourceMappingURL=TaskEither.js.map