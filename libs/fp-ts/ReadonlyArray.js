import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain.js';
import { fromEquals } from './Eq.js';
import { fromEitherK as fromEitherK_ } from './FromEither.js';
import { dual, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as N from './number.js';
import { fromCompare } from './Ord.js';
import * as RNEA from './ReadonlyNonEmptyArray.js';
import { separated } from './Separated.js';
import { filterE as filterE_, wiltDefault, witherDefault } from './Witherable.js';
import { guard as guard_ } from './Zero.js';
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @example
 * import { isEmpty } from 'fp-ts/ReadonlyArray'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @category refinements
 * @since 2.5.0
 */
export const isEmpty = (as) => as.length === 0;
/**
 * Test whether a `ReadonlyArray` is non empty.
 *
 * @category refinements
 * @since 2.5.0
 */
export const isNonEmpty = RNEA.isNonEmpty;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Prepend an element to the front of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
export const prepend = RNEA.prepend;
/**
 * Less strict version of [`prepend`](#prepend).
 *
 * @since 2.11.0
 */
export const prependW = RNEA.prependW;
/**
 * Append an element to the end of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
export const append = RNEA.append;
/**
 * Less strict version of [`append`](#append).
 *
 * @since 2.11.0
 */
export const appendW = RNEA.appendW;
/**
 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/ReadonlyArray'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.5.0
 */
export const makeBy = (n, f) => (n <= 0 ? empty : RNEA.makeBy(f)(n));
/**
 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.5.0
 */
export const replicate = (n, a) => makeBy(n, () => a);
export function fromPredicate(predicate) {
    return (a) => (predicate(a) ? [a] : empty);
}
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.11.0
 */
export const fromOption = (ma) => (_.isNone(ma) ? empty : [ma.value]);
/**
 * Transforms an `Either` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.11.0
 */
export const fromEither = (e) => (_.isLeft(e) ? empty : [e.right]);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchW = (onEmpty, onNonEmpty) => (as) => isNonEmpty(as) ? onNonEmpty(as) : onEmpty();
/**
 * @category pattern matching
 * @since 2.11.0
 */
export const match = matchW;
/**
 * Less strict version of [`matchLeft`](#matchleft).
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchLeftW = (onEmpty, onNonEmpty) => (as) => isNonEmpty(as) ? onNonEmpty(RNEA.head(as), RNEA.tail(as)) : onEmpty();
/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @example
 * import { matchLeft } from 'fp-ts/ReadonlyArray'
 *
 * const len: <A>(as: ReadonlyArray<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchLeft = matchLeftW;
/**
 * Alias of [`matchLeft`](#matchleft).
 *
 * @category pattern matching
 * @since 2.5.0
 */
export const foldLeft = matchLeft;
/**
 * Less strict version of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchRightW = (onEmpty, onNonEmpty) => (as) => isNonEmpty(as) ? onNonEmpty(RNEA.init(as), RNEA.last(as)) : onEmpty();
/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchRight = matchRightW;
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.5.0
 */
export const foldRight = matchRight;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category sequencing
 * @since 2.7.0
 */
export const chainWithIndex = (f) => (as) => {
    if (isEmpty(as)) {
        return empty;
    }
    const out = [];
    for (let i = 0; i < as.length; i++) {
        out.push(...f(i, as[i]));
    }
    return out;
};
/**
 * Same as `reduce` but it carries over the intermediate steps.
 *
 * @example
 * import { scanLeft } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @since 2.5.0
 */
export const scanLeft = (b, f) => (as) => {
    const len = as.length;
    const out = new Array(len + 1);
    out[0] = b;
    for (let i = 0; i < len; i++) {
        out[i + 1] = f(out[i], as[i]);
    }
    return out;
};
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @since 2.5.0
 */
export const scanRight = (b, f) => (as) => {
    const len = as.length;
    const out = new Array(len + 1);
    out[len] = b;
    for (let i = len - 1; i >= 0; i--) {
        out[i] = f(as[i], out[i + 1]);
    }
    return out;
};
/**
 * Calculate the number of elements in a `ReadonlyArray`.
 *
 * @since 2.10.0
 */
export const size = (as) => as.length;
/**
 * Test whether an array contains a particular index
 *
 * @since 2.5.0
 */
export const isOutOfBound = RNEA.isOutOfBound;
export function lookup(i, as) {
    return as === undefined ? (as) => lookup(i, as) : isOutOfBound(i, as) ? _.none : _.some(as[i]);
}
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.5.0
 */
export const head = (as) => (isNonEmpty(as) ? _.some(RNEA.head(as)) : _.none);
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.5.0
 */
export const last = (as) => (isNonEmpty(as) ? _.some(RNEA.last(as)) : _.none);
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 2.5.0
 */
export const tail = (as) => isNonEmpty(as) ? _.some(RNEA.tail(as)) : _.none;
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 2.5.0
 */
export const init = (as) => isNonEmpty(as) ? _.some(RNEA.init(as)) : _.none;
/**
 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeLeft(2)), [1, 2])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeLeft(4)), input)
 * assert.strictEqual(pipe(input, RA.takeLeft(-1)), input)
 *
 * @since 2.5.0
 */
export const takeLeft = (n) => (as) => isOutOfBound(n, as) ? as : n === 0 ? empty : as.slice(0, n);
/**
 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeRight(2)), [2, 3])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeRight(4)), input)
 * assert.strictEqual(pipe(input, RA.takeRight(-1)), input)
 *
 * @since 2.5.0
 */
export const takeRight = (n) => (as) => isOutOfBound(n, as) ? as : n === 0 ? empty : as.slice(-n);
export function takeLeftWhile(predicate) {
    return (as) => {
        const out = [];
        for (const a of as) {
            if (!predicate(a)) {
                break;
            }
            out.push(a);
        }
        const len = out.length;
        return len === as.length ? as : len === 0 ? empty : out;
    };
}
const spanLeftIndex = (as, predicate) => {
    const l = as.length;
    let i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
export function spanLeft(predicate) {
    return (as) => {
        const [init, rest] = splitAt(spanLeftIndex(as, predicate))(as);
        return { init, rest };
    };
}
/**
 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropLeft(2)), [3])
 * assert.strictEqual(pipe(input, RA.dropLeft(0)), input)
 * assert.strictEqual(pipe(input, RA.dropLeft(-1)), input)
 *
 * @since 2.5.0
 */
export const dropLeft = (n) => (as) => n <= 0 || isEmpty(as) ? as : n >= as.length ? empty : as.slice(n, as.length);
/**
 * Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropRight(2)), [1])
 * assert.strictEqual(pipe(input, RA.dropRight(0)), input)
 * assert.strictEqual(pipe(input, RA.dropRight(-1)), input)
 *
 * @since 2.5.0
 */
export const dropRight = (n) => (as) => n <= 0 || isEmpty(as) ? as : n >= as.length ? empty : as.slice(0, as.length - n);
export function dropLeftWhile(predicate) {
    return (as) => {
        const i = spanLeftIndex(as, predicate);
        return i === 0 ? as : i === as.length ? empty : as.slice(i);
    };
}
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.5.0
 */
export const findIndex = (predicate) => (as) => {
    for (let i = 0; i < as.length; i++) {
        if (predicate(as[i])) {
            return _.some(i);
        }
    }
    return _.none;
};
export function findFirst(predicate) {
    return (as) => {
        for (let i = 0; i < as.length; i++) {
            if (predicate(as[i])) {
                return _.some(as[i]);
            }
        }
        return _.none;
    };
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 2.5.0
 */
export const findFirstMap = (f) => (as) => {
    for (let i = 0; i < as.length; i++) {
        const out = f(as[i]);
        if (_.isSome(out)) {
            return out;
        }
    }
    return _.none;
};
export function findLast(predicate) {
    return (as) => {
        for (let i = as.length - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return _.some(as[i]);
            }
        }
        return _.none;
    };
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 2.5.0
 */
export const findLastMap = (f) => (as) => {
    for (let i = as.length - 1; i >= 0; i--) {
        const out = f(as[i]);
        if (_.isSome(out)) {
            return out;
        }
    }
    return _.none;
};
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.5.0
 */
export const findLastIndex = (predicate) => (as) => {
    for (let i = as.length - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return _.some(i);
        }
    }
    return _.none;
};
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/ReadonlyArray'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.5.0
 */
export const insertAt = (i, a) => (as) => i < 0 || i > as.length ? _.none : _.some(RNEA.unsafeInsertAt(i, a, as));
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.5.0
 */
export const updateAt = (i, a) => modifyAt(i, () => a);
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.5.0
 */
export const deleteAt = (i) => (as) => isOutOfBound(i, as) ? _.none : _.some(unsafeDeleteAt(i, as));
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.5.0
 */
export const modifyAt = (i, f) => (as) => isOutOfBound(i, as) ? _.none : _.some(unsafeUpdateAt(i, f(as[i]), as));
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @since 2.5.0
 */
export const reverse = (as) => (as.length <= 1 ? as : as.slice().reverse());
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/ReadonlyArray'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @since 2.5.0
 */
export const rights = (as) => {
    const r = [];
    for (let i = 0; i < as.length; i++) {
        const a = as[i];
        if (a._tag === 'Right') {
            r.push(a.right);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/ReadonlyArray'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @since 2.5.0
 */
export const lefts = (as) => {
    const r = [];
    for (let i = 0; i < as.length; i++) {
        const a = as[i];
        if (a._tag === 'Left') {
            r.push(a.left);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @since 2.5.0
 */
export const sort = (O) => (as) => as.length <= 1 ? as : as.slice().sort(O.compare);
// TODO: curry and make data-last in v3
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @since 2.5.0
 */
export const zipWith = (fa, fb, f) => {
    const fc = [];
    const len = Math.min(fa.length, fb.length);
    for (let i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
export function zip(as, bs) {
    if (bs === undefined) {
        return (bs) => zip(bs, as);
    }
    return zipWith(as, bs, (a, b) => [a, b]);
}
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.5.0
 */
export const unzip = (as) => {
    const fa = [];
    const fb = [];
    for (let i = 0; i < as.length; i++) {
        fa[i] = as[i][0];
        fb[i] = as[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
export const prependAll = (middle) => {
    const f = RNEA.prependAll(middle);
    return (as) => (isNonEmpty(as) ? f(as) : as);
};
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export const intersperse = (middle) => {
    const f = RNEA.intersperse(middle);
    return (as) => (isNonEmpty(as) ? f(as) : as);
};
/**
 * Rotate a `ReadonlyArray` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @since 2.5.0
 */
export const rotate = (n) => {
    const f = RNEA.rotate(n);
    return (as) => (isNonEmpty(as) ? f(as) : as);
};
export function elem(E) {
    return (a, as) => {
        if (as === undefined) {
            const elemE = elem(E);
            return (as) => elemE(a, as);
        }
        const predicate = (element) => E.equals(element, a);
        let i = 0;
        for (; i < as.length; i++) {
            if (predicate(as[i])) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.5.0
 */
export const uniq = (E) => {
    const f = RNEA.uniq(E);
    return (as) => (isNonEmpty(as) ? f(as) : as);
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/ReadonlyArray'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 2.5.0
 */
export const sortBy = (ords) => {
    const f = RNEA.sortBy(ords);
    return (as) => (isNonEmpty(as) ? f(as) : as);
};
/**
 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
 * `ReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
 * value and the tail of the `ReadonlyArray`.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>) => {
 *   return RA.chop(as => {
 *     const { init, rest } = pipe(as, RA.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @since 2.5.0
 */
export const chop = (f) => {
    const g = RNEA.chop(f);
    return (as) => (isNonEmpty(as) ? g(as) : empty);
};
/**
 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @since 2.5.0
 */
export const splitAt = (n) => (as) => n >= 1 && isNonEmpty(as) ? RNEA.splitAt(n)(as) : isEmpty(as) ? [as, empty] : [empty, as];
/**
 * Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that:
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `as`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @since 2.5.0
 */
export const chunksOf = (n) => {
    const f = RNEA.chunksOf(n);
    return (as) => (isNonEmpty(as) ? f(as) : empty);
};
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromOptionK = (f) => (...a) => fromOption(f(...a));
export function comprehension(input, f, g = () => true) {
    const go = (scope, input) => isNonEmpty(input)
        ? flatMap(RNEA.head(input), (a) => go(pipe(scope, append(a)), RNEA.tail(input)))
        : g(...scope)
            ? [f(...scope)]
            : empty;
    return go(empty, input);
}
/**
 * @since 2.11.0
 */
export const concatW = (second) => (first) => isEmpty(first) ? second : isEmpty(second) ? first : first.concat(second);
/**
 * @since 2.11.0
 */
export const concat = concatW;
export function union(E) {
    const unionE = RNEA.union(E);
    return (first, second) => {
        if (second === undefined) {
            const unionE = union(E);
            return (second) => unionE(second, first);
        }
        return isNonEmpty(first) && isNonEmpty(second) ? unionE(second)(first) : isNonEmpty(first) ? first : second;
    };
}
export function intersection(E) {
    const elemE = elem(E);
    return (xs, ys) => {
        if (ys === undefined) {
            const intersectionE = intersection(E);
            return (ys) => intersectionE(ys, xs);
        }
        return xs.filter((a) => elemE(a, ys));
    };
}
export function difference(E) {
    const elemE = elem(E);
    return (xs, ys) => {
        if (ys === undefined) {
            const differenceE = difference(E);
            return (ys) => differenceE(ys, xs);
        }
        return xs.filter((a) => !elemE(a, ys));
    };
}
const _map = (fa, f) => pipe(fa, map(f));
const _mapWithIndex = (fa, f) => pipe(fa, mapWithIndex(f));
const _ap = (fab, fa) => pipe(fab, ap(fa));
const _filter = (fa, predicate) => pipe(fa, filter(predicate));
const _filterMap = (fa, f) => pipe(fa, filterMap(f));
const _partition = (fa, predicate) => pipe(fa, partition(predicate));
const _partitionMap = (fa, f) => pipe(fa, partitionMap(f));
const _partitionWithIndex = (fa, predicateWithIndex) => pipe(fa, partitionWithIndex(predicateWithIndex));
const _partitionMapWithIndex = (fa, f) => pipe(fa, partitionMapWithIndex(f));
const _alt = (fa, that) => pipe(fa, alt(that));
const _reduce = (fa, b, f) => pipe(fa, reduce(b, f));
const _foldMap = (M) => {
    const foldMapM = foldMap(M);
    return (fa, f) => pipe(fa, foldMapM(f));
};
const _reduceRight = (fa, b, f) => pipe(fa, reduceRight(b, f));
const _reduceWithIndex = (fa, b, f) => pipe(fa, reduceWithIndex(b, f));
const _foldMapWithIndex = (M) => {
    const foldMapWithIndexM = foldMapWithIndex(M);
    return (fa, f) => pipe(fa, foldMapWithIndexM(f));
};
const _reduceRightWithIndex = (fa, b, f) => pipe(fa, reduceRightWithIndex(b, f));
const _filterMapWithIndex = (fa, f) => pipe(fa, filterMapWithIndex(f));
const _filterWithIndex = (fa, predicateWithIndex) => pipe(fa, filterWithIndex(predicateWithIndex));
const _extend = (fa, f) => pipe(fa, extend(f));
const _traverse = (F) => {
    const traverseF = traverse(F);
    return (ta, f) => pipe(ta, traverseF(f));
};
/* istanbul ignore next */
const _traverseWithIndex = (F) => {
    const traverseWithIndexF = traverseWithIndex(F);
    return (ta, f) => pipe(ta, traverseWithIndexF(f));
};
/** @internal */
export const _chainRecDepthFirst = (a, f) => pipe(a, chainRecDepthFirst(f));
/** @internal */
export const _chainRecBreadthFirst = (a, f) => pipe(a, chainRecBreadthFirst(f));
/**
 * @category constructors
 * @since 2.5.0
 */
export const of = RNEA.of;
/**
 * @since 2.7.0
 */
export const zero = () => empty;
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.altW(() => ['a', 'b'])
 *   ),
 *   [1, 2, 3, 'a', 'b']
 * )
 *
 * @category error handling
 * @since 2.9.0
 */
export const altW = (that) => (fa) => fa.concat(that());
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `ReadonlyArray` concatenates the inputs into a single array.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.5.0
 */
export const alt = altW;
/**
 * @since 2.5.0
 */
export const ap = (fa) => flatMap((f) => pipe(fa, map(f)));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @example
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => pipe(ma, chainWithIndex((i, a) => f(a, i))));
/**
 * @category sequencing
 * @since 2.5.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.5.0
 */
export const map = (f) => (fa) => fa.map((a) => f(a));
/**
 * @category mapping
 * @since 2.5.0
 */
export const mapWithIndex = (f) => (fa) => fa.map((a, i) => f(i, a));
/**
 * @category filtering
 * @since 2.5.0
 */
export const separate = (fa) => {
    const left = [];
    const right = [];
    for (const e of fa) {
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
};
/**
 * @category filtering
 * @since 2.5.0
 */
export const filter = (predicate) => (as) => as.filter(predicate);
/**
 * @category filtering
 * @since 2.5.0
 */
export const filterMapWithIndex = (f) => (fa) => {
    const out = [];
    for (let i = 0; i < fa.length; i++) {
        const optionB = f(i, fa[i]);
        if (_.isSome(optionB)) {
            out.push(optionB.value);
        }
    }
    return out;
};
/**
 * @category filtering
 * @since 2.5.0
 */
export const filterMap = (f) => filterMapWithIndex((_, a) => f(a));
/**
 * @category filtering
 * @since 2.5.0
 */
export const compact = /*#__PURE__*/ filterMap(identity);
/**
 * @category filtering
 * @since 2.5.0
 */
export const partition = (predicate) => partitionWithIndex((_, a) => predicate(a));
/**
 * @category filtering
 * @since 2.5.0
 */
export const partitionWithIndex = (predicateWithIndex) => (as) => {
    const left = [];
    const right = [];
    for (let i = 0; i < as.length; i++) {
        const a = as[i];
        if (predicateWithIndex(i, a)) {
            right.push(a);
        }
        else {
            left.push(a);
        }
    }
    return separated(left, right);
};
/**
 * @category filtering
 * @since 2.5.0
 */
export const partitionMap = (f) => partitionMapWithIndex((_, a) => f(a));
/**
 * @category filtering
 * @since 2.5.0
 */
export const partitionMapWithIndex = (f) => (fa) => {
    const left = [];
    const right = [];
    for (let i = 0; i < fa.length; i++) {
        const e = f(i, fa[i]);
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
};
/**
 * @category filtering
 * @since 2.5.0
 */
export const filterWithIndex = (predicateWithIndex) => (as) => as.filter((a, i) => predicateWithIndex(i, a));
/**
 * @since 2.5.0
 */
export const extend = (f) => (wa) => wa.map((_, i) => f(wa.slice(i)));
/**
 * @since 2.5.0
 */
export const duplicate = /*#__PURE__*/ extend(identity);
/**
 * @category folding
 * @since 2.5.0
 */
export const foldMapWithIndex = (M) => (f) => (fa) => fa.reduce((b, a, i) => M.concat(b, f(i, a)), M.empty);
/**
 * @category folding
 * @since 2.5.0
 */
export const reduce = (b, f) => reduceWithIndex(b, (_, b, a) => f(b, a));
/**
 * @category folding
 * @since 2.5.0
 */
export const foldMap = (M) => {
    const foldMapWithIndexM = foldMapWithIndex(M);
    return (f) => foldMapWithIndexM((_, a) => f(a));
};
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceWithIndex = (b, f) => (fa) => {
    const len = fa.length;
    let out = b;
    for (let i = 0; i < len; i++) {
        out = f(i, out, fa[i]);
    }
    return out;
};
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceRight = (b, f) => reduceRightWithIndex(b, (_, a, b) => f(a, b));
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceRightWithIndex = (b, f) => (fa) => fa.reduceRight((b, a, i) => f(i, a, b), b);
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
export const sequence = (F) => (ta) => {
    return _reduce(ta, F.of(zero()), (fas, fa) => F.ap(F.map(fas, (as) => (a) => pipe(as, append(a))), fa));
};
/**
 * @category sequencing
 * @since 2.6.3
 */
export const traverseWithIndex = (F) => (f) => reduceWithIndex(F.of(zero()), (i, fbs, a) => F.ap(F.map(fbs, (bs) => (b) => pipe(bs, append(b))), f(i, a)));
/**
 * @category filtering
 * @since 2.6.5
 */
export const wither = (F) => {
    const _witherF = _wither(F);
    return (f) => (fa) => _witherF(fa, f);
};
/**
 * @category filtering
 * @since 2.6.5
 */
export const wilt = (F) => {
    const _wiltF = _wilt(F);
    return (f) => (fa) => _wiltF(fa, f);
};
/**
 * @since 2.6.6
 */
export const unfold = (b, f) => {
    const out = [];
    let bb = b;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const mt = f(bb);
        if (_.isSome(mt)) {
            const [a, b] = mt.value;
            out.push(a);
            bb = b;
        }
        else {
            break;
        }
    }
    return out;
};
/**
 * @category type lambdas
 * @since 2.5.0
 */
export const URI = 'ReadonlyArray';
/**
 * @category instances
 * @since 2.5.0
 */
export const getShow = (S) => ({
    show: (as) => `[${as.map(S.show).join(', ')}]`
});
/**
 * @category instances
 * @since 2.5.0
 */
export const getSemigroup = () => ({
    concat: (first, second) => (isEmpty(first) ? second : isEmpty(second) ? first : first.concat(second))
});
/**
 * Returns a `Monoid` for `ReadonlyArray<A>`.
 *
 * @example
 * import { getMonoid } from 'fp-ts/ReadonlyArray'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.5.0
 */
export const getMonoid = () => ({
    concat: getSemigroup().concat,
    empty
});
/**
 * Derives an `Eq` over the `ReadonlyArray` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/ReadonlyArray'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.5.0
 */
export const getEq = (E) => fromEquals((xs, ys) => xs.length === ys.length && xs.every((x, i) => E.equals(x, ys[i])));
/**
 * Derives an `Ord` over the `ReadonlyArray` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 *
 * @category instances
 * @since 2.5.0
 */
export const getOrd = (O) => fromCompare((a, b) => {
    const aLen = a.length;
    const bLen = b.length;
    const len = Math.min(aLen, bLen);
    for (let i = 0; i < len; i++) {
        const ordering = O.compare(a[i], b[i]);
        if (ordering !== 0) {
            return ordering;
        }
    }
    return N.Ord.compare(aLen, bLen);
});
/**
 * @category instances
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
 * @since 2.11.0
 */
export const getUnionMonoid = (E) => ({
    concat: getUnionSemigroup(E).concat,
    empty
});
/**
 * @category instances
 * @since 2.11.0
 */
export const getIntersectionSemigroup = (E) => {
    const intersectionE = intersection(E);
    return {
        concat: (first, second) => intersectionE(second)(first)
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
export const getDifferenceMagma = (E) => {
    const differenceE = difference(E);
    return {
        concat: (first, second) => differenceE(second)(first)
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
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.chainFirst(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.5.0
 */
export const chainFirst = 
/*#__PURE__*/ chainFirst_(Chain);
/**
 * @category instances
 * @since 2.7.0
 */
export const Unfoldable = {
    URI,
    unfold
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
 * @since 2.11.0
 */
export const Zero = {
    URI,
    zero
};
/**
 * @category do notation
 * @since 2.11.0
 */
export const guard = /*#__PURE__*/ guard_(Zero, Pointed);
/**
 * @category instances
 * @since 2.7.0
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
 * @since 2.7.0
 */
export const Extend = {
    URI,
    map: _map,
    extend: _extend
};
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
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex
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
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverse: _traverse,
    sequence,
    traverseWithIndex: _traverseWithIndex
};
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainRecDepthFirst = (f) => (a) => {
    const todo = [...f(a)];
    const out = [];
    while (todo.length > 0) {
        const e = todo.shift();
        if (_.isLeft(e)) {
            todo.unshift(...f(e.left));
        }
        else {
            out.push(e.right);
        }
    }
    return out;
};
/**
 * @category instances
 * @since 2.11.0
 */
export const ChainRecDepthFirst = {
    URI,
    map: _map,
    ap: _ap,
    chain: flatMap,
    chainRec: _chainRecDepthFirst
};
/**
 * @category sequencing
 * @since 2.11.0
 */
export const chainRecBreadthFirst = (f) => (a) => {
    const initial = f(a);
    const todo = [];
    const out = [];
    function go(e) {
        if (_.isLeft(e)) {
            f(e.left).forEach((v) => todo.push(v));
        }
        else {
            out.push(e.right);
        }
    }
    for (const e of initial) {
        go(e);
    }
    while (todo.length > 0) {
        go(todo.shift());
    }
    return out;
};
/**
 * @category instances
 * @since 2.11.0
 */
export const ChainRecBreadthFirst = {
    URI,
    map: _map,
    ap: _ap,
    chain: flatMap,
    chainRec: _chainRecBreadthFirst
};
const _wither = /*#__PURE__*/ witherDefault(Traversable, Compactable);
const _wilt = /*#__PURE__*/ wiltDefault(Traversable, Compactable);
/**
 * @category instances
 * @since 2.7.0
 */
export const Witherable = {
    URI,
    map: _map,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence,
    wither: _wither,
    wilt: _wilt
};
/**
 * Filter values inside a context.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as T from 'fp-ts/Task'
 *
 * const filterE = RA.filterE(T.ApplicativePar)
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       [-1, 2, 3],
 *       filterE((n) => T.of(n > 0))
 *     )(),
 *     [2, 3]
 *   )
 * }
 * test()
 *
 * @since 2.11.0
 */
export const filterE = /*#__PURE__*/ filterE_(Witherable);
/**
 * @category instances
 * @since 2.11.0
 */
export const FromEither = {
    URI,
    fromEither
};
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromEitherK = /*#__PURE__*/ fromEitherK_(FromEither);
// -------------------------------------------------------------------------------------
// unsafe
// -------------------------------------------------------------------------------------
/**
 * @category unsafe
 * @since 2.5.0
 */
export const unsafeInsertAt = RNEA.unsafeInsertAt;
/**
 * @category unsafe
 * @since 2.5.0
 */
export const unsafeUpdateAt = (i, a, as) => isNonEmpty(as) ? RNEA.unsafeUpdateAt(i, a, as) : as;
/**
 * @category unsafe
 * @since 2.5.0
 */
export const unsafeDeleteAt = (i, as) => {
    const xs = as.slice();
    xs.splice(i, 1);
    return xs;
};
/**
 * @category conversions
 * @since 2.5.0
 */
export const toArray = (as) => as.slice();
/**
 * @category conversions
 * @since 2.5.0
 */
export const fromArray = (as) => (isEmpty(as) ? empty : as.slice());
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * An empty array
 *
 * @since 2.5.0
 */
export const empty = RNEA.empty;
export function every(predicate) {
    return (as) => as.every(predicate);
}
/**
 * Check if a predicate holds true for any array member.
 *
 * @example
 * import { some } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([-1, -2, 3], some(isPositive)), true)
 * assert.deepStrictEqual(pipe([-1, -2, -3], some(isPositive)), false)
 *
 * @since 2.9.0
 */
export const some = (predicate) => (as) => as.some(predicate);
/**
 * Alias of [`some`](#some)
 *
 * @since 2.11.0
 */
export const exists = some;
/**
 * Places an element in between members of a `ReadonlyArray`, then folds the results using the provided `Monoid`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/ReadonlyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
export const intercalate = (M) => {
    const intercalateM = RNEA.intercalate(M);
    return (middle) => match(() => M.empty, intercalateM(middle));
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
 * @since 2.5.0
 */
export const chain = flatMap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `ReadonlyNonEmptyArray` module instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const range = RNEA.range;
/**
 * Use [`prepend`](#prepend) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const cons = RNEA.cons;
/**
 * Use [`append`](#append) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const snoc = RNEA.snoc;
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export const prependToAll = prependAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RA.Functor` instead of `RA.readonlyArray`
 * (where `RA` is from `import RA from 'fp-ts/ReadonlyArray'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const readonlyArray = {
    URI,
    compact,
    separate,
    map: _map,
    ap: _ap,
    of,
    chain: flatMap,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    mapWithIndex: _mapWithIndex,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    alt: _alt,
    zero,
    unfold,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    extend: _extend,
    wither: _wither,
    wilt: _wilt
};
//# sourceMappingURL=ReadonlyArray.js.map