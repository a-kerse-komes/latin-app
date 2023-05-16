import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain.js';
import { fromEquals } from './Eq.js';
import { dual, flow, identity, pipe, SK } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import { getMonoid } from './Ord.js';
import * as Se from './Semigroup.js';
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
export const empty = _.emptyReadonlyArray;
/**
 * @internal
 */
export const isNonEmpty = _.isNonEmpty;
/**
 * @internal
 */
export const isOutOfBound = (i, as) => i < 0 || i >= as.length;
/**
 * @internal
 */
export const prependW = (head) => (tail) => [head, ...tail];
/**
 * @internal
 */
export const prepend = prependW;
/**
 * @internal
 */
export const appendW = (end) => (init) => [...init, end];
/**
 * @internal
 */
export const append = appendW;
/**
 * @internal
 */
export const unsafeInsertAt = (i, a, as) => {
    if (isNonEmpty(as)) {
        const xs = _.fromReadonlyNonEmptyArray(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
/**
 * @internal
 */
export const unsafeUpdateAt = (i, a, as) => {
    if (as[i] === a) {
        return as;
    }
    else {
        const xs = _.fromReadonlyNonEmptyArray(as);
        xs[i] = a;
        return xs;
    }
};
/**
 * Remove duplicates from a `ReadonlyNonEmptyArray`, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.11.0
 */
export const uniq = (E) => (as) => {
    if (as.length === 1) {
        return as;
    }
    const out = [head(as)];
    const rest = tail(as);
    for (const a of rest) {
        if (out.every((o) => !E.equals(o, a))) {
            out.push(a);
        }
    }
    return out;
};
/**
 * Sort the elements of a `ReadonlyNonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 *
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = RNEA.sortBy([byName, byAge])
 *
 * const persons: RNEA.ReadonlyNonEmptyArray<Person> = [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 },
 *   { name: 'b', age: 2 }
 * ]
 *
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.11.0
 */
export const sortBy = (ords) => {
    if (isNonEmpty(ords)) {
        const M = getMonoid();
        return sort(ords.reduce(M.concat, M.empty));
    }
    return identity;
};
/**
 * @since 2.11.0
 */
export const union = (E) => {
    const uniqE = uniq(E);
    return (second) => (first) => uniqE(pipe(first, concat(second)));
};
/**
 * Rotate a `ReadonlyNonEmptyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @since 2.11.0
 */
export const rotate = (n) => (as) => {
    const len = as.length;
    const m = Math.round(n) % len;
    if (isOutOfBound(Math.abs(m), as) || m === 0) {
        return as;
    }
    if (m < 0) {
        const [f, s] = splitAt(-m)(as);
        return pipe(s, concat(f));
    }
    else {
        return rotate(m - len)(as);
    }
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Return a `ReadonlyNonEmptyArray` from a `ReadonlyArray` returning `none` if the input is empty.
 *
 * @category conversions
 * @since 2.5.0
 */
export const fromReadonlyArray = (as) => isNonEmpty(as) ? _.some(as) : _.none;
/**
 * Return a `ReadonlyNonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.11.0
 */
export const makeBy = (f) => (n) => {
    const j = Math.max(0, Math.floor(n));
    const out = [f(0)];
    for (let i = 1; i < j; i++) {
        out.push(f(i));
    }
    return out;
};
/**
 * Create a `ReadonlyNonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a natural number.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.11.0
 */
export const replicate = (a) => makeBy(() => a);
/**
 * Create a `ReadonlyNonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.11.0
 */
export const range = (start, end) => start <= end ? makeBy((i) => start + i)(end - start + 1) : [start];
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
 *
 * @since 2.9.0
 */
export const unprepend = (as) => [head(as), tail(as)];
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @since 2.9.0
 */
export const unappend = (as) => [init(as), last(as)];
/**
 * @category conversions
 * @since 2.5.0
 */
export const fromArray = (as) => fromReadonlyArray(as.slice());
export function concatW(second) {
    return (first) => first.concat(second);
}
export function concat(x, y) {
    return y ? x.concat(y) : (y) => y.concat(x);
}
/**
 * @since 2.5.0
 */
export const reverse = (as) => as.length === 1 ? as : [last(as), ...as.slice(0, -1).reverse()];
export function group(E) {
    return (as) => {
        const len = as.length;
        if (len === 0) {
            return empty;
        }
        const out = [];
        let head = as[0];
        let nea = [head];
        for (let i = 1; i < len; i++) {
            const a = as[i];
            if (E.equals(a, head)) {
                nea.push(a);
            }
            else {
                out.push(nea);
                head = a;
                nea = [head];
            }
        }
        out.push(nea);
        return out;
    };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @since 2.5.0
 */
export const groupBy = (f) => (as) => {
    const out = {};
    for (const a of as) {
        const k = f(a);
        if (_.has.call(out, k)) {
            out[k].push(a);
        }
        else {
            out[k] = [a];
        }
    }
    return out;
};
/**
 * @since 2.5.0
 */
export const sort = (O) => (as) => as.length === 1 ? as : as.slice().sort(O.compare);
/**
 * @since 2.5.0
 */
export const updateAt = (i, a) => modifyAt(i, () => a);
/**
 * @since 2.5.0
 */
export const modifyAt = (i, f) => (as) => isOutOfBound(i, as) ? _.none : _.some(unsafeUpdateAt(i, f(as[i]), as));
/**
 * @since 2.5.1
 */
export const zipWith = (as, bs, f) => {
    const cs = [f(as[0], bs[0])];
    const len = Math.min(as.length, bs.length);
    for (let i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
export function zip(as, bs) {
    if (bs === undefined) {
        return (bs) => zip(bs, as);
    }
    return zipWith(as, bs, (a, b) => [a, b]);
}
/**
 * @since 2.5.1
 */
export const unzip = (abs) => {
    const fa = [abs[0][0]];
    const fb = [abs[0][1]];
    for (let i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
export const prependAll = (middle) => (as) => {
    const out = [middle, as[0]];
    for (let i = 1; i < as.length; i++) {
        out.push(middle, as[i]);
    }
    return out;
};
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export const intersperse = (middle) => (as) => {
    const rest = tail(as);
    return isNonEmpty(rest) ? pipe(rest, prependAll(middle), prepend(head(as))) : as;
};
/**
 * @category sequencing
 * @since 2.10.0
 */
export const chainWithIndex = (f) => (as) => {
    const out = _.fromReadonlyNonEmptyArray(f(0, head(as)));
    for (let i = 1; i < as.length; i++) {
        out.push(...f(i, as[i]));
    }
    return out;
};
/**
 * A useful recursion pattern for processing a `ReadonlyNonEmptyArray` to produce a new `ReadonlyNonEmptyArray`, often used for "chopping" up the input
 * `ReadonlyNonEmptyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyNonEmptyArray` and produce a
 * value and the tail of the `ReadonlyNonEmptyArray`.
 *
 * @since 2.10.0
 */
export const chop = (f) => (as) => {
    const [b, rest] = f(as);
    const out = [b];
    let next = rest;
    while (isNonEmpty(next)) {
        const [b, rest] = f(next);
        out.push(b);
        next = rest;
    }
    return out;
};
/**
 * Splits a `ReadonlyNonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @since 2.10.0
 */
export const splitAt = (n) => (as) => {
    const m = Math.max(1, n);
    return m >= as.length ? [as, empty] : [pipe(as.slice(1, m), prepend(head(as))), as.slice(m)];
};
/**
 * Splits a `ReadonlyNonEmptyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyNonEmptyArray`.
 *
 * @since 2.10.0
 */
export const chunksOf = (n) => chop(splitAt(n));
const _map = (fa, f) => pipe(fa, map(f));
/* istanbul ignore next */
const _mapWithIndex = (fa, f) => pipe(fa, mapWithIndex(f));
const _ap = (fab, fa) => pipe(fab, ap(fa));
/* istanbul ignore next */
const _extend = (wa, f) => pipe(wa, extend(f));
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
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
/* istanbul ignore next */
const _reduceWithIndex = (fa, b, f) => pipe(fa, reduceWithIndex(b, f));
/* istanbul ignore next */
const _foldMapWithIndex = (M) => {
    const foldMapWithIndexM = foldMapWithIndex(M);
    return (fa, f) => pipe(fa, foldMapWithIndexM(f));
};
/* istanbul ignore next */
const _reduceRightWithIndex = (fa, b, f) => pipe(fa, reduceRightWithIndex(b, f));
/* istanbul ignore next */
const _traverseWithIndex = (F) => {
    const traverseWithIndexF = traverseWithIndex(F);
    return (ta, f) => pipe(ta, traverseWithIndexF(f));
};
/**
 * @category constructors
 * @since 2.5.0
 */
export const of = _.singleton;
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3] as RNEA.ReadonlyNonEmptyArray<number>,
 *     RNEA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW = (that) => (as) => pipe(as, concatW(that()));
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `ReadonlyNonEmptyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RNEA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.6.2
 */
export const alt = altW;
/**
 * @since 2.5.0
 */
export const ap = (as) => flatMap((f) => pipe(as, map(f)));
/**
 * @example
 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RNEA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => pipe(ma, chainWithIndex((i, a) => f(a, i))));
/**
 * @since 2.5.0
 */
export const extend = (f) => (as) => {
    let next = tail(as);
    const out = [f(as)];
    while (isNonEmpty(next)) {
        out.push(f(next));
        next = tail(next);
    }
    return out;
};
/**
 * @since 2.5.0
 */
export const duplicate = 
/*#__PURE__*/ extend(identity);
/**
 * @category sequencing
 * @since 2.5.0
 */
export const flatten = 
/*#__PURE__*/ flatMap(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.5.0
 */
export const map = (f) => mapWithIndex((_, a) => f(a));
/**
 * @category mapping
 * @since 2.5.0
 */
export const mapWithIndex = (f) => (as) => {
    const out = [f(0, head(as))];
    for (let i = 1; i < as.length; i++) {
        out.push(f(i, as[i]));
    }
    return out;
};
/**
 * @category folding
 * @since 2.5.0
 */
export const reduce = (b, f) => reduceWithIndex(b, (_, b, a) => f(b, a));
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category folding
 * @since 2.5.0
 */
export const foldMap = (S) => (f) => (as) => as.slice(1).reduce((s, a) => S.concat(s, f(a)), f(as[0]));
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceRight = (b, f) => reduceRightWithIndex(b, (_, b, a) => f(b, a));
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceWithIndex = (b, f) => (as) => as.reduce((b, a, i) => f(i, b, a), b);
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category folding
 * @since 2.5.0
 */
export const foldMapWithIndex = (S) => (f) => (as) => as.slice(1).reduce((s, a, i) => S.concat(s, f(i + 1, a)), f(0, as[0]));
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceRightWithIndex = (b, f) => (as) => as.reduceRight((b, a, i) => f(i, a, b), b);
/**
 * @category traversing
 * @since 2.6.3
 */
export const traverse = (F) => {
    const traverseWithIndexF = traverseWithIndex(F);
    return (f) => traverseWithIndexF((_, a) => f(a));
};
/**
 * @category traversing
 * @since 2.6.3
 */
export const sequence = (F) => traverseWithIndex(F)(SK);
/**
 * @category sequencing
 * @since 2.6.3
 */
export const traverseWithIndex = (F) => (f) => (as) => {
    let out = F.map(f(0, head(as)), of);
    for (let i = 1; i < as.length; i++) {
        out = F.ap(F.map(out, (bs) => (b) => pipe(bs, append(b))), f(i, as[i]));
    }
    return out;
};
/**
 * @category Comonad
 * @since 2.6.3
 */
export const extract = _.head;
/**
 * @category type lambdas
 * @since 2.5.0
 */
export const URI = 'ReadonlyNonEmptyArray';
/**
 * @category instances
 * @since 2.5.0
 */
export const getShow = (S) => ({
    show: (as) => `[${as.map(S.show).join(', ')}]`
});
/**
 * Builds a `Semigroup` instance for `ReadonlyNonEmptyArray`
 *
 * @category instances
 * @since 2.5.0
 */
export const getSemigroup = () => ({
    concat
});
/**
 * @example
 * import { getEq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.5.0
 */
export const getEq = (E) => fromEquals((xs, ys) => xs.length === ys.length && xs.every((x, i) => E.equals(x, ys[i])));
/**
 * @since 2.11.0
 */
export const getUnionSemigroup = (E) => {
    const unionE = union(E);
    return {
        concat: (first, second) => unionE(second)(first)
    };
};
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
export const FunctorWithIndex = {
    URI,
    map: _map,
    mapWithIndex: _mapWithIndex
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
 * @since 2.5.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.5.0
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
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.chainFirst(() => ['a', 'b'])
 *   ),
 *   [1, 1, 2, 2, 3, 3]
 * )
 *
 * @category sequencing
 * @since 2.5.0
 */
export const chainFirst = /*#__PURE__*/ chainFirst_(Chain);
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
export const FoldableWithIndex = {
    URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex
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
export const TraversableWithIndex = {
    URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex
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
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
export const head = extract;
/**
 * @since 2.5.0
 */
export const tail = _.tail;
/**
 * @since 2.5.0
 */
export const last = (as) => as[as.length - 1];
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.5.0
 */
export const init = (as) => as.slice(0, -1);
/**
 * @since 2.5.0
 */
export const min = (O) => {
    const S = Se.min(O);
    return (as) => as.reduce(S.concat);
};
/**
 * @since 2.5.0
 */
export const max = (O) => {
    const S = Se.max(O);
    return (as) => as.reduce(S.concat);
};
/**
 * @since 2.10.0
 */
export const concatAll = (S) => (as) => as.reduce(S.concat);
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchLeft = (f) => (as) => f(head(as), tail(as));
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchRight = (f) => (as) => f(init(as), last(as));
/**
 * Apply a function to the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export const modifyHead = (f) => (as) => [f(head(as)), ...tail(as)];
/**
 * Change the head, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export const updateHead = (a) => modifyHead(() => a);
/**
 * Apply a function to the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export const modifyLast = (f) => (as) => pipe(init(as), append(f(last(as))));
/**
 * Change the last element, creating a new `ReadonlyNonEmptyArray`.
 *
 * @since 2.11.0
 */
export const updateLast = (a) => modifyLast(() => a);
/**
 * Places an element in between members of a `ReadonlyNonEmptyArray`, then folds the results using the provided `Semigroup`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/ReadonlyNonEmptyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
export const intercalate = (S) => {
    const concatAllS = concatAll(S);
    return (middle) => flow(intersperse(middle), concatAllS);
};
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.5.0
 */
export const chain = flatMap;
export function groupSort(O) {
    const sortO = sort(O);
    const groupO = group(O);
    return (as) => (isNonEmpty(as) ? groupO(sortO(as)) : empty);
}
export function filter(predicate) {
    return filterWithIndex((_, a) => predicate(a));
}
/**
 * Use [`filterWithIndex`](./ReadonlyArray.ts.html#filterwithindex) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const filterWithIndex = (predicate) => (as) => fromReadonlyArray(as.filter((a, i) => predicate(i, a)));
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export const uncons = unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export const unsnoc = unappend;
export function cons(head, tail) {
    return tail === undefined ? prepend(head) : pipe(tail, prepend(head));
}
/**
 * Use [`append`](./ReadonlyArray.ts.html#append) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const snoc = (init, end) => pipe(init, concat([end]));
/**
 * Use [`insertAt`](./ReadonlyArray.ts.html#insertat) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const insertAt = (i, a) => (as) => i < 0 || i > as.length ? _.none : _.some(unsafeInsertAt(i, a, as));
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export const prependToAll = prependAll;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const fold = concatAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RNEA.Functor` instead of `RNEA.readonlyNonEmptyArray`
 * (where `RNEA` is from `import RNEA from 'fp-ts/ReadonlyNonEmptyArray'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const readonlyNonEmptyArray = {
    URI,
    of,
    map: _map,
    mapWithIndex: _mapWithIndex,
    ap: _ap,
    chain: flatMap,
    extend: _extend,
    extract: extract,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    alt: _alt
};
//# sourceMappingURL=ReadonlyNonEmptyArray.js.map