import { fromEquals } from './Eq.js';
import { fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_ } from './FromEither.js';
import { identity, pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the these is an instance of `Left`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export const isLeft = (fa) => fa._tag === 'Left';
/**
 * Returns `true` if the these is an instance of `Right`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export const isRight = (fa) => fa._tag === 'Right';
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 *
 * @category refinements
 * @since 2.0.0
 */
export function isBoth(fa) {
    return fa._tag === 'Both';
}
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export function left(left) {
    return { _tag: 'Left', left };
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function right(right) {
    return { _tag: 'Right', right };
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function both(left, right) {
    return { _tag: 'Both', left, right };
}
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchW = (onLeft, onRight, onBoth) => (fa) => {
    switch (fa._tag) {
        case 'Left':
            return onLeft(fa.left);
        case 'Right':
            return onRight(fa.right);
        case 'Both':
            return onBoth(fa.left, fa.right);
    }
};
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const foldW = matchW;
/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export const fold = match;
/**
 * @since 2.4.0
 */
export const swap = match(right, left, (e, a) => both(a, e));
/**
 * @category instances
 * @since 2.0.0
 */
export function getShow(SE, SA) {
    return {
        show: match((l) => `left(${SE.show(l)})`, (a) => `right(${SA.show(a)})`, (l, a) => `both(${SE.show(l)}, ${SA.show(a)})`)
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getEq(EE, EA) {
    return fromEquals((x, y) => isLeft(x)
        ? isLeft(y) && EE.equals(x.left, y.left)
        : isRight(x)
            ? isRight(y) && EA.equals(x.right, y.right)
            : isBoth(y) && EE.equals(x.left, y.left) && EA.equals(x.right, y.right));
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getSemigroup(SE, SA) {
    return {
        concat: (x, y) => isLeft(x)
            ? isLeft(y)
                ? left(SE.concat(x.left, y.left))
                : isRight(y)
                    ? both(x.left, y.right)
                    : both(SE.concat(x.left, y.left), y.right)
            : isRight(x)
                ? isLeft(y)
                    ? both(y.left, x.right)
                    : isRight(y)
                        ? right(SA.concat(x.right, y.right))
                        : both(y.left, SA.concat(x.right, y.right))
                : isLeft(y)
                    ? both(SE.concat(x.left, y.left), x.right)
                    : isRight(y)
                        ? both(x.left, SA.concat(x.right, y.right))
                        : both(SE.concat(x.left, y.left), SA.concat(x.right, y.right))
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
export const getApply = (S) => ({
    URI,
    _E: undefined,
    map: _map,
    ap: (fab, fa) => isLeft(fab)
        ? isLeft(fa)
            ? left(S.concat(fab.left, fa.left))
            : isRight(fa)
                ? left(fab.left)
                : left(S.concat(fab.left, fa.left))
        : isRight(fab)
            ? isLeft(fa)
                ? left(fa.left)
                : isRight(fa)
                    ? right(fab.right(fa.right))
                    : both(fa.left, fab.right(fa.right))
            : isLeft(fa)
                ? left(S.concat(fab.left, fa.left))
                : isRight(fa)
                    ? both(fab.left, fab.right(fa.right))
                    : both(S.concat(fab.left, fa.left), fab.right(fa.right))
});
/**
 * @category instances
 * @since 2.7.0
 */
export function getApplicative(S) {
    const A = getApply(S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
export function getChain(S) {
    const A = getApply(S);
    const chain = (ma, f) => {
        if (isLeft(ma)) {
            return ma;
        }
        if (isRight(ma)) {
            return f(ma.right);
        }
        const fb = f(ma.right);
        return isLeft(fb)
            ? left(S.concat(ma.left, fb.left))
            : isRight(fb)
                ? both(ma.left, fb.right)
                : both(S.concat(ma.left, fb.left), fb.right);
    };
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getMonad(S) {
    const C = getChain(S);
    return {
        URI,
        _E: undefined,
        map: _map,
        of,
        ap: C.ap,
        chain: C.chain,
        throwError: left
    };
}
/**
 * Returns an `E` value if possible
 *
 * @example
 * import { getLeft, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(both('a', 1)), some('a'))
 *
 * @category conversions
 * @since 2.0.0
 */
export function getLeft(fa) {
    return isLeft(fa) ? _.some(fa.left) : isRight(fa) ? _.none : _.some(fa.left);
}
/**
 * Returns an `A` value if possible
 *
 * @example
 * import { getRight, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getRight(left('a')), none)
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(both('a', 1)), some(1))
 *
 * @category conversions
 * @since 2.0.0
 */
export function getRight(fa) {
    return isLeft(fa) ? _.none : isRight(fa) ? _.some(fa.right) : _.some(fa.right);
}
// TODO: make lazy in v3
/**
 * @example
 * import { leftOrBoth, left, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(leftOrBoth('a')(none), left('a'))
 * assert.deepStrictEqual(leftOrBoth('a')(some(1)), both('a', 1))
 *
 * @category constructors
 * @since 2.0.0
 */
export function leftOrBoth(e) {
    return (ma) => (_.isNone(ma) ? left(e) : both(e, ma.value));
}
// TODO: make lazy in v3
/**
 * @example
 * import { rightOrBoth, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(rightOrBoth(1)(none), right(1))
 * assert.deepStrictEqual(rightOrBoth(1)(some('a')), both('a', 1))
 *
 * @category constructors
 * @since 2.0.0
 */
export function rightOrBoth(a) {
    return (me) => (_.isNone(me) ? right(a) : both(me.value, a));
}
/**
 * Returns the `E` value if and only if the value is constructed with `Left`
 *
 * @example
 * import { getLeftOnly, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getLeftOnly(left('a')), some('a'))
 * assert.deepStrictEqual(getLeftOnly(right(1)), none)
 * assert.deepStrictEqual(getLeftOnly(both('a', 1)), none)
 *
 * @category conversions
 * @since 2.0.0
 */
export function getLeftOnly(fa) {
    return isLeft(fa) ? _.some(fa.left) : _.none;
}
/**
 * Returns the `A` value if and only if the value is constructed with `Right`
 *
 * @example
 * import { getRightOnly, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getRightOnly(left('a')), none)
 * assert.deepStrictEqual(getRightOnly(right(1)), some(1))
 * assert.deepStrictEqual(getRightOnly(both('a', 1)), none)
 *
 * @category conversions
 * @since 2.0.0
 */
export function getRightOnly(fa) {
    return isRight(fa) ? _.some(fa.right) : _.none;
}
/**
 * Takes a pair of `Option`s and attempts to create a `These` from them
 *
 * @example
 * import { fromOptions, left, right, both } from 'fp-ts/These'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromOptions(none, none), none)
 * assert.deepStrictEqual(fromOptions(some('a'), none), some(left('a')))
 * assert.deepStrictEqual(fromOptions(none, some(1)), some(right(1)))
 * assert.deepStrictEqual(fromOptions(some('a'), some(1)), some(both('a', 1)))
 *
 * @category conversions
 * @since 2.0.0
 */
export const fromOptions = (fe, fa) => _.isNone(fe)
    ? _.isNone(fa)
        ? _.none
        : _.some(right(fa.value))
    : _.isNone(fa)
        ? _.some(left(fe.value))
        : _.some(both(fe.value, fa.value));
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapLeft(f));
/* istanbul ignore next */
const _reduce = (fa, b, f) => pipe(fa, reduce(b, f));
/* istanbul ignore next */
const _foldMap = (M) => {
    const foldMapM = foldMap(M);
    return (fa, f) => pipe(fa, foldMapM(f));
};
/* istanbul ignore next */
const _reduceRight = (fa, b, f) => pipe(fa, reduceRight(b, f));
/* istanbul ignore next */
const _traverse = (F) => {
    const traverseF = traverse(F);
    return (ta, f) => pipe(ta, traverseF(f));
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
export const bimap = (f, g) => (fa) => isLeft(fa) ? left(f(fa.left)) : isRight(fa) ? right(g(fa.right)) : both(f(fa.left), g(fa.right));
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
export const mapLeft = (f) => (fa) => isLeft(fa) ? left(f(fa.left)) : isBoth(fa) ? both(f(fa.left), fa.right) : fa;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => isLeft(fa) ? fa : isRight(fa) ? right(f(fa.right)) : both(fa.left, f(fa.right));
/**
 * @category folding
 * @since 2.0.0
 */
export const reduce = (b, f) => (fa) => isLeft(fa) ? b : f(b, fa.right);
/**
 * @category folding
 * @since 2.0.0
 */
export const foldMap = (M) => (f) => (fa) => isLeft(fa) ? M.empty : f(fa.right);
/**
 * @category folding
 * @since 2.0.0
 */
export const reduceRight = (b, f) => (fa) => isLeft(fa) ? b : f(fa.right, b);
/**
 * @category traversing
 * @since 2.6.3
 */
export const traverse = (F) => (f) => (ta) => isLeft(ta) ? F.of(ta) : isRight(ta) ? F.map(f(ta.right), right) : F.map(f(ta.right), (b) => both(ta.left, b));
/**
 * @category traversing
 * @since 2.6.3
 */
export const sequence = (F) => (ta) => {
    return isLeft(ta) ? F.of(ta) : isRight(ta) ? F.map(ta.right, right) : F.map(ta.right, (b) => both(ta.left, b));
};
/**
 * @category constructors
 * @since 2.0.0
 */
export const of = right;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'These';
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
 * @since 2.7.0
 */
export const Bifunctor = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.11.0
 */
export const FromThese = {
    URI,
    fromThese: identity
};
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
 * @since 2.10.0
 */
export const FromEither = {
    URI,
    fromEither: identity
};
/**
 * @category lifting
 * @since 2.13.0
 */
export const fromPredicate = /*#__PURE__*/ fromPredicate_(FromEither);
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export const elem = (E) => (a) => (ma) => isLeft(ma) ? false : E.equals(a, ma.right);
/**
 * @since 2.11.0
 */
export const exists = (predicate) => (ma) => isLeft(ma) ? false : predicate(ma.right);
/**
 * @example
 * import { toTuple2, left, right, both } from 'fp-ts/These'
 *
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(left('b')), ['b', 1])
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(right(2)), ['a', 2])
 * assert.deepStrictEqual(toTuple2(() => 'a', () => 1)(both('b', 2)), ['b', 2])
 *
 * @category conversions
 * @since 2.10.0
 */
export const toTuple2 = (e, a) => (fa) => isLeft(fa) ? [fa.left, a()] : isRight(fa) ? [e(), fa.right] : [fa.left, fa.right];
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`toTuple2`](#totuple2) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const toTuple = (e, a) => toTuple2(() => e, () => a);
/**
 * @since 2.11.0
 */
export const ApT = /*#__PURE__*/ of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex = (S) => (f) => (as) => {
    let e = _.none;
    const t = f(0, _.head(as));
    if (isLeft(t)) {
        return t;
    }
    if (isBoth(t)) {
        e = _.some(t.left);
    }
    const out = [t.right];
    for (let i = 1; i < as.length; i++) {
        const t = f(i, as[i]);
        if (isLeft(t)) {
            return t;
        }
        if (isBoth(t)) {
            e = _.isNone(e) ? _.some(t.left) : _.some(S.concat(e.value, t.left));
        }
        out.push(t.right);
    }
    return _.isNone(e) ? right(out) : both(e.value, out);
};
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(S))`.
 *
 * @category traversing
 * @since 2.11.0
 */
export const traverseReadonlyArrayWithIndex = (S) => (f) => {
    const g = traverseReadonlyNonEmptyArrayWithIndex(S)(f);
    return (as) => (_.isNonEmpty(as) ? g(as) : ApT);
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.these`
 * (where `T` is from `import T from 'fp-ts/These'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const these = {
    URI,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence
};
//# sourceMappingURL=These.js.map