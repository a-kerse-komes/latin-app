/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */
import { getApplicativeMonoid } from './Applicative.js';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup as getApplySemigroup_ } from './Apply.js';
import * as chainable from './Chain.js';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO.js';
import { dual, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIO = (ma) => () => Promise.resolve().then(ma);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Creates a task that will complete after a time delay
 *
 * @example
 * import { sequenceT } from 'fp-ts/Apply'
 * import * as T from 'fp-ts/Task'
 * import { takeRight } from 'fp-ts/Array'
 *
 * async function test() {
 *   const log: Array<string> = []
 *   const append = (message: string): T.Task<void> =>
 *     T.fromIO(() => {
 *       log.push(message)
 *     })
 *   const fa = append('a')
 *   const fb = T.delay(20)(append('b'))
 *   const fc = T.delay(10)(append('c'))
 *   const fd = append('d')
 *   await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()
 *   assert.deepStrictEqual(takeRight(2)(log), ['c', 'b'])
 * }
 *
 * test()
 *
 * @since 2.0.0
 */
export function delay(millis) {
    return (ma) => () => new Promise((resolve) => {
        setTimeout(() => {
            Promise.resolve().then(ma).then(resolve);
        }, millis);
    });
}
const _map = (fa, f) => pipe(fa, map(f));
const _apPar = (fab, fa) => pipe(fab, ap(fa));
const _apSeq = (fab, fa) => flatMap(fab, (f) => pipe(fa, map(f)));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => () => Promise.resolve().then(fa).then(f);
/**
 * @since 2.0.0
 */
export const ap = (fa) => (fab) => () => Promise.all([Promise.resolve().then(fab), Promise.resolve().then(fa)]).then(([f, a]) => f(a));
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = (a) => () => Promise.resolve(a);
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => () => Promise.resolve()
    .then(ma)
    .then((a) => f(a)()));
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Task';
/**
 * Monoid returning the first completed task.
 *
 * Note: uses `Promise.race` internally.
 *
 * @example
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const S = T.getRaceMonoid<string>()
 *   const fa = T.delay(20)(T.of('a'))
 *   const fb = T.delay(10)(T.of('b'))
 *   assert.deepStrictEqual(await S.concat(fa, fb)(), 'b')
 * }
 *
 * test()
 *
 * @category instances
 * @since 2.0.0
 */
export function getRaceMonoid() {
    return {
        concat: (x, y) => () => Promise.race([Promise.resolve().then(x), Promise.resolve().then(y)]),
        empty: never
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
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
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
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const fromTask = identity;
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
export const fromIOK = 
/*#__PURE__*/ fromIOK_(FromIO);
/**
 * @category sequencing
 * @since 2.4.0
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * A `Task` that never completes.
 *
 * @since 2.0.0
 */
export const never = () => new Promise((_) => undefined);
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
export const apS = /*#__PURE__*/ apS_(ApplyPar);
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
export const traverseReadonlyNonEmptyArrayWithIndex = (f) => (as) => () => Promise.all(as.map((a, i) => Promise.resolve().then(() => f(i, a)())));
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
export const traverseReadonlyNonEmptyArrayWithIndexSeq = (f) => (as) => () => _.tail(as).reduce((acc, a, i) => acc.then((bs) => Promise.resolve()
    .then(f(i + 1, a))
    .then((b) => {
    bs.push(b);
    return bs;
})), Promise.resolve()
    .then(f(0, _.head(as)))
    .then(_.singleton));
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
export const sequenceArray = 
/*#__PURE__*/ traverseArray(identity);
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
export const sequenceSeqArray = 
/*#__PURE__*/ traverseSeqArray(identity);
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
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.task`
 * (where `T` is from `import T from 'fp-ts/Task'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const task = {
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
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.taskSeq`
 * (where `T` is from `import T from 'fp-ts/Task'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const taskSeq = {
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
 * @since 2.0.0
 * @deprecated
 */
export const getSemigroup = /*#__PURE__*/ getApplySemigroup_(ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * Lift a monoid into 'Task', the inner values are concatenated using the provided `Monoid`.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getMonoid = /*#__PURE__*/ getApplicativeMonoid(ApplicativeSeq);
//# sourceMappingURL=Task.js.map