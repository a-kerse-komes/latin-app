import { getApplicativeMonoid } from './Applicative.js';
import { ap as ap_, apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup as getApplySemigroup_ } from './Apply.js';
import * as chainable from './Chain.js';
import { compact as compact_, separate as separate_ } from './Compactable.js';
import * as E from './Either.js';
import * as ET from './EitherT.js';
import { filter as filter_, filterMap as filterMap_, partition as partition_, partitionMap as partitionMap_ } from './Filterable.js';
import { chainFirstEitherK as chainFirstEitherK_, chainOptionK as chainOptionK_, filterOrElse as filterOrElse_, fromEitherK as fromEitherK_, fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { ask as ask_, asks as asks_, chainFirstReaderK as chainFirstReaderK_, chainReaderK as chainReaderK_, fromReaderK as fromReaderK_ } from './FromReader.js';
import { chainFirstTaskK as chainFirstTaskK_, chainTaskK as chainTaskK_, fromTaskK as fromTaskK_ } from './FromTask.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as R from './Reader.js';
import * as RT from './ReaderTask.js';
import * as T from './Task.js';
import * as TE from './TaskEither.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromTaskEither = /*#__PURE__*/ R.of;
/**
 * @category constructors
 * @since 2.0.0
 */
export const left = /*#__PURE__*/ ET.left(RT.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export const right = /*#__PURE__*/ ET.right(RT.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightTask = /*#__PURE__*/ flow(TE.rightTask, fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftTask = /*#__PURE__*/ flow(TE.leftTask, fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightReader = (ma) => flow(ma, TE.right);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftReader = (me) => flow(me, TE.left);
/**
 * @category constructors
 * @since 2.5.0
 */
export const rightReaderTask = 
/*#__PURE__*/ ET.rightF(RT.Functor);
/**
 * @category constructors
 * @since 2.5.0
 */
export const leftReaderTask = 
/*#__PURE__*/ ET.leftF(RT.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightIO = /*#__PURE__*/ flow(TE.rightIO, fromTaskEither);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftIO = /*#__PURE__*/ flow(TE.leftIO, fromTaskEither);
/**
 * @category constructors
 * @since 2.13.0
 */
export const rightReaderIO = /*#__PURE__*/ (ma) => flow(ma, TE.rightIO);
/**
 * @category constructors
 * @since 2.13.0
 */
export const leftReaderIO = /*#__PURE__*/ (me) => flow(me, TE.leftIO);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither = RT.of;
/**
 * @category conversions
 * @since 2.11.0
 */
export const fromReader = rightReader;
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIO = rightIO;
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromTask = rightTask;
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIOEither = /*#__PURE__*/ flow(TE.fromIOEither, fromTaskEither);
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromReaderEither = (ma) => flow(ma, TE.fromEither);
/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match = /*#__PURE__*/ ET.match(RT.Functor);
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
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`ReaderTask`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchE = /*#__PURE__*/ ET.matchE(RT.Chain);
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
export const getOrElse = /*#__PURE__*/ ET.getOrElse(RT.Monad);
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
 * @category conversions
 * @since 2.10.0
 */
export const toUnion = /*#__PURE__*/ ET.toUnion(RT.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromNullable = 
/*#__PURE__*/ ET.fromNullable(RT.Pointed);
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const fromNullableK = /*#__PURE__*/ ET.fromNullableK(RT.Pointed);
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainNullableK = /*#__PURE__*/ ET.chainNullableK(RT.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.0.0
 */
export const local = R.local;
/**
 * Less strict version of [`asksReaderTaskEither`](#asksreadertaskeither).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderTaskEitherW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderTaskEither = asksReaderTaskEitherW;
/**
 * @category error handling
 * @since 2.0.0
 */
export const orElse = /*#__PURE__*/ ET.orElse(RT.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the return types will be merged.
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
export const tapError = /*#__PURE__*/ dual(2, ET.tapError(RT.Monad));
/**
 * @category error handling
 * @since 2.11.0
 */
export const orLeft = /*#__PURE__*/ ET.orLeft(RT.Monad);
/**
 * @since 2.0.0
 */
export const swap = /*#__PURE__*/ ET.swap(RT.Functor);
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromIOEitherK = (f) => flow(f, fromIOEither);
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromTaskEitherK = (f) => flow(f, fromTaskEither);
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.6.1
 */
export const chainTaskEitherKW = (f) => flatMap(fromTaskEitherK(f));
/**
 * @category sequencing
 * @since 2.4.0
 */
export const chainTaskEitherK = chainTaskEitherKW;
/**
 * Less strict version of [`chainFirstTaskEitherK`](#chainfirsttaskeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstTaskEitherKW = (f) => chainFirstW(fromTaskEitherK(f));
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstTaskEitherK = chainFirstTaskEitherKW;
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromReaderEitherK = (f) => flow(f, fromReaderEither);
/**
 * Less strict version of [`chainReaderEitherK`](#chainreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainReaderEitherKW = (f) => flatMap(fromReaderEitherK(f));
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainReaderEitherK = chainReaderEitherKW;
/**
 * Less strict version of [`chainFirstReaderEitherK`](#chainfirstreadereitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderEitherKW = (f) => chainFirstW(fromReaderEitherK(f));
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderEitherK = chainFirstReaderEitherKW;
const _map = (fa, f) => pipe(fa, map(f));
const _apPar = (fab, fa) => pipe(fab, ap(fa));
const _apSeq = (fab, fa) => flatMap(fab, (f) => pipe(fa, map(f)));
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = 
/*#__PURE__*/ ET.map(RT.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export const bimap = /*#__PURE__*/ ET.bimap(RT.Functor);
/**
 * Map a function over the second type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
export const mapLeft = 
/*#__PURE__*/ ET.mapLeft(RT.Functor);
/**
 * @since 2.0.0
 */
export const ap = /*#__PURE__*/ ET.ap(RT.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export const apW = ap;
/**
 * @category constructors
 * @since 2.7.0
 */
export const of = right;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, ET.flatMap(RT.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const flattenW = /*#__PURE__*/ flatMap(identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt = /*#__PURE__*/ ET.alt(RT.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW = alt;
/**
 * @since 2.0.0
 */
export const throwError = left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'ReaderTaskEither';
/**
 * @category filtering
 * @since 2.10.0
 */
export const getCompactable = (M) => {
    const C = E.getCompactable(M);
    return {
        URI,
        _E: undefined,
        compact: compact_(RT.Functor, C),
        separate: separate_(RT.Functor, C, E.Functor)
    };
};
/**
 * @category filtering
 * @since 2.10.0
 */
export function getFilterable(M) {
    const F = E.getFilterable(M);
    const C = getCompactable(M);
    const filter = filter_(RT.Functor, F);
    const filterMap = filterMap_(RT.Functor, F);
    const partition = partition_(RT.Functor, F);
    const partitionMap = partitionMap_(RT.Functor, F);
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
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getApplicativeValidation`](./Either.ts.html#getapplicativevalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export function getApplicativeReaderTaskValidation(A, S) {
    const ap = ap_(R.Apply, TE.getApplicativeTaskValidation(A, S));
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
export function getAltReaderTaskValidation(S) {
    const alt = ET.altValidation(RT.Monad, S);
    return {
        URI,
        _E: undefined,
        map: _map,
        alt: (fa, that) => pipe(fa, alt(that))
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
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
 * @since 2.11.0
 */
export const FromReader = {
    URI,
    fromReader
};
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.0.0
 */
export const ask = /*#__PURE__*/ ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.0.0
 */
export const asks = /*#__PURE__*/ asks_(FromReader);
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromReaderK = /*#__PURE__*/ fromReaderK_(FromReader);
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainReaderK = /*#__PURE__*/ chainReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainReaderKW = chainReaderK;
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderK = /*#__PURE__*/ chainFirstReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderKW = chainFirstReaderK;
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromReaderTaskK = (f) => (...a) => rightReaderTask(f(...a));
/**
 * Less strict version of [`chainReaderTaskK`](#chainreadertaskk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainReaderTaskKW = (f) => flatMap(fromReaderTaskK(f));
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainReaderTaskK = chainReaderTaskKW;
/**
 * Less strict version of [`chainFirstReaderTaskK`](#chainfirstreadertaskk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderTaskKW = (f) => chainFirstW(fromReaderTaskK(f));
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderTaskK = chainFirstReaderTaskKW;
/**
 * @category lifting
 * @since 2.13.0
 */
export const fromReaderIOK = (f) => (...a) => rightReaderIO(f(...a));
/**
 * Less strict version of [`chainReaderIOK`](#chainreaderiok).
 *
 * @category sequencing
 * @since 2.13.0
 */
export const chainReaderIOKW = (f) => flatMap(fromReaderIOK(f));
/**
 * @category sequencing
 * @since 2.13.0
 */
export const chainReaderIOK = chainReaderIOKW;
/**
 * Less strict version of [`chainFirstReaderIOK`](#chainfirstreaderiok).
 *
 * @category sequencing
 * @since 2.13.0
 */
export const chainFirstReaderIOKW = (f) => chainFirstW(fromReaderIOK(f));
/**
 * @category sequencing
 * @since 2.13.0
 */
export const chainFirstReaderIOK = chainFirstReaderIOKW;
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
export const fromOptionK = /*#__PURE__*/ fromOptionK_(FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
export const chainOptionK = 
/*#__PURE__*/ chainOptionK_(FromEither, Chain);
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
export const chainFirstEitherK = /*#__PURE__*/ chainFirstEitherK_(FromEither, Chain);
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
export const chainIOK = /*#__PURE__*/ chainIOK_(FromIO, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainFirstIOK = /*#__PURE__*/ chainFirstIOK_(FromIO, Chain);
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
export const chainTaskK = /*#__PURE__*/ chainTaskK_(FromTask, Chain);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainFirstTaskK = /*#__PURE__*/ chainFirstTaskK_(FromTask, Chain);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.4
 */
export function bracket(acquire, use, release) {
    return bracketW(acquire, use, release);
}
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * @since 2.12.0
 */
export function bracketW(acquire, use, release) {
    return (r) => TE.bracketW(acquire(r), (a) => use(a)(r), (a, e) => release(a, e)(r));
}
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
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
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
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(TE.traverseReadonlyNonEmptyArrayWithIndex(SK)));
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
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndexSeq = (f) => flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(TE.traverseReadonlyNonEmptyArrayWithIndexSeq(SK)));
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
export const sequenceArray = /*#__PURE__*/ traverseArray(identity);
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
export const sequenceSeqArray = /*#__PURE__*/ traverseSeqArray(identity);
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
 * For example if a function needs a `Functor` instance, pass `RTE.Functor` instead of `RTE.readerTaskEither`
 * (where `RTE` is from `import RTE from 'fp-ts/ReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const readerTaskEither = {
    URI,
    map: _map,
    of,
    ap: _apPar,
    chain: flatMap,
    alt: _alt,
    bimap: _bimap,
    mapLeft: _mapLeft,
    fromIO,
    fromTask,
    throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RTE.Functor` instead of `RTE.readerTaskEitherSeq`
 * (where `RTE` is from `import RTE from 'fp-ts/ReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const readerTaskEitherSeq = {
    URI,
    map: _map,
    of,
    ap: _apSeq,
    chain: flatMap,
    alt: _alt,
    bimap: _bimap,
    mapLeft: _mapLeft,
    fromIO,
    fromTask,
    throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
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
export const getSemigroup = (S) => getApplySemigroup_(RT.ApplySeq)(E.getSemigroup(S));
/**
 * Use [`getApplicativeReaderTaskValidation`](#getapplicativereadertaskvalidation) and [`getAltReaderTaskValidation`](#getaltreadertaskvalidation) instead.
 *
 * @category instances
 * @since 2.3.0
 * @deprecated
 */
export function getReaderTaskValidation(SE) {
    const applicativeReaderTaskValidation = getApplicativeReaderTaskValidation(T.ApplicativePar, SE);
    const altReaderTaskValidation = getAltReaderTaskValidation(SE);
    return {
        URI,
        _E: undefined,
        map: _map,
        of,
        chain: flatMap,
        bimap: _bimap,
        mapLeft: _mapLeft,
        ap: applicativeReaderTaskValidation.ap,
        alt: altReaderTaskValidation.alt,
        fromIO,
        fromTask,
        throwError
    };
}
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export function run(ma, r) {
    return ma(r)();
}
//# sourceMappingURL=ReaderTaskEither.js.map