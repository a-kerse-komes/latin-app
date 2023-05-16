import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import * as chainable from './Chain.js';
import { compact as compact_, separate as separate_ } from './Compactable.js';
import { filter as filter_, filterMap as filterMap_, partition as partition_, partitionMap as partitionMap_ } from './Filterable.js';
import { chainEitherK as chainEitherK_, chainFirstEitherK as chainFirstEitherK_, fromEitherK as fromEitherK_ } from './FromEither.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as I from './IO.js';
import * as O from './Option.js';
import * as OT from './OptionT.js';
import { guard as guard_ } from './Zero.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.12.0
 */
export const some = /*#__PURE__*/ OT.some(I.Pointed);
/**
 * @category lifting
 * @since 2.12.0
 */
export const fromPredicate = /*#__PURE__*/ OT.fromPredicate(I.Pointed);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromOption = I.of;
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromEither = /*#__PURE__*/ OT.fromEither(I.Pointed);
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromIO = /*#__PURE__*/ OT.fromF(I.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromIOEither = /*#__PURE__*/ I.map(O.fromEither);
/**
 * @category pattern matching
 * @since 2.12.0
 */
export const match = /*#__PURE__*/ OT.match(I.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export const matchW = match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`IO`).
 *
 * @category pattern matching
 * @since 2.12.0
 */
export const matchE = 
/*#__PURE__*/ OT.matchE(I.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.12.0
 */
export const fold = matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export const matchEW = matchE;
/**
 * @category error handling
 * @since 2.12.0
 */
export const getOrElse = /*#__PURE__*/ OT.getOrElse(I.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.12.0
 */
export const getOrElseW = getOrElse;
/**
 * @category conversions
 * @since 2.12.0
 */
export const toUndefined = I.map(O.toUndefined);
/**
 * @category conversions
 * @since 2.12.0
 */
export const toNullable = I.map(O.toNullable);
/**
 * @category conversions
 * @since 2.12.0
 */
export const fromNullable = /*#__PURE__*/ OT.fromNullable(I.Pointed);
/**
 * @category lifting
 * @since 2.12.0
 */
export const fromNullableK = /*#__PURE__*/ OT.fromNullableK(I.Pointed);
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainNullableK = /*#__PURE__*/ OT.chainNullableK(I.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category lifting
 * @since 2.12.0
 */
export const fromOptionK = 
/*#__PURE__*/ OT.fromOptionK(I.Pointed);
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainOptionK = 
/*#__PURE__*/ OT.chainOptionK(I.Monad);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.12.0
 */
export const map = /*#__PURE__*/ OT.map(I.Functor);
/**
 * @since 2.12.0
 */
export const ap = /*#__PURE__*/ OT.ap(I.Apply);
/**
 * @category constructors
 * @since 2.12.0
 */
export const of = some;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, OT.flatMap(I.Monad));
/**
 * @category sequencing
 * @since 2.12.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * @category error handling
 * @since 2.12.0
 */
export const alt = /*#__PURE__*/ OT.alt(I.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.12.0
 */
export const altW = alt;
/**
 * @since 2.12.0
 */
export const zero = /*#__PURE__*/ OT.zero(I.Pointed);
/**
 * @category constructors
 * @since 2.12.0
 */
export const none = /*#__PURE__*/ zero();
/**
 * @category filtering
 * @since 2.12.0
 */
export const compact = /*#__PURE__*/ compact_(I.Functor, O.Compactable);
/**
 * @category filtering
 * @since 2.12.0
 */
export const separate = /*#__PURE__*/ separate_(I.Functor, O.Compactable, O.Functor);
/**
 * @category filtering
 * @since 2.12.0
 */
export const filter = /*#__PURE__*/ filter_(I.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.12.0
 */
export const filterMap = /*#__PURE__*/ filterMap_(I.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.12.0
 */
export const partition = /*#__PURE__*/ partition_(I.Functor, O.Filterable);
/**
 * @category filtering
 * @since 2.12.0
 */
export const partitionMap = /*#__PURE__*/ partitionMap_(I.Functor, O.Filterable);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _ap = (fab, fa) => pipe(fab, ap(fa));
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
/* istanbul ignore next */
const _filter = (fa, predicate) => pipe(fa, filter(predicate));
/* istanbul ignore next */
const _filterMap = (fa, f) => pipe(fa, filterMap(f));
/* istanbul ignore next */
const _partition = (fa, predicate) => pipe(fa, partition(predicate));
/* istanbul ignore next */
const _partitionMap = (fa, f) => pipe(fa, partitionMap(f));
/**
 * @category type lambdas
 * @since 2.12.0
 */
export const URI = 'IOOption';
/**
 * @category instances
 * @since 2.12.0
 */
export const Functor = {
    URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.12.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);
/**
 * @category instances
 * @since 2.12.0
 */
export const Pointed = {
    URI,
    of
};
/**
 * @category instances
 * @since 2.12.0
 */
export const Apply = {
    URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.12.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.12.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(Apply);
/**
 * @category instances
 * @since 2.12.0
 */
export const Applicative = {
    URI,
    map: _map,
    ap: _ap,
    of
};
/**
 * @category instances
 * @since 2.12.0
 */
export const Chain = {
    URI,
    map: _map,
    ap: _ap,
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
 * @since 2.12.0
 */
export const Alt = {
    URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.12.0
 */
export const Zero = {
    URI,
    zero
};
/**
 * @category do notation
 * @since 2.12.0
 */
export const guard = /*#__PURE__*/ guard_(Zero, Pointed);
/**
 * @category instances
 * @since 2.12.0
 */
export const Alternative = {
    URI,
    map: _map,
    ap: _ap,
    of,
    alt: _alt,
    zero
};
/**
 * @category instances
 * @since 2.12.0
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
 * @since 2.12.0
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
 * @since 2.12.0
 */
export const Compactable = {
    URI,
    compact,
    separate
};
/**
 * @category instances
 * @since 2.12.0
 */
export const Filterable = {
    URI,
    map: _map,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instances
 * @since 2.12.0
 */
export const FromIO = {
    URI,
    fromIO
};
/**
 * @category lifting
 * @since 2.12.0
 */
export const fromIOK = 
/*#__PURE__*/ fromIOK_(FromIO);
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainIOK = /*#__PURE__*/ chainIOK_(FromIO, Chain);
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainFirstIOK = 
/*#__PURE__*/ chainFirstIOK_(FromIO, Chain);
/**
 * @category instances
 * @since 2.12.0
 */
export const FromEither = {
    URI,
    fromEither
};
/**
 * @category lifting
 * @since 2.12.0
 */
export const fromEitherK = /*#__PURE__*/ fromEitherK_(FromEither);
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainEitherK = 
/*#__PURE__*/ chainEitherK_(FromEither, Chain);
/**
 * @category sequencing
 * @since 2.12.0
 */
export const chainFirstEitherK = 
/*#__PURE__*/ chainFirstEitherK_(FromEither, Chain);
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.12.0
 */
export const Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.12.0
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
 * @since 2.12.0
 */
export const bind = /*#__PURE__*/ chainable.bind(Chain);
/**
 * @category do notation
 * @since 2.12.0
 */
export const apS = /*#__PURE__*/ apS_(Apply);
/**
 * @since 2.12.0
 */
export const ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.12.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => flow(I.traverseReadonlyNonEmptyArrayWithIndex(f), I.map(O.traverseReadonlyNonEmptyArrayWithIndex(SK)));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.12.0
 */
export const traverseReadonlyArrayWithIndex = (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chain = flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.12.0
 */
export const chainFirst = tap;
//# sourceMappingURL=IOOption.js.map