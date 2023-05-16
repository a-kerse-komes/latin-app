import { getApplicativeMonoid } from './Applicative.js';
import { ap as ap_, apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup as getApplySemigroup_ } from './Apply.js';
import * as chainable from './Chain.js';
import { compact as compact_, separate as separate_ } from './Compactable.js';
import * as E from './Either.js';
import * as ET from './EitherT.js';
import { filter as filter_, filterMap as filterMap_, partition as partition_, partitionMap as partitionMap_ } from './Filterable.js';
import { chainFirstEitherK as chainFirstEitherK_, chainOptionK as chainOptionK_, filterOrElse as filterOrElse_, fromEitherK as fromEitherK_, fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither.js';
import { ask as ask_, asks as asks_, chainFirstReaderK as chainFirstReaderK_, chainReaderK as chainReaderK_, fromReaderK as fromReaderK_ } from './FromReader.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as R from './Reader.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export const left = /*#__PURE__*/ ET.left(R.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export const right = /*#__PURE__*/ ET.right(R.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightReader = 
/*#__PURE__*/ ET.rightF(R.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftReader = /*#__PURE__*/ ET.leftF(R.Functor);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither = R.of;
/**
 * @category conversions
 * @since 2.11.0
 */
export const fromReader = rightReader;
/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match = /*#__PURE__*/ ET.match(R.Functor);
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
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Reader`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchE = /*#__PURE__*/ ET.matchE(R.Monad);
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
/*#__PURE__*/ ET.getOrElse(R.Monad);
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
export const toUnion = /*#__PURE__*/ ET.toUnion(R.Functor);
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
 * Less strict version of [`asksReaderEither`](#asksreadereither).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderEitherW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderEither = asksReaderEitherW;
/**
 * @category error handling
 * @since 2.0.0
 */
export const orElse = /*#__PURE__*/ ET.orElse(R.Monad);
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
export const tapError = /*#__PURE__*/ dual(2, ET.tapError(R.Monad));
/**
 * @category error handling
 * @since 2.11.0
 */
export const orLeft = /*#__PURE__*/ ET.orLeft(R.Monad);
/**
 * @since 2.0.0
 */
export const swap = /*#__PURE__*/ ET.swap(R.Functor);
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
/* istanbul ignore next */
const _ap = (fab, fa) => pipe(fab, ap(fa));
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = 
/*#__PURE__*/ ET.map(R.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export const bimap = /*#__PURE__*/ ET.bimap(R.Functor);
/**
 * Map a function over the second type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
export const mapLeft = 
/*#__PURE__*/ ET.mapLeft(R.Functor);
/**
 * @since 2.0.0
 */
export const ap = /*#__PURE__*/ ET.ap(R.Apply);
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
 * @since 2.8.5
 */
export const of = right;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, ET.flatMap(R.Monad));
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
export const alt = 
/*#__PURE__*/ ET.alt(R.Monad);
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
 * @since 2.7.0
 */
export const throwError = left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'ReaderEither';
/**
 * @category filtering
 * @since 2.10.0
 */
export const getCompactable = (M) => {
    const C = E.getCompactable(M);
    return {
        URI,
        _E: undefined,
        compact: compact_(R.Functor, C),
        separate: separate_(R.Functor, C, E.Functor)
    };
};
/**
 * @category filtering
 * @since 2.10.0
 */
export function getFilterable(M) {
    const F = E.getFilterable(M);
    const C = getCompactable(M);
    const filter = filter_(R.Functor, F);
    const filterMap = filterMap_(R.Functor, F);
    const partition = partition_(R.Functor, F);
    const partitionMap = partitionMap_(R.Functor, F);
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
 * The default [`Applicative`](#applicative) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getApplicativeValidation`](./Either.ts.html#getapplicativevalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
export function getApplicativeReaderValidation(S) {
    const ap = ap_(R.Apply, E.getApplicativeValidation(S));
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
export function getAltReaderValidation(S) {
    const alt = ET.altValidation(R.Monad, S);
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
 * @category instances
 * @since 2.10.0
 */
export const Apply = {
    URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Less strict version of [`apFirst`](#apfirst)
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
export const apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * Less strict version of [`apSecond`](#apsecond)
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.12.0
 */
export const apSecondW = apSecond;
/**
 * @category instances
 * @since 2.7.0
 */
export const Applicative = {
    URI,
    map: _map,
    ap: _ap,
    of
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Chain = {
    URI,
    map: _map,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Monad = {
    URI,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap
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
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
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
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderKW = chainFirstReaderK;
/**
 * @category instances
 * @since 2.7.0
 */
export const MonadThrow = {
    URI,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap,
    throwError
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
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
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
export const apS = /*#__PURE__*/ apS_(Apply);
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
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(E.traverseReadonlyNonEmptyArrayWithIndex(SK)));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(f);
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
 * For example if a function needs a `Functor` instance, pass `RE.Functor` instead of `RE.readerEither`
 * (where `R` is from `import R from 'fp-ts/ReaderEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const readerEither = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    alt: _alt,
    throwError: left
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplySemigroup = 
/*#__PURE__*/ getApplySemigroup_(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getApplyMonoid = 
/*#__PURE__*/ getApplicativeMonoid(Applicative);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup = (S) => getApplySemigroup_(R.Apply)(E.getSemigroup(S));
/**
 * Use [`getApplicativeReaderValidation`](#getapplicativereadervalidation) and [`getAltReaderValidation`](#getaltreadervalidation) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export function getReaderValidation(SE) {
    const applicativeReaderValidation = getApplicativeReaderValidation(SE);
    const altReaderValidation = getAltReaderValidation(SE);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: applicativeReaderValidation.ap,
        of,
        chain: flatMap,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: altReaderValidation.alt,
        throwError
    };
}
//# sourceMappingURL=ReaderEither.js.map