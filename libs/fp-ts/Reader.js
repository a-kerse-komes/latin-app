/**
 * The `Reader` monad (also called the Environment monad). Represents a computation, which can read values from a shared environment,
 * pass values from function to function, and execute sub-computations in a modified environment.
 * Using `Reader` monad for such computations is often clearer and easier than using the `State` monad.
 *
 * In this example the `Reader` monad provides access to variable bindings. `Bindings` are a map of `number` variables.
 * The variable count contains number of variables in the bindings. You can see how to run a `Reader` monad and retrieve
 * data from it, how to access the `Reader` data with `ask` and `asks`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 * import * as R from 'fp-ts/Reader'
 * import * as RR from 'fp-ts/ReadonlyRecord'
 *
 * interface Bindings extends RR.ReadonlyRecord<string, number> {}
 *
 * // The Reader monad, which implements this complicated check.
 * const isCountCorrect: R.Reader<Bindings, boolean> = pipe(
 *   R.Do,
 *   R.bind('count', () => R.asks(lookupVar('count'))),
 *   R.bind('bindings', () => R.ask()),
 *   R.map(({ count, bindings }) => count === RR.size(bindings))
 * )
 *
 * // The selector function to use with 'asks'.
 * // Returns value of the variable with specified name.
 * const lookupVar = (name: string) => (bindings: Bindings): number =>
 *   pipe(
 *     bindings,
 *     RR.lookup(name),
 *     O.getOrElse(() => 0)
 *   )
 *
 * const sampleBindings: Bindings = { count: 3, a: 1, b: 2 }
 *
 * assert.deepStrictEqual(isCountCorrect(sampleBindings), true)
 *
 * @since 2.0.0
 */
import { getApplicativeMonoid } from './Applicative.js';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup } from './Apply.js';
import * as chainable from './Chain.js';
import * as E from './Either.js';
import { constant, dual, flow, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Reads the current context
 *
 * @category constructors
 * @since 2.0.0
 */
export const ask = () => identity;
/**
 * Projects a value from the global context in a Reader
 *
 * @category constructors
 * @since 2.0.0
 */
export const asks = identity;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as R from 'fp-ts/Reader'
 * import * as string from 'fp-ts/string'
 *
 * const calculateContentLen: R.Reader<string, number> = pipe(
 *   R.Do,
 *   R.bind('content', () => R.ask<string>()),
 *   R.map(({ content }) => string.size(content))
 * )
 *
 * // Calls calculateContentLen after adding a prefix to the Reader content.
 * const calculateModifiedContentLen: R.Reader<string, number> = pipe(
 *   calculateContentLen,
 *   R.local((s) => 'Prefix ' + s)
 * )
 *
 * const s = '12345'
 *
 * assert.deepStrictEqual(
 *   "Modified 's' length: " + calculateModifiedContentLen(s) + '\n' + "Original 's' length: " + calculateContentLen(s),
 *   "Modified 's' length: 12\nOriginal 's' length: 5"
 * )
 *
 * @since 2.0.0
 */
export const local = (f) => (ma) => (r2) => ma(f(r2));
/**
 * Less strict version of [`asksReader`](#asksreader).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReaderW = (f) => (r) => f(r)(r);
/**
 * Effectfully accesses the environment.
 *
 * @category constructors
 * @since 2.11.0
 */
export const asksReader = asksReaderW;
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _ap = (fab, fa) => pipe(fab, ap(fa));
const _compose = (bc, ab) => pipe(bc, compose(ab));
const _promap = (fea, f, g) => pipe(fea, promap(f, g));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => (r) => f(fa(r));
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
 *
 * @since 2.8.0
 */
export const apW = (fa) => (fab) => (r) => fab(r)(fa(r));
/**
 * @since 2.0.0
 */
export const ap = apW;
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = constant;
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => (r) => f(ma(r))(r));
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
 * @since 2.0.0
 */
export const flatten = flattenW;
/**
 * @since 2.0.0
 */
export const compose = (ab) => (bc) => flow(ab, bc);
/**
 * @since 2.0.0
 */
export const promap = (f, g) => (fea) => (a) => g(fea(f(a)));
/**
 * @category constructors
 * @since 2.0.0
 */
export const id = () => identity;
/**
 * @since 2.10.0
 */
export const first = (pab) => ([a, c]) => [pab(a), c];
/**
 * @since 2.10.0
 */
export const second = (pbc) => ([a, b]) => [a, pbc(b)];
/**
 * @since 2.10.0
 */
export const left = (pab) => E.fold((a) => _.left(pab(a)), E.right);
/**
 * @since 2.10.0
 */
export const right = (pbc) => E.fold(E.left, (b) => _.right(pbc(b)));
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Reader';
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
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
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
 * The `W` suffix (short for **W**idening) means that the environment types will be merged.
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
    of,
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
 * @since 2.7.0
 */
export const Profunctor = {
    URI,
    map: _map,
    promap: _promap
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Category = {
    URI,
    compose: _compose,
    id
};
/**
 * @category instances
 * @since 2.8.3
 */
export const Strong = {
    URI,
    map: _map,
    promap: _promap,
    first,
    second
};
/**
 * @category instances
 * @since 2.8.3
 */
export const Choice = {
    URI,
    map: _map,
    promap: _promap,
    left,
    right
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
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
 * @since 2.9.0
 */
export const Do = /*#__PURE__*/ of(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
export const apS = /*#__PURE__*/ apS_(Apply);
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
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => (as) => (r) => {
    const out = [f(0, _.head(as))(r)];
    for (let i = 1; i < as.length; i++) {
        out.push(f(i, as[i])(r));
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
 * @since 2.6.0
 */
export const chainW = flatMap;
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
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `R.Functor` instead of `R.reader`
 * (where `R` is from `import R from 'fp-ts/Reader'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const reader = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    promap: _promap,
    compose: _compose,
    id,
    first,
    second,
    left,
    right
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
//# sourceMappingURL=Reader.js.map