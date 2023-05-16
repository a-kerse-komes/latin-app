import { getApplySemigroup } from './Apply.js';
import { fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither.js';
import { fromIOK as fromIOK_ } from './FromIO.js';
import { fromTaskK as fromTaskK_ } from './FromTask.js';
import { fromTheseK as fromTheseK_ } from './FromThese.js';
import { flow, pipe, SK } from './function.js';
import { flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
import * as T from './Task.js';
import * as TH from './These.js';
import * as TT from './TheseT.js';
/**
 * @category constructors
 * @since 2.4.0
 */
export const left = /*#__PURE__*/ TT.left(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
export const right = /*#__PURE__*/ TT.right(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
export const both = /*#__PURE__*/ TT.both(T.Pointed);
/**
 * @category constructors
 * @since 2.4.0
 */
export const rightTask = /*#__PURE__*/ TT.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.4.0
 */
export const leftTask = /*#__PURE__*/ TT.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.4.0
 */
export const rightIO = /*#__PURE__*/ flow(T.fromIO, rightTask);
/**
 * @category constructors
 * @since 2.4.0
 */
export const leftIO = /*#__PURE__*/ flow(T.fromIO, leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.10.0
 */
export const fromEither = T.of;
/**
 * @category conversions
 * @since 2.11.0
 */
export const fromThese = T.of;
/**
 * @category conversions
 * @since 2.7.0
 */
export const fromIO = rightIO;
/**
 * @category conversions
 * @since 2.4.0
 */
export const fromIOEither = /*#__PURE__*/ T.fromIO;
/**
 * @category conversions
 * @since 2.7.0
 */
export const fromTask = rightTask;
/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match = /*#__PURE__*/ TT.match(T.Functor);
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
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchE = /*#__PURE__*/ TT.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.4.0
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
export const matchEW = fold;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const foldW = matchEW;
/**
 * @since 2.4.0
 */
export const swap = /*#__PURE__*/ TT.swap(T.Functor);
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.4.0
 */
export const map = /*#__PURE__*/ TT.map(T.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.4.0
 */
export const bimap = 
/*#__PURE__*/ TT.bimap(T.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.4.0
 */
export const mapLeft = /*#__PURE__*/ TT.mapLeft(T.Functor);
/**
 * @category constructors
 * @since 2.7.0
 */
export const of = right;
/**
 * @category type lambdas
 * @since 2.4.0
 */
export const URI = 'TaskThese';
/**
 * @category instances
 * @since 2.10.0
 */
export const getApply = (A, S) => {
    const ap = TT.ap(A, S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: (fab, fa) => pipe(fab, ap(fa))
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
export function getApplicative(A, S) {
    const { ap } = getApply(A, S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap,
        of
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
export function getChain(S) {
    const A = getApply(T.ApplicativePar, S);
    const chain = TT.chain(T.Monad, S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: (ma, f) => pipe(ma, chain(f))
    };
}
/**
 * @category instances
 * @since 2.4.0
 */
export function getMonad(S) {
    const A = getApplicative(T.ApplicativePar, S);
    const C = getChain(S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of,
        chain: C.chain,
        fromIO,
        fromTask
    };
}
/**
 * @category instances
 * @since 2.10.0
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
export const Bifunctor = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft
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
 * @since 2.10.0
 */
export const fromOption = 
/*#__PURE__*/ fromOption_(FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
export const fromOptionK = 
/*#__PURE__*/ fromOptionK_(FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
export const fromPredicate = /*#__PURE__*/ fromPredicate_(FromEither);
/**
 * @category instances
 * @since 2.11.0
 */
export const FromThese = {
    URI,
    fromThese
};
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromTheseK = /*#__PURE__*/ fromTheseK_(FromThese);
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export const toTuple2 = 
/*#__PURE__*/ TT.toTuple2(T.Functor);
/**
 * @since 2.11.0
 */
export const ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (S) => {
    const g = TH.traverseReadonlyNonEmptyArrayWithIndex(S);
    return (f) => flow(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(g(SK)));
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = (S) => (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(S)(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndexSeq = (S) => (f) => (as) => () => _.tail(as).reduce((acc, a, i) => acc.then((ebs) => TH.isLeft(ebs)
    ? acc
    : f(i + 1, a)().then((eb) => {
        if (TH.isLeft(eb)) {
            return eb;
        }
        if (TH.isBoth(eb)) {
            const right = ebs.right;
            right.push(eb.right);
            return TH.isBoth(ebs) ? TH.both(S.concat(ebs.left, eb.left), right) : TH.both(eb.left, right);
        }
        ebs.right.push(eb.right);
        return ebs;
    })), f(0, _.head(as))().then(TH.map(_.singleton)));
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativeSeq, S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndexSeq = (S) => (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndexSeq(S)(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const functorTaskThese = {
    URI,
    map: _map
};
/**
 * Use [`Bifunctor`](#bifunctor) instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const bifunctorTaskThese = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Use [`toTuple2`](#totuple2) instead.
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export const toTuple = (e, a) => toTuple2(() => e, () => a);
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TT.Functor` instead of `TT.taskThese`
 * (where `TT` is from `import TT from 'fp-ts/TaskThese'`)
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export const taskThese = {
    URI,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export const getSemigroup = (SE, SA) => getApplySemigroup(T.ApplySeq)(TH.getSemigroup(SE, SA));
//# sourceMappingURL=TaskThese.js.map