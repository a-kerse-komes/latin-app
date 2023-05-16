import * as A from './Array.js';
import { pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
import * as RR from './ReadonlyRecord.js';
import * as Se from './Semigroup.js';
import * as S from './string.js';
import { wiltDefault, witherDefault } from './Witherable.js';
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * Calculate the number of key/value pairs in a `Record`.
 *
 * @example
 * import { size } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(size({ a: true, b: 2, c: "three" }), 3);
 *
 * @since 2.0.0
 */
export const size = RR.size;
/**
 * Test whether a `Record` is empty.
 *
 * @example
 * import { isEmpty } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(isEmpty({}), true);
 * assert.deepStrictEqual(isEmpty({ a: 3 }), false);
 *
 * @since 2.0.0
 */
export const isEmpty = RR.isEmpty;
const keys_ = (O) => (r) => Object.keys(r).sort(O.compare);
/**
 * The keys of a `Record`, sorted alphabetically.
 *
 * @example
 * import { keys } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(keys({ c: 1, a: 2, b: 3 }), ["a", "b", "c"]);
 *
 * @since 2.0.0
 */
export const keys = /*#__PURE__*/ keys_(S.Ord);
export function collect(O) {
    if (typeof O === 'function') {
        return collect(S.Ord)(O);
    }
    const keysO = keys_(O);
    return (f) => (r) => {
        const out = [];
        for (const key of keysO(r)) {
            out.push(f(key, r[key]));
        }
        return out;
    };
}
/**
 * Get a sorted `Array` of the key/value pairs contained in a `Record`.
 * Sorted alphabetically by key.
 *
 * @example
 * import { toArray } from 'fp-ts/Record'
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(toArray(x), [
 *   ["a", "foo"],
 *   ["b", false],
 *   ["c", 3],
 * ]);
 *
 * @category conversions
 * @since 2.0.0
 */
export const toArray = /*#__PURE__*/ collect(S.Ord)((k, a) => [
    k,
    a
]);
export function toUnfoldable(U) {
    return (r) => {
        const sas = toArray(r);
        const len = sas.length;
        return U.unfold(0, (b) => (b < len ? _.some([sas[b], b + 1]) : _.none));
    };
}
/**
 * Insert or replace a key/value pair in a `Record`.
 *
 * @example
 * import { upsertAt } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(upsertAt("a", 5)({ a: 1, b: 2 }), { a: 5, b: 2 });
 * assert.deepStrictEqual(upsertAt("c", 5)({ a: 1, b: 2 }), { a: 1, b: 2, c: 5 });
 *
 * @since 2.10.0
 */
export const upsertAt = RR.upsertAt;
/**
 * Test whether or not a key exists in a `Record`.
 *
 * Note. This function is not pipeable because is a `Refinement`.
 *
 * @example
 * import { has } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(has("a", { a: 1, b: 2 }), true);
 * assert.deepStrictEqual(has("c", { a: 1, b: 2 }), false);
 *
 * @since 2.10.0
 */
export const has = RR.has;
export function deleteAt(k) {
    return (r) => {
        if (!_.has.call(r, k)) {
            return r;
        }
        const out = Object.assign({}, r);
        delete out[k];
        return out;
    };
}
/**
 * Replace a key/value pair in a `Record`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { updateAt } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(updateAt("a", 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(updateAt("c", 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.0.0
 */
export const updateAt = (k, a) => modifyAt(k, () => a);
/**
 * Applies a mapping function to one spcific key/value pair in a `Record`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { modifyAt } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(modifyAt("a", (x: number) => x * 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(modifyAt("c", (x: number) => x * 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.0.0
 */
export const modifyAt = (k, f) => (r) => {
    if (!has(k, r)) {
        return _.none;
    }
    const out = Object.assign({}, r);
    out[k] = f(r[k]);
    return _.some(out);
};
export function pop(k) {
    const deleteAtk = deleteAt(k);
    return (r) => {
        const oa = lookup(k, r);
        return _.isNone(oa) ? _.none : _.some([oa.value, deleteAtk(r)]);
    };
}
// TODO: remove non-curried overloading in v3
/**
 * Test whether one `Record` contains all of the keys and values
 * contained in another `Record`.
 *
 * @example
 * import { isSubrecord } from 'fp-ts/Record'
 * import { string } from 'fp-ts'
 *
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar", c: "baz" })({ a: "foo", b: "bar", c: "baz" }),
 *   true
 * );
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar", c: "baz" })({ a: "foo", c: "baz" }),
 *   true
 * );
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar", c: "baz" })({ a: "foo", b: "not-bar", c: "baz" }),
 *   false
 * );
 * assert.deepStrictEqual(
 *   isSubrecord(string.Eq)({ a: "foo", b: "bar" })({ a: "foo", b: "bar", c: "baz" }),
 *   false
 * );
 *
 * @since 2.0.0
 */
export const isSubrecord = RR.isSubrecord;
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Record`.
 *
 * @returns If the specified key exists it returns an `Option` containing the value,
 * otherwise it returns `None`
 *
 * @example
 * import { lookup } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(lookup("b")({ a: "foo", b: "bar" }), option.some("bar"));
 * assert.deepStrictEqual(lookup("c")({ a: "foo", b: "bar" }), option.none);
 *
 * @since 2.0.0
 */
export const lookup = RR.lookup;
/**
 * Map a `Record` passing the key/value pairs to the iterating function.
 *
 * @example
 * import { mapWithIndex } from "fp-ts/Record";
 *
 * const f = (k: string, n: number) => `${k.toUpperCase()}-${n}`;
 * assert.deepStrictEqual(mapWithIndex(f)({ a: 3, b: 5 }), { a: "A-3", b: "B-5" });
 *
 * @since 2.0.0
 */
export const mapWithIndex = RR.mapWithIndex;
/**
 * Map a `Record` passing the values to the iterating function.
 *
 * @example
 * import { map } from "fp-ts/Record";
 *
 * const f = (n: number) => `-${n}-`;
 * assert.deepStrictEqual(map(f)({ a: 3, b: 5 }), { a: "-3-", b: "-5-" });
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = RR.map;
export function reduceWithIndex(...args) {
    return args.length === 1 ? RR.reduceWithIndex(args[0]) : RR.reduceWithIndex(S.Ord)(...args);
}
export function foldMapWithIndex(O) {
    return 'compare' in O ? RR.foldMapWithIndex(O) : RR.foldMapWithIndex(S.Ord)(O);
}
export function reduceRightWithIndex(...args) {
    return args.length === 1 ? RR.reduceRightWithIndex(args[0]) : RR.reduceRightWithIndex(S.Ord)(...args);
}
/**
 * Create a `Record` with one key/value pair.
 *
 * @example
 * import { singleton } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(singleton("a", 1), { a: 1 });
 *
 * @since 2.0.0
 */
export const singleton = RR.singleton;
export function traverseWithIndex(F) {
    return RR.traverseWithIndex(F);
}
export function traverse(F) {
    return RR.traverse(F);
}
export function sequence(F) {
    return RR.sequence(F);
}
/**
 * @category filtering
 * @since 2.6.5
 */
export const wither = (F) => {
    const traverseF = traverse(F);
    return (f) => (fa) => F.map(pipe(fa, traverseF(f)), compact);
};
/**
 * @category filtering
 * @since 2.6.5
 */
export const wilt = (F) => {
    const traverseF = traverse(F);
    return (f) => (fa) => F.map(pipe(fa, traverseF(f)), separate);
};
/**
 * Maps a `Record` with a function returning an `Either` and
 * partitions the resulting `Record` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMapWithIndex } from "fp-ts/Record"
 * import { either } from "fp-ts"
 *
 * const f = (key: string, a: number) =>
 *   a >= 0 ? either.right(`${key} is >= 0 (${a})`) : either.left(`${key} is < 0 (${a})`);
 * assert.deepStrictEqual(partitionMapWithIndex(f)({ a: -1, b: 2, c: 123 }), {
 *   left: {
 *     a: "a is < 0 (-1)",
 *   },
 *   right: {
 *     b: "b is >= 0 (2)",
 *     c: "c is >= 0 (123)",
 *   },
 * });
 *
 * @since 2.0.0
 */
export const partitionMapWithIndex = RR.partitionMapWithIndex;
export function partitionWithIndex(predicateWithIndex) {
    return RR.partitionWithIndex(predicateWithIndex);
}
/**
 * Maps a `Record` with an iterating function that takes key and value and
 * returns an `Option`, keeping only the `Some` values and discarding `None`s.
 *
 * @example
 * import { filterMapWithIndex } from "fp-ts/Record"
 * import { option } from "fp-ts"
 *
 * const f = (key: string, a: number) => (a >= 0 ? option.some(`${key}${a}`) : option.none);
 * assert.deepStrictEqual(filterMapWithIndex(f)({ a: -1, b: 2, c: 3 }), {
 *   b: "b2",
 *   c: "c3",
 * });
 *
 * @since 2.0.0
 */
export const filterMapWithIndex = RR.filterMapWithIndex;
export function filterWithIndex(predicateWithIndex) {
    return RR.filterWithIndex(predicateWithIndex);
}
export function fromFoldable(M, F) {
    return RR.fromFoldable(M, F);
}
/**
 * Alias of [`toArray`](#toArray).
 *
 * @example
 * import { toEntries } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(toEntries({ b: 2, a: 1 }), [['a', 1], ['b', 2]])
 *
 * @since 2.12.0
 * @category conversions
 */
export const toEntries = toArray;
/**
 * Converts an `Array` of `[key, value]` tuples into a `Record`.
 *
 * @example
 * import { fromEntries } from 'fp-ts/Record'
 *
 * assert.deepStrictEqual(fromEntries([['a', 1], ['b', 2], ['a', 3]]), { b: 2, a: 3 })
 *
 * @since 2.12.0
 * @category conversions
 */
export const fromEntries = (fa) => fromFoldable(Se.last(), A.Foldable)(fa);
export function fromFoldableMap(M, F) {
    return RR.fromFoldableMap(M, F);
}
/**
 * Test if every value in a `Record` satisfies the predicate.
 *
 * @example
 * import { every } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(every((n: number) => n >= 0)({ a: 1, b: 2 }), true);
 * assert.deepStrictEqual(every((n: number) => n >= 0)({ a: 1, b: -1 }), false);
 *
 * @since 2.0.0
 */
export const every = RR.every;
/**
 * Test if at least one value in a `Record` satisfies the predicate.
 *
 * @example
 * import { some } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: 1, b: -2 }), true);
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: -1, b: -2 }), false);
 *
 * @since 2.0.0
 */
export const some = RR.some;
// TODO: remove non-curried overloading in v3
/**
 * Given an `Eq` checks if a `Record` contains an entry with
 * value equal to a provided value.
 *
 * @example
 * import { elem } from "fp-ts/Record"
 * import { number } from "fp-ts"
 *
 * assert.deepStrictEqual(elem(number.Eq)(123, { foo: 123, bar: 234 }), true);
 * assert.deepStrictEqual(elem(number.Eq)(-7, { foo: 123, bar: 234 }), false);
 *
 * @since 2.0.0
 */
export const elem = RR.elem;
/**
 * Union of two `Record`s.
 * Takes two `Record`s and produces a `Record` combining all the
 * entries of the two inputs.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements with the same key.
 *
 * @example
 * import { union } from "fp-ts/Record";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(union(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4, b: 2, c: 3 });
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(union(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1, b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export const union = (M) => {
    const unionM = RR.union(M);
    return (second) => (first) => {
        if (isEmpty(first)) {
            return { ...second };
        }
        if (isEmpty(second)) {
            return { ...first };
        }
        return unionM(second)(first);
    };
};
/**
 * Intersection of two `Record`s.
 * Takes two `Record`s and produces a `Record` combining only the
 * entries of the two inputswith the same key.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements.
 *
 * @example
 * import { intersection } from "fp-ts/Record";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(intersection(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4});
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(intersection(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1});
 *
 * @since 2.11.0
 */
export const intersection = (M) => (second) => (first) => {
    if (isEmpty(first) || isEmpty(second)) {
        return {};
    }
    return RR.intersection(M)(second)(first);
};
/**
 * Difference between two `Record`s.
 * Takes two `Record`s and produces a `Record` composed by the
 * entries of the two inputs, removing the entries with the same
 * key in both inputs.
 *
 * @example
 * import { difference } from "fp-ts/Record";
 *
 * assert.deepStrictEqual(difference({ a: 1 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3, c: 3 })({ a: 1, b: 2 }), { b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export const difference = (second) => (first) => {
    if (isEmpty(first)) {
        return { ...second };
    }
    if (isEmpty(second)) {
        return { ...first };
    }
    return RR.difference(second)(first);
};
const _map = RR._map;
const _mapWithIndex = RR._mapWithIndex;
const _reduce = RR._reduce;
const _foldMap = RR._foldMap;
const _reduceRight = RR._reduceRight;
const _filter = RR._filter;
const _filterMap = RR._filterMap;
const _partition = RR._partition;
const _partitionMap = RR._partitionMap;
const _reduceWithIndex = RR._reduceWithIndex;
const _foldMapWithIndex = RR._foldMapWithIndex;
const _reduceRightWithIndex = RR._reduceRightWithIndex;
const _partitionMapWithIndex = RR._partitionMapWithIndex;
const _partitionWithIndex = RR._partitionWithIndex;
const _filterMapWithIndex = RR._filterMapWithIndex;
const _filterWithIndex = RR._filterWithIndex;
const _traverse = RR._traverse;
const _sequence = RR._sequence;
const _traverseWithIndex = (O) => (F) => {
    const keysO = keys_(O);
    return (ta, f) => {
        const ks = keysO(ta);
        if (ks.length === 0) {
            return F.of({});
        }
        let fr = F.of({});
        for (const key of ks) {
            fr = F.ap(F.map(fr, (r) => (b) => {
                r[key] = b;
                return r;
            }), f(key, ta[key]));
        }
        return fr;
    };
};
/**
 * Given a `Predicate`, it produces a new `Record` keeping only the entries with a
 * value that satisfies the provided predicate.
 *
 * @example
 * import { filter } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(filter((s: string) => s.length < 4)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo",
 *   b: "bar",
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const filter = RR.filter;
/**
 * Maps a `Record` with an iterating function that returns an `Option`
 * and it keeps only the `Some` values discarding the `None`s.
 *
 * @example
 * import { filterMap } from "fp-ts/Record"
 * import { option } from "fp-ts"
 *
 * const f = (s: string) => s.length < 4 ? option.some(`${s} is short`): option.none
 * assert.deepStrictEqual(filterMap(f)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo is short",
 *   b: "bar is short",
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const filterMap = RR.filterMap;
/**
 * Partition a `Record` into two parts according to a `Predicate`.
 *
 * @example
 * import { partition } from "fp-ts/Record"
 *
 * assert.deepStrictEqual(partition((s: string) => s.length < 4)({ a: "foo", b: "bar", c: "verylong" }), {
 *   left:{
 *     c: "verylong"
 *   },
 *   right: {
 *     a: "foo",
 *     b: "bar",
 *   },
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const partition = RR.partition;
/**
 * Maps a `Record` with a function returning an `Either` and
 * partitions the resulting `Record` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMap } from "fp-ts/Record"
 * import { either } from "fp-ts"
 *
 * const f = (s: string) => (s.length < 4 ? either.right(`${s} is short`) : either.left(`${s} is not short`));
 * assert.deepStrictEqual(partitionMap(f)({ a: "foo", b: "bar", c: "verylong" }), {
 *   left: {
 *     c: "verylong is not short",
 *   },
 *   right: {
 *     a: "foo is short",
 *     b: "bar is short",
 *   },
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const partitionMap = RR.partitionMap;
export function reduce(...args) {
    return args.length === 1 ? RR.reduce(args[0]) : RR.reduce(S.Ord)(...args);
}
export function foldMap(O) {
    return 'compare' in O ? RR.foldMap(O) : RR.foldMap(S.Ord)(O);
}
export function reduceRight(...args) {
    return args.length === 1 ? RR.reduceRight(args[0]) : RR.reduceRight(S.Ord)(...args);
}
/**
 * Compact a `Record` of `Option`s discarding the `None` values and
 * keeping the `Some` values.
 *
 * @example
 * import { compact } from 'fp-ts/Record'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(compact({ a: option.some("foo"), b: option.none, c: option.some("bar") }), {
 *   a: "foo",
 *   c: "bar",
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const compact = RR.compact;
/**
 * Separate a `Record` of `Either`s into `Left`s and `Right`s.
 *
 * @example
 * import { separate } from 'fp-ts/Record'
 * import { either } from 'fp-ts'
 *
 * assert.deepStrictEqual(
 *   separate({ a: either.right("foo"), b: either.left("bar"), c: either.right("baz") }),
 *   {
 *     right: {
 *       a: "foo",
 *       c: "baz",
 *     },
 *     left: {
 *       b: "bar",
 *     },
 *   }
 * );
 *
 * @category filtering
 * @since 2.0.0
 */
export const separate = RR.separate;
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Record';
export function getShow(O) {
    return 'compare' in O ? RR.getShow(O) : RR.getShow(S.Ord)(O);
}
/**
 * Given an `Eq` for the base type, it produces an `Eq`
 * for a `Record` of that base type.
 *
 * @example
 * import { getEq } from "fp-ts/Record";
 * import { string } from "fp-ts";
 * import { Eq } from "fp-ts/Eq";
 *
 * const eq: Eq<Record<string, string>> = getEq(string.Eq);
 * assert.deepStrictEqual(eq.equals({ a: "foo" }, { b: "bar" }), false);
 * assert.deepStrictEqual(eq.equals({ a: "foo" }, { a: "foo" }), true);
 *
 * @category instances
 * @since 2.0.0
 */
export const getEq = RR.getEq;
/**
 * Returns a `Monoid` instance for `Record`s, given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `Record`s comining the
 * overlapping entries with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getMonoid } from 'fp-ts/Record'
 *
 * const M = getMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.0.0
 */
export const getMonoid = RR.getMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
export const Functor = {
    URI,
    map: _map
};
/**
 * Takes a value and a `Record` of functions and returns a
 * `Record` by applying each function to the input value.
 *
 * @example
 * import { flap } from "fp-ts/Record"
 *
 * const fab = { x: (n: number) => `${n} times 2`, y: (n: number) => `${n * 2}` };
 * assert.deepStrictEqual(flap(3)(fab), {
 *   x: "3 times 2",
 *   y: "6",
 * });
 *
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);
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
 * Produces a `Foldable` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category folding
 * @since 2.11.0
 */
export const getFoldable = (O) => ({
    URI,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O)
});
/**
 * Produces a `FoldableWithIndex1` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category folding
 * @since 2.11.0
 */
export const getFoldableWithIndex = (O) => ({
    URI,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    reduceWithIndex: _reduceWithIndex(O),
    foldMapWithIndex: _foldMapWithIndex(O),
    reduceRightWithIndex: _reduceRightWithIndex(O)
});
/**
 * @category instances
 * @since 2.7.0
 */
export const Compactable = {
    URI,
    compact,
    separate
};
/**
 * @category instances
 * @since 2.7.0
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
 * @since 2.7.0
 */
export const FilterableWithIndex = {
    URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex
};
/**
 * Produces a `Traversable` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category traversing
 * @since 2.11.0
 */
export const getTraversable = (O) => ({
    URI,
    map: _map,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    traverse: _traverse(O),
    sequence: _sequence(O)
});
/**
 * Produces a `TraversableWithIndex` instance for a `Record`, using the
 * provided `Ord` to sort the `Record`'s entries by key.
 *
 * @category traversing
 * @since 2.11.0
 */
export const getTraversableWithIndex = (O) => ({
    URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce(O),
    foldMap: _foldMap(O),
    reduceRight: _reduceRight(O),
    reduceWithIndex: _reduceWithIndex(O),
    foldMapWithIndex: _foldMapWithIndex(O),
    reduceRightWithIndex: _reduceRightWithIndex(O),
    traverse: _traverse(O),
    sequence: _sequence(O),
    traverseWithIndex: _traverseWithIndex(O)
});
/**
 * @category filtering
 * @since 2.11.0
 */
export const getWitherable = (O) => {
    const T = getTraversable(O);
    return {
        URI,
        map: _map,
        reduce: _reduce(O),
        foldMap: _foldMap(O),
        reduceRight: _reduceRight(O),
        traverse: T.traverse,
        sequence: T.sequence,
        compact,
        separate,
        filter: _filter,
        filterMap: _filterMap,
        partition: _partition,
        partitionMap: _partitionMap,
        wither: witherDefault(T, Compactable),
        wilt: wiltDefault(T, Compactable)
    };
};
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `Record` of the base type.
 * The resulting `Semigroup` concatenates two `Record`s by
 * `union`.
 *
 * @example
 * import { getUnionSemigroup } from "fp-ts/Record"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sRecord: Semigroup<Record<string, number>> = getUnionSemigroup(sNumber);
 * assert.deepStrictEqual(sRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { a: 1, b: -1, c: 4 });
 *
 * @category instances
 * @since 2.11.0
 */
export const getUnionSemigroup = (S) => {
    const unionS = union(S);
    return {
        concat: (first, second) => unionS(second)(first)
    };
};
/**
 * Same as `getMonoid`.
 * Returns a `Monoid` instance for `Record`s given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `Record`s combining the
 * entries that have the same key with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getUnionMonoid } from 'fp-ts/Record'
 *
 * const M = getUnionMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.11.0
 */
export const getUnionMonoid = (S) => ({
    concat: getUnionSemigroup(S).concat,
    empty: {}
});
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `Record` of the base type.
 * The resulting `Semigroup` concatenates two `Record`s by
 * `intersection`.
 *
 * @example
 * import { getIntersectionSemigroup } from "fp-ts/Record"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sRecord: Semigroup<Record<string, number>> = getIntersectionSemigroup(sNumber);
 * assert.deepStrictEqual(sRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { b: -1 });
 *
 * @category instances
 * @since 2.11.0
 */
export const getIntersectionSemigroup = (S) => {
    const intersectionS = intersection(S);
    return {
        concat: (first, second) => intersectionS(second)(first)
    };
};
/**
 * Produces a `Magma` with a `concat` function that combines
 * two `Record`s by making the `difference`.
 *
 * @example
 * import { getDifferenceMagma, difference } from "fp-ts/Record"
 * import { Magma } from "fp-ts/Magma"
 *
 * const r1 = { a: 3, c: 3 };
 * const r2 = { a: 1, b: 2 };
 * const m: Magma<Record<string, number>> = getDifferenceMagma<number>();
 * assert.deepStrictEqual(m.concat(r1, r2), difference(r2)(r1));
 * assert.deepStrictEqual(m.concat(r1, r2), { c: 3, b: 2 });
 *
 * @category instances
 * @since 2.11.0
 */
export const getDifferenceMagma = () => ({
    concat: (first, second) => difference(second)(first)
});
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `getFoldable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const Foldable = {
    URI,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord)
};
/**
 * Use `getFoldableWithIndex` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const FoldableWithIndex = {
    URI,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    reduceWithIndex: /*#__PURE__*/ _reduceWithIndex(S.Ord),
    foldMapWithIndex: /*#__PURE__*/ _foldMapWithIndex(S.Ord),
    reduceRightWithIndex: /*#__PURE__*/ _reduceRightWithIndex(S.Ord)
};
/**
 * Use `getTraversable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const Traversable = {
    URI,
    map: _map,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence
};
/**
 * Use the `getTraversableWithIndex` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const TraversableWithIndex = {
    URI,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    reduceWithIndex: /*#__PURE__*/ _reduceWithIndex(S.Ord),
    foldMapWithIndex: /*#__PURE__*/ _foldMapWithIndex(S.Ord),
    reduceRightWithIndex: /*#__PURE__*/ _reduceRightWithIndex(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence,
    traverseWithIndex: /*#__PURE__*/ _traverseWithIndex(S.Ord)
};
const _wither = /*#__PURE__*/ witherDefault(Traversable, Compactable);
const _wilt = /*#__PURE__*/ wiltDefault(Traversable, Compactable);
/**
 * Use `getWitherable` instead.
 *
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
export const Witherable = {
    URI,
    map: _map,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: _wither,
    wilt: _wilt
};
/**
 * Use a new `{}` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const empty = {};
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const insertAt = upsertAt;
/**
 * Use [`has`](#has) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const hasOwnProperty = RR.hasOwnProperty;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `R.Functor` instead of `R.record`
 * (where `R` is from `import R from 'fp-ts/Record'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const record = {
    URI,
    map: _map,
    reduce: /*#__PURE__*/ _reduce(S.Ord),
    foldMap: /*#__PURE__*/ _foldMap(S.Ord),
    reduceRight: /*#__PURE__*/ _reduceRight(S.Ord),
    traverse: /*#__PURE__*/ _traverse(S.Ord),
    sequence,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    mapWithIndex: _mapWithIndex,
    reduceWithIndex: /*#__PURE__*/ _reduceWithIndex(S.Ord),
    foldMapWithIndex: /*#__PURE__*/ _foldMapWithIndex(S.Ord),
    reduceRightWithIndex: /*#__PURE__*/ _reduceRightWithIndex(S.Ord),
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    traverseWithIndex: /*#__PURE__*/ _traverseWithIndex(S.Ord),
    wither: _wither,
    wilt: _wilt
};
//# sourceMappingURL=Record.js.map