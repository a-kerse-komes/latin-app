/**
 * ```ts
 * interface IO<A> {
 *   (): A
 * }
 * ```
 *
 * `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**.
 *
 * If you want to represent a synchronous computation that may fail, please see `IOEither`.
 * If you want to represent a synchronous computation that may yield nothing, please see `IOOption`.
 *
 * @since 2.0.0
 */
import { getApplicativeMonoid } from './Applicative.js';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup } from './Apply.js';
import * as chainable from './Chain.js';
import { constant, dual, identity } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
const _map = (ma, f) => () => f(ma());
const _ap = (mab, ma) => () => mab()(ma());
const _chainRec = (a, f) => () => {
    let e = f(a)();
    while (e._tag === 'Left') {
        e = f(e.left)();
    }
    return e.right;
};
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => _map(fa, f);
/**
 * @since 2.0.0
 */
export const ap = (fa) => (fab) => _ap(fab, fa);
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = constant;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => () => f(ma())());
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'IO';
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
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
export const apSecond = /*#__PURE__*/ apSecond_(Apply);
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
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const fromIO = identity;
/**
 * @category instances
 * @since 2.7.0
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
 * @since 2.7.0
 */
export const ChainRec = {
    URI,
    map: _map,
    ap: _ap,
    chain: flatMap,
    chainRec: _chainRec
};
/**
 * @category instances
 * @since 2.10.0
 */
export const FromIO = {
    URI,
    fromIO: identity
};
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
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply);
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
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => (as) => () => {
    const out = [f(0, _.head(as))()];
    for (let i = 1; i < as.length; i++) {
        out.push(f(i, as[i])());
    }
    return out;
};
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
export const sequenceArray = 
/*#__PURE__*/ traverseArray(identity);
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
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
export const chainFirst = tap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `IO.Functor` instead of `IO.io`
 * (where `IO` is from `import IO from 'fp-ts/IO'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const io = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    fromIO,
    chainRec: _chainRec
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup = /*#__PURE__*/ getApplySemigroup(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getMonoid = /*#__PURE__*/ getApplicativeMonoid(Applicative);
//# sourceMappingURL=IO.js.map