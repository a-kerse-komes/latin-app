import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import * as chainable from './Chain.js';
import * as E from './Either.js';
import { chainEitherK as chainEitherK_, chainFirstEitherK as chainFirstEitherK_, chainOptionK as chainOptionK_, filterOrElse as filterOrElse_, fromEitherK as fromEitherK_, fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { ask as ask_, asks as asks_, chainFirstReaderK as chainFirstReaderK_, chainReaderK as chainReaderK_, fromReaderK as fromReaderK_ } from './FromReader.js';
import { chainStateK as chainStateK_, fromStateK as fromStateK_, get as get_, gets as gets_, modify as modify_, put as put_ } from './FromState.js';
import { chainFirstTaskK as chainFirstTaskK_, chainTaskK as chainTaskK_, fromTaskK as fromTaskK_ } from './FromTask.js';
import { dual, flow, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as R from './Reader.js';
import * as RTE from './ReaderTaskEither.js';
import * as ST from './StateT.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export const left = (e) => () => RTE.left(e);
/**
 * @category constructors
 * @since 2.0.0
 */
export const right = /*#__PURE__*/ ST.of(RTE.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export function rightTask(ma) {
    return fromReaderTaskEither(RTE.rightTask(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function leftTask(me) {
    return fromReaderTaskEither(RTE.leftTask(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function rightReader(ma) {
    return fromReaderTaskEither(RTE.rightReader(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function leftReader(me) {
    return fromReaderTaskEither(RTE.leftReader(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function rightIO(ma) {
    return fromReaderTaskEither(RTE.rightIO(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function leftIO(me) {
    return fromReaderTaskEither(RTE.leftIO(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export const rightState = (sa) => flow(sa, RTE.right);
/**
 * @category constructors
 * @since 2.0.0
 */
export const leftState = (me) => (s) => RTE.left(me(s)[0]);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromEither = 
/*#__PURE__*/ E.match((e) => left(e), right);
/**
 * @category conversions
 * @since 2.11.0
 */
export const fromReader = rightReader;
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
 * @since 2.10.0
 */
export const fromState = 
/*#__PURE__*/ ST.fromState(RTE.Pointed);
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromTaskEither = (ma) => fromReaderTaskEither(RTE.fromTaskEither(ma));
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIOEither = (ma) => fromReaderTaskEither(RTE.fromIOEither(ma));
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromReaderEither = (ma) => fromReaderTaskEither(RTE.fromReaderEither(ma));
/**
 * @category constructors
 * @since 2.0.0
 */
export const fromReaderTaskEither = 
/*#__PURE__*/ ST.fromF(RTE.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.11.0
 */
export const local = (f) => (ma) => flow(ma, R.local(f));
/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksStateReaderTaskEitherW = (f) => (s) => (r) => f(r)(s)(r);
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksStateReaderTaskEither = asksStateReaderTaskEitherW;
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromIOEitherK = (f) => (...a) => fromIOEither(f(...a));
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category sequencing
 * @since 2.6.1
 */
export const chainIOEitherKW = (f) => (ma) => flatMap(ma, fromIOEitherK(f));
/**
 * @category sequencing
 * @since 2.4.0
 */
export const chainIOEitherK = chainIOEitherKW;
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromTaskEitherK = (f) => (...a) => fromTaskEither(f(...a));
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category sequencing
 * @since 2.6.1
 */
export const chainTaskEitherKW = (f) => (ma) => flatMap(ma, fromTaskEitherK(f));
/**
 * @category sequencing
 * @since 2.4.0
 */
export const chainTaskEitherK = chainTaskEitherKW;
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromReaderTaskEitherK = (f) => (...a) => fromReaderTaskEither(f(...a));
/**
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category sequencing
 * @since 2.6.1
 */
export const chainReaderTaskEitherKW = (f) => (ma) => flatMap(ma, fromReaderTaskEitherK(f));
/**
 * @category sequencing
 * @since 2.4.0
 */
export const chainReaderTaskEitherK = chainReaderTaskEitherKW;
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _ap = (fab, fa) => pipe(fab, ap(fa));
/* istanbul ignore next */
const _alt = (fa, that) => (s) => pipe(fa(s), RTE.alt(() => that()(s)));
const _bimap = (fea, f, g) => (s) => pipe(fea(s), RTE.bimap(f, ([a, s]) => [g(a), s]));
const _mapLeft = (fea, f) => (s) => pipe(fea(s), RTE.mapLeft(f));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = /*#__PURE__*/ ST.map(RTE.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.6.2
 */
export const bimap = (f, g) => (fa) => _bimap(fa, f, g);
/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.6.2
 */
export const mapLeft = (f) => (fa) => _mapLeft(fa, f);
/**
 * @since 2.0.0
 */
export const ap = /*#__PURE__*/ ST.ap(RTE.Chain);
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
export const flatMap = /*#__PURE__*/ dual(2, ST.flatMap(RTE.Monad));
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
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the environment, the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW = (that) => (fa) => (r) => pipe(fa(r), RTE.altW(() => that()(r)));
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.6.2
 */
export const alt = altW;
/**
 * @since 2.7.0
 */
export const throwError = left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'StateReaderTaskEither';
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
export const apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * Less strict version of [`apSecond`](#apsecond).
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
 * @since 2.11.0
 */
export const FromState = {
    URI,
    fromState
};
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const get = /*#__PURE__*/ get_(FromState);
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export const put = /*#__PURE__*/ put_(FromState);
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const modify = 
/*#__PURE__*/ modify_(FromState);
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const gets = 
/*#__PURE__*/ gets_(FromState);
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromStateK = /*#__PURE__*/ fromStateK_(FromState);
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainStateK = /*#__PURE__*/ chainStateK_(FromState, Chain);
/**
 * @category instances
 * @since 2.10.0
 */
export const Monad = {
    URI,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
export const MonadIO = {
    URI,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap,
    fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
export const MonadTask = {
    URI,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap,
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
    ap: _ap,
    of,
    chain: flatMap,
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
 * @since 2.11.0
 */
export const ask = /*#__PURE__*/ ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asks = 
/*#__PURE__*/ asks_(FromReader);
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
 * Less strict version of [`chainReaderK`](#chainReaderK).
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
export const chainFirstReaderK = 
/*#__PURE__*/ chainFirstReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderKW = chainFirstReaderK;
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
export const fromOption = /*#__PURE__*/ fromOption_(FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
export const fromOptionK = /*#__PURE__*/ fromOptionK_(FromEither);
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainOptionK = /*#__PURE__*/ chainOptionK_(FromEither, Chain);
/**
 * Less strict version of [`chainOptionK`](#chainoptionk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.13.2
 */
export const chainOptionKW = 
/*#__PURE__*/ chainOptionK;
/**
 * @category sequencing
 * @since 2.4.0
 */
export const chainEitherK = /*#__PURE__*/ chainEitherK_(FromEither, Chain);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @category sequencing
 * @since 2.6.1
 */
export const chainEitherKW = chainEitherK;
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainFirstEitherK = 
/*#__PURE__*/ chainFirstEitherK_(FromEither, Chain);
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
 * @since 2.4.4
 */
export const fromPredicate = /*#__PURE__*/ fromPredicate_(FromEither);
/**
 * @category filtering
 * @since 2.4.4
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
export const evaluate = 
/*#__PURE__*/ ST.evaluate(RTE.Functor);
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
export const execute = 
/*#__PURE__*/ ST.execute(RTE.Functor);
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor);
const let_ = /*#__PURE__*/ let__(Functor);
export { 
/**
 * @since 2.13.0
 */
let_ as let };
/**
 * @since 2.8.0
 */
export const bind = /*#__PURE__*/ chainable.bind(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types and the error types will be merged.
 *
 * @since 2.8.0
 */
export const bindW = bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
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
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => (as) => (s) => (r) => () => _.tail(as).reduce((acc, a, i) => acc.then((ebs) => _.isLeft(ebs)
    ? acc
    : f(i + 1, a)(ebs.right[1])(r)().then((eb) => {
        if (_.isLeft(eb)) {
            return eb;
        }
        const [b, s] = eb.right;
        ebs.right[0].push(b);
        ebs.right[1] = s;
        return ebs;
    })), f(0, _.head(as))(s)(r)().then(E.map(([b, s]) => [[b], s])));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : of(_.emptyReadonlyArray));
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEither`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const stateReaderTaskEither = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO,
    fromTask,
    throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `SRTE.Functor` instead of `SRTE.stateReaderTaskEitherSeq`
 * (where `SRTE` is from `import SRTE from 'fp-ts/StateReaderTaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const stateReaderTaskEitherSeq = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO,
    fromTask,
    throwError
};
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export const evalState = (fsa, s) => pipe(fsa(s), RTE.map(([a]) => a));
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export const execState = (fsa, s) => pipe(fsa(s), RTE.map(([_, s]) => s));
/**
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export function run(ma, s, r) {
    return ma(s)(r)();
}
//# sourceMappingURL=StateReaderTaskEither.js.map