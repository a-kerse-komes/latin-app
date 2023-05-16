import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain.js';
import { tailRec } from './ChainRec.js';
import { dual, identity as id, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
const _map = (fa, f) => pipe(fa, map(f));
const _ap = (fab, fa) => pipe(fab, ap(fa));
/* istanbul ignore next */
const _reduce = (fa, b, f) => pipe(fa, reduce(b, f));
/* istanbul ignore next */
const _foldMap = (M) => (fa, f) => pipe(fa, foldMap(M)(f));
/* istanbul ignore next */
const _reduceRight = (fa, b, f) => pipe(fa, reduceRight(b, f));
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
/* istanbul ignore next */
const _extend = (wa, f) => pipe(wa, extend(f));
/* istanbul ignore next */
const _traverse = (F) => {
    const traverseF = traverse(F);
    return (ta, f) => pipe(ta, traverseF(f));
};
const _chainRec = tailRec;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => f(fa);
/**
 * @since 2.0.0
 */
export const ap = (fa) => (fab) => fab(fa);
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = id;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => f(ma));
/**
 * @since 2.0.0
 */
export const extend = (f) => (wa) => f(wa);
/**
 * @category Extract
 * @since 2.6.2
 */
export const extract = id;
/**
 * @since 2.0.0
 */
export const duplicate = /*#__PURE__*/ extend(id);
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = /*#__PURE__*/ flatMap(id);
/**
 * @category folding
 * @since 2.0.0
 */
export const reduce = (b, f) => (fa) => f(b, fa);
/**
 * @category folding
 * @since 2.0.0
 */
export const foldMap = () => (f) => (fa) => f(fa);
/**
 * @category folding
 * @since 2.0.0
 */
export const reduceRight = (b, f) => (fa) => f(fa, b);
/**
 * @category traversing
 * @since 2.6.3
 */
export const traverse = (F) => (f) => (ta) => F.map(f(ta), id);
/**
 * @category traversing
 * @since 2.6.3
 */
export const sequence = (F) => (ta) => {
    return F.map(ta, id);
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW = () => id;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt = altW;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Identity';
/**
 * @category instances
 * @since 2.0.0
 */
export const getShow = id;
/**
 * @category instances
 * @since 2.0.0
 */
export const getEq = id;
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
 * @category sequencing
 * @since 2.0.0
 */
export const chainFirst = /*#__PURE__*/ chainFirst_(Chain);
/**
 * @category instances
 * @since 2.7.0
 */
export const Foldable = {
    URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Traversable = {
    URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence
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
 * @since 2.7.0
 */
export const Comonad = {
    URI,
    map: _map,
    extend: _extend,
    extract
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
export const bind = /*#__PURE__*/ bind_(Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply);
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `I.Functor` instead of `I.identity`
 * (where `I` is from `import I from 'fp-ts/Identity'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const identity = {
    URI,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence,
    alt: _alt,
    extract,
    extend: _extend,
    chainRec: _chainRec
};
//# sourceMappingURL=Identity.js.map