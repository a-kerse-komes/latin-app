/**
 * @since 2.3.0
 */
import { getApplicativeMonoid } from './Applicative.js';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup as getApplySemigroup_ } from './Apply.js';
import * as chainable from './Chain.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { ask as ask_, asks as asks_, chainFirstReaderK as chainFirstReaderK_, chainReaderK as chainReaderK_, fromReaderK as fromReaderK_ } from './FromReader.js';
import { chainFirstTaskK as chainFirstTaskK_, chainTaskK as chainTaskK_, fromTaskK as fromTaskK_ } from './FromTask.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as R from './Reader.js';
import * as RT from './ReaderT.js';
import * as T from './Task.js';
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.3.0
 */
export const fromReader = /*#__PURE__*/ RT.fromReader(T.Pointed);
/**
 * @category conversions
 * @since 2.3.0
 */
export const fromTask = /*#__PURE__*/ R.of;
/**
 * @category conversions
 * @since 2.3.0
 */
export const fromIO = /*#__PURE__*/ flow(T.fromIO, fromTask);
/**
 * @category conversions
 * @since 2.13.0
 */
export const fromReaderIO = R.map(T.fromIO);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.3.0
 */
export const local = R.local;
/**
 * Less strict version of [`asksReaderTask`](#asksreadertask).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderTaskW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderTask = asksReaderTaskW;
const _map = (fa, f) => pipe(fa, map(f));
const _apPar = (fab, fa) => pipe(fab, ap(fa));
const _apSeq = (fab, fa) => flatMap(fab, (f) => pipe(fa, map(f)));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.3.0
 */
export const map = /*#__PURE__*/ RT.map(T.Functor);
/**
 * @since 2.3.0
 */
export const ap = 
/*#__PURE__*/ RT.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.8.0
 */
export const apW = ap;
/**
 * @category constructors
 * @since 2.3.0
 */
export const of = /*#__PURE__*/ RT.of(T.Pointed);
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, RT.flatMap(T.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const flattenW = 
/*#__PURE__*/ flatMap(identity);
/**
 * @category sequencing
 * @since 2.3.0
 */
export const flatten = flattenW;
/**
 * @category type lambdas
 * @since 2.3.0
 */
export const URI = 'ReaderTask';
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
 * @since 2.3.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.3.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(ApplyPar);
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
    of,
    ap: _apPar,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
export const MonadIO = {
    URI,
    map: _map,
    of,
    ap: _apPar,
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
    of,
    ap: _apPar,
    chain: flatMap,
    fromIO,
    fromTask
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
 * @since 2.10.0
 */
export const FromIO = {
    URI,
    fromIO
};
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromIOK = /*#__PURE__*/ fromIOK_(FromIO);
/**
 * @category sequencing
 * @since 2.4.0
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
 * @since 2.3.0
 */
export const ask = /*#__PURE__*/ ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderTask`.
 *
 * @category constructors
 * @since 2.3.0
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
export const chainReaderK = 
/*#__PURE__*/ chainReaderK_(FromReader, Chain);
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
export const chainFirstReaderK = 
/*#__PURE__*/ chainFirstReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
export const chainFirstReaderKW = chainFirstReaderK;
/**
 * @category lifting
 * @since 2.13.0
 */
export const fromReaderIOK = (f) => (...a) => fromReaderIO(f(...a));
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
export const FromTask = {
    URI,
    fromIO,
    fromTask
};
/**
 * @category lifting
 * @since 2.4.0
 */
export const fromTaskK = /*#__PURE__*/ fromTaskK_(FromTask);
/**
 * @category sequencing
 * @since 2.4.0
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
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
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
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
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
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(T.traverseReadonlyNonEmptyArrayWithIndex(SK)));
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
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndexSeq = (f) => flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(T.traverseReadonlyNonEmptyArrayWithIndexSeq(SK)));
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
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
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
 * @since 2.10.0
 */
export const traverseSeqArrayWithIndex = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.10.0
 */
export const traverseSeqArray = (f) => traverseReadonlyArrayWithIndexSeq((_, a) => f(a));
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.3.0
 */
export const chain = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.7
 */
export const chainW = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.3.0
 */
export const chainFirst = tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.11.0
 */
export const chainFirstW = tap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `traverseReadonlyArrayWithIndexSeq` instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export const sequenceSeqArray = 
/*#__PURE__*/ traverseSeqArray(identity);
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readerTask`
 * (where `RT` is from `import RT from 'fp-ts/ReaderTask'`)
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export const readerTask = {
    URI,
    map: _map,
    of,
    ap: _apPar,
    chain: flatMap,
    fromIO,
    fromTask
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readerTaskSeq`
 * (where `RT` is from `import RT from 'fp-ts/ReaderTask'`)
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export const readerTaskSeq = {
    URI,
    map: _map,
    of,
    ap: _apSeq,
    chain: flatMap,
    fromIO,
    fromTask
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export const getSemigroup = 
/*#__PURE__*/ getApplySemigroup_(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.3.0
 * @deprecated
 */
export const getMonoid = 
/*#__PURE__*/ getApplicativeMonoid(ApplicativeSeq);
/**
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
/* istanbul ignore next */
export function run(ma, r) {
    return ma(r)();
}
//# sourceMappingURL=ReaderTask.js.map