import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import * as chainable from './Chain.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { ask as ask_, asks as asks_, chainFirstReaderK as chainFirstReaderK_, chainReaderK as chainReaderK_, fromReaderK as fromReaderK_ } from './FromReader.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
import * as I from './IO.js';
import * as R from './Reader.js';
import * as RT from './ReaderT.js';
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.13.0
 */
export const fromReader = /*#__PURE__*/ RT.fromReader(I.Pointed);
/**
 * @category conversions
 * @since 2.13.0
 */
export const fromIO = /*#__PURE__*/ R.of;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @since 2.13.0
 */
export const local = R.local;
/**
 * Less strict version of [`asksReaderIO`](#asksreaderio).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.13.0
 */
export const asksReaderIOW = R.asksReaderW;
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.13.0
 */
export const asksReaderIO = asksReaderIOW;
const _map = (fa, f) => pipe(fa, map(f));
const _ap = (fab, fa) => pipe(fab, ap(fa));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.13.0
 */
export const map = /*#__PURE__*/ RT.map(I.Functor);
/**
 * @since 2.13.0
 */
export const ap = 
/*#__PURE__*/ RT.ap(I.Apply);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.13.0
 */
export const apW = ap;
/**
 * @category constructors
 * @since 2.13.0
 */
export const of = /*#__PURE__*/ RT.of(I.Pointed);
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, RT.flatMap(I.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.13.0
 */
export const flattenW = 
/*#__PURE__*/ flatMap(identity);
/**
 * @category sequencing
 * @since 2.13.0
 */
export const flatten = flattenW;
/**
 * @category type lambdas
 * @since 2.13.0
 */
export const URI = 'ReaderIO';
/**
 * @category instances
 * @since 2.13.0
 */
export const Functor = {
    URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.13.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.13.0
 */
export const Pointed = {
    URI,
    of
};
/**
 * @category instances
 * @since 2.13.0
 */
export const Apply = {
    URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.13.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.13.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * @category instances
 * @since 2.13.0
 */
export const Applicative = {
    URI,
    map: _map,
    ap: _ap,
    of
};
/**
 * @category instances
 * @since 2.13.0
 */
export const Chain = {
    URI,
    map: _map,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.13.0
 */
export const Monad = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap
};
/**
 * @category instances
 * @since 2.13.0
 */
export const MonadIO = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    fromIO
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
 * @since 2.13.0
 */
export const FromIO = {
    URI,
    fromIO
};
/**
 * @category lifting
 * @since 2.13.0
 */
export const fromIOK = /*#__PURE__*/ fromIOK_(FromIO);
/**
 * @category sequencing
 * @since 2.13.0
 */
export const chainIOK = 
/*#__PURE__*/ chainIOK_(FromIO, Chain);
/**
 * @category sequencing
 * @since 2.13.0
 */
export const chainFirstIOK = 
/*#__PURE__*/ chainFirstIOK_(FromIO, Chain);
/**
 * @category instances
 * @since 2.13.0
 */
export const FromReader = {
    URI,
    fromReader
};
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.13.0
 */
export const ask = /*#__PURE__*/ ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderIO`.
 *
 * @category constructors
 * @since 2.13.0
 */
export const asks = /*#__PURE__*/ asks_(FromReader);
/**
 * @category lifting
 * @since 2.13.0
 */
export const fromReaderK = /*#__PURE__*/ fromReaderK_(FromReader);
/**
 * @category sequencing
 * @since 2.13.0
 */
export const chainReaderK = 
/*#__PURE__*/ chainReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainReaderK`](#chainreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.13.0
 */
export const chainReaderKW = chainReaderK;
/**
 * @category sequencing
 * @since 2.13.0
 */
export const chainFirstReaderK = 
/*#__PURE__*/ chainFirstReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainFirstReaderK`](#chainfirstreaderk).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category sequencing
 * @since 2.13.0
 */
export const chainFirstReaderKW = chainFirstReaderK;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.13.0
 */
export const Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.13.0
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor);
/**
 * @category do notation
 * @since 2.13.0
 */
export const bind = /*#__PURE__*/ chainable.bind(Chain);
/**
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.13.0
 */
export const bindW = bind;
/**
 * @category do notation
 * @since 2.13.0
 */
export const apS = /*#__PURE__*/ apS_(Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category do notation
 * @since 2.13.0
 */
export const apSW = apS;
/**
 * @since 2.13.0
 */
export const ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => flow(R.traverseReadonlyNonEmptyArrayWithIndex(f), R.map(I.traverseReadonlyNonEmptyArrayWithIndex(SK)));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export const traverseReadonlyArrayWithIndex = (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export const traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export const traverseArray = (f) => traverseReadonlyArrayWithIndex((_, a) => f(a));
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.13.0
 */
export const sequenceArray = 
/*#__PURE__*/ traverseArray(identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export const chain = flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export const chainW = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export const chainFirst = tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.13.0
 */
export const chainFirstW = tap;
//# sourceMappingURL=ReaderIO.js.map