import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import * as chainable from './Chain.js';
import { dual, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const get = () => (s) => [s, s];
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export const put = (s) => () => [undefined, s];
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const modify = (f) => (s) => [undefined, f(s)];
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export const gets = (f) => (s) => [f(s), s];
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _ap = (fab, fa) => pipe(fab, ap(fa));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => (s1) => {
    const [a, s2] = fa(s1);
    return [f(a), s2];
};
/**
 * @since 2.0.0
 */
export const ap = (fa) => (fab) => (s1) => {
    const [f, s2] = fab(s1);
    const [a, s3] = fa(s2);
    return [f(a), s3];
};
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = (a) => (s) => [a, s];
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => (s1) => {
    const [a, s2] = ma(s1);
    return f(a)(s2);
});
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'State';
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
 * @category instances
 * @since 2.11.0
 */
export const FromState = {
    URI,
    fromState: identity
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Run a computation in the `State` monad, discarding the final state
 *
 * @since 2.8.0
 */
export const evaluate = (s) => (ma) => ma(s)[0];
/**
 * Run a computation in the `State` monad discarding the result
 *
 * @since 2.8.0
 */
export const execute = (s) => (ma) => ma(s)[1];
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
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => (as) => (s) => {
    const [b, s2] = f(0, _.head(as))(s);
    const bs = [b];
    let out = s2;
    for (let i = 1; i < as.length; i++) {
        const [b, s2] = f(i, as[i])(out);
        bs.push(b);
        out = s2;
    }
    return [bs, out];
};
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
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const evalState = (ma, s) => ma(s)[0];
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const execState = (ma, s) => ma(s)[1];
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `S.Functor` instead of `S.state`
 * (where `S` is from `import S from 'fp-ts/State'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const state = Monad;
//# sourceMappingURL=State.js.map