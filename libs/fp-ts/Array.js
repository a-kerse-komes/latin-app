import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain.js';
import { fromEitherK as fromEitherK_ } from './FromEither.js';
import { dual, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
import * as NEA from './NonEmptyArray.js';
import * as RA from './ReadonlyArray.js';
import { separated } from './Separated.js';
import { filterE as filterE_, wiltDefault, witherDefault } from './Witherable.js';
import { guard as guard_ } from './Zero.js';
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 * assert.strictEqual(isEmpty(['a']), false)
 *
 * @category refinements
 * @since 2.0.0
 */
export const isEmpty = (as) => as.length === 0;
/**
 * Test whether an array is non empty narrowing down the type to `NonEmptyArray<A>`
 *
 * @example
 * import { isNonEmpty } from 'fp-ts/Array'
 *
 * assert.strictEqual(isNonEmpty([]), false)
 * assert.strictEqual(isNonEmpty(['a']), true)
 *
 * @category refinements
 * @since 2.0.0
 */
export const isNonEmpty = NEA.isNonEmpty;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Prepend an element to the front of a `Array`, creating a new `NonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
export const prepend = NEA.prepend;
/**
 * Less strict version of [`prepend`](#prepend).
 *
 * @example
 * import { prependW } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prependW("a")), ["a", 2, 3, 4]);
 *
 * @since 2.11.0
 */
export const prependW = NEA.prependW;
/**
 * Append an element to the end of a `Array`, creating a new `NonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @since 2.10.0
 */
export const append = NEA.append;
/**
 * Less strict version of [`append`](#append).
 *
 * @example
 * import { appendW } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], appendW("d")), [1, 2, 3, "d"]);
 *
 * @since 2.11.0
 */
export const appendW = NEA.appendW;
/**
 * Return a `Array` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/Array'
 *
 * const double = (i: number): number => i * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 * assert.deepStrictEqual(makeBy(-3, double), [])
 * assert.deepStrictEqual(makeBy(4.32164, double), [0, 2, 4, 6])
 *
 * @category constructors
 * @since 2.0.0
 */
export const makeBy = (n, f) => (n <= 0 ? [] : NEA.makeBy(f)(n));
/**
 * Create a `Array` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 * assert.deepStrictEqual(replicate(-3, 'a'), [])
 * assert.deepStrictEqual(replicate(2.985647, 'a'), ['a', 'a'])
 *
 * @category constructors
 * @since 2.0.0
 */
export const replicate = (n, a) => makeBy(n, () => a);
export function fromPredicate(predicate) {
    return (a) => (predicate(a) ? [a] : []);
}
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * Create an array from an `Option`. The resulting array will contain the content of the
 * `Option` if it is `Some` and it will be empty if the `Option` is `None`.
 *
 * @example
 * import { fromOption } from 'fp-ts/Array'
 * import { option } from "fp-ts";
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(option.some("a"), fromOption),["a"])
 * assert.deepStrictEqual(pipe(option.none, fromOption),[])
 *
 * @category conversions
 * @since 2.11.0
 */
export const fromOption = (ma) => (_.isNone(ma) ? [] : [ma.value]);
/**
 * Create an array from an `Either`. The resulting array will contain the content of the
 * `Either` if it is `Right` and it will be empty if the `Either` is `Left`.
 *
 * @example
 * import { fromEither } from 'fp-ts/Array'
 * import { either } from "fp-ts";
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe(either.right("r"), fromEither), ["r"]);
 * assert.deepStrictEqual(pipe(either.left("l"), fromEither), []);
 *
 * @category conversions
 * @since 2.11.0
 */
export const fromEither = (e) => (_.isLeft(e) ? [] : [e.right]);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @example
 * import { matchW } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * const matcherW = matchW(
 *   () => "No elements",
 *   (as) => as.length
 * );
 * assert.deepStrictEqual(pipe([1, 2, 3, 4], matcherW), 4);
 * assert.deepStrictEqual(pipe([], matcherW), "No elements");
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchW = (onEmpty, onNonEmpty) => (as) => isNonEmpty(as) ? onNonEmpty(as) : onEmpty();
/**
 * Takes an array, if the array is empty it returns the result of `onEmpty`, otherwise
 * it passes the array to `onNonEmpty` and returns the result.
 *
 * @example
 * import { match } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * const matcher = match(
 *   () => "No elements",
 *   (as) => `Found ${as.length} element(s)`
 * );
 * assert.deepStrictEqual(pipe([1, 2, 3, 4], matcher), "Found 4 element(s)");
 * assert.deepStrictEqual(pipe([], matcher), "No elements");
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const match = matchW;
/**
 * Less strict version of [`matchLeft`](#matchleft). It will work when `onEmpty` and
 * `onNonEmpty` have different return types.
 *
 * @example
 * import { matchLeftW } from 'fp-ts/Array'
 *
 * const f = matchLeftW(
 *   () => 0,
 *   (head: string, tail: string[]) => `Found "${head}" followed by ${tail.length} elements`
 * );
 * assert.strictEqual(f(["a", "b", "c"]), 'Found "a" followed by 2 elements');
 * assert.strictEqual(f([]), 0);
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchLeftW = (onEmpty, onNonEmpty) => (as) => isNonEmpty(as) ? onNonEmpty(NEA.head(as), NEA.tail(as)) : onEmpty();
/**
 * Takes an array, if the array is empty it returns the result of `onEmpty`, otherwise
 * it passes the array to `onNonEmpty` broken into its first element and remaining elements.
 *
 * @example
 * import { matchLeft } from 'fp-ts/Array'
 *
 * const len: <A>(as: Array<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
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
 * @since 2.0.0
 */
export const foldLeft = matchLeft;
/**
 * Less strict version of [`matchRight`](#matchright). It will work when `onEmpty` and
 * `onNonEmpty` have different return types.
 *
 * @example
 * import { matchRightW } from 'fp-ts/Array'
 *
 * const f = matchRightW(
 *   () => 0,
 *   (head: string[], tail: string) => `Found ${head.length} elements folllowed by "${tail}"`
 * );
 * assert.strictEqual(f(["a", "b", "c"]), 'Found 2 elements folllowed by "c"');
 * assert.strictEqual(f([]), 0);
 *
 * @category pattern matching
 * @since 2.11.0
 */
export const matchRightW = (onEmpty, onNonEmpty) => (as) => isNonEmpty(as) ? onNonEmpty(NEA.init(as), NEA.last(as)) : onEmpty();
/**
 * Takes an array, if the array is empty it returns the result of `onEmpty`, otherwise
 * it passes the array to `onNonEmpty` broken  into its initial elements and the last element.
 *
 * @example
 * import { matchRight } from 'fp-ts/Array'
 *
 * const len: <A>(as: Array<A>) => number = matchRight(
 *   () => 0,
 *   (head, _) => 1 + len(head)
 * );
 * assert.strictEqual(len([1, 2, 3]), 3);
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchRight = matchRightW;
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category pattern matching
 * @since 2.0.0
 */
export const foldRight = matchRight;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Same as [`chain`](#chain), but passing also the index to the iterating function.
 *
 * @example
 * import { chainWithIndex, replicate } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (index: number, x: string) => replicate(2, `${x}${index}`);
 * assert.deepStrictEqual(pipe(["a", "b", "c"], chainWithIndex(f)), ["a0", "a0", "b1", "b1", "c2", "c2"]);
 *
 * @category sequencing
 * @since 2.7.0
 */
export const chainWithIndex = (f) => (as) => {
    const out = [];
    for (let i = 0; i < as.length; i++) {
        out.push(...f(i, as[i]));
    }
    return out;
};
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * @example
 * import { scanLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @since 2.0.0
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
 * import { scanRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @since 2.0.0
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
 * Calculate the number of elements in a `Array`.
 *
 * @example
 * import { size } from 'fp-ts/Array'
 *
 * assert.strictEqual(size(["a","b","c"]),3)
 *
 * @since 2.10.0
 */
export const size = (as) => as.length;
/**
 * Test whether an array contains a particular index
 *
 * @example
 * import { isOutOfBound } from 'fp-ts/Array'
 *
 * assert.strictEqual(isOutOfBound(1,["a","b","c"]),false)
 * assert.strictEqual(isOutOfBound(-1,["a","b","c"]),true)
 * assert.strictEqual(isOutOfBound(3,["a","b","c"]),true)
 *
 * @since 2.0.0
 */
export const isOutOfBound = NEA.isOutOfBound;
// TODO: remove non-curried overloading in v3
/**
 * This function provides a safe way to read a value at a particular index from an array.
 * It returns a `none` if the index is out of bounds, and a `some` of the element if the
 * index is valid.
 *
 * @example
 * import { lookup } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(1)), some(2))
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(3)), none)
 *
 * @since 2.0.0
 */
export const lookup = RA.lookup;
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.0.0
 */
export const head = RA.head;
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.0.0
 */
export const last = RA.last;
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 2.0.0
 */
export const tail = (as) => (isNonEmpty(as) ? _.some(NEA.tail(as)) : _.none);
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 2.0.0
 */
export const init = (as) => (isNonEmpty(as) ? _.some(NEA.init(as)) : _.none);
/**
 * Keep only a max number of elements from the start of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { takeLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(takeLeft(2)([1, 2, 3, 4, 5]), [1, 2]);
 * assert.deepStrictEqual(takeLeft(7)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
 * assert.deepStrictEqual(takeLeft(0)([1, 2, 3, 4, 5]), []);
 * assert.deepStrictEqual(takeLeft(-1)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
 *
 * @since 2.0.0
 */
export const takeLeft = (n) => (as) => isOutOfBound(n, as) ? copy(as) : as.slice(0, n);
/**
 * Keep only a max number of elements from the end of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { takeRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(takeRight(2)([1, 2, 3, 4, 5]), [4, 5]);
 * assert.deepStrictEqual(takeRight(7)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
 * assert.deepStrictEqual(takeRight(0)([1, 2, 3, 4, 5]), []);
 * assert.deepStrictEqual(takeRight(-1)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
 *
 * @since 2.0.0
 */
export const takeRight = (n) => (as) => isOutOfBound(n, as) ? copy(as) : n === 0 ? [] : as.slice(-n);
export function takeLeftWhile(predicate) {
    return (as) => {
        const out = [];
        for (const a of as) {
            if (!predicate(a)) {
                break;
            }
            out.push(a);
        }
        return out;
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
 * Creates a new `Array` which is a copy of the input dropping a max number of elements from the start.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { dropLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropLeft(2)([1, 2, 3]), [3]);
 * assert.deepStrictEqual(dropLeft(5)([1, 2, 3]), []);
 * assert.deepStrictEqual(dropLeft(0)([1, 2, 3]), [1, 2, 3]);
 * assert.deepStrictEqual(dropLeft(-2)([1, 2, 3]), [1, 2, 3]);
 *
 * @since 2.0.0
 */
export const dropLeft = (n) => (as) => n <= 0 || isEmpty(as) ? copy(as) : n >= as.length ? [] : as.slice(n, as.length);
/**
 * Creates a new `Array` which is a copy of the input dropping a max number of elements from the end.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { dropRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropRight(2)([1, 2, 3]), [1]);
 * assert.deepStrictEqual(dropRight(5)([1, 2, 3]), []);
 * assert.deepStrictEqual(dropRight(0)([1, 2, 3]), [1, 2, 3]);
 * assert.deepStrictEqual(dropRight(-2)([1, 2, 3]), [1, 2, 3]);
 *
 * @since 2.0.0
 */
export const dropRight = (n) => (as) => n <= 0 || isEmpty(as) ? copy(as) : n >= as.length ? [] : as.slice(0, as.length - n);
export function dropLeftWhile(predicate) {
    return (as) => as.slice(spanLeftIndex(as, predicate));
}
/**
 * `findIndex` returns an `Option` containing the first index for which a predicate holds.
 * It returns `None` if no element satisfies the predicate.
 * Similar to [`findFirst`](#findFirst) but returning the index instead of the element.
 *
 * @example
 * import { findIndex } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.0.0
 */
export const findIndex = RA.findIndex;
export function findFirst(predicate) {
    return RA.findFirst(predicate);
}
/**
 * Given a selector function which takes an element and returns an option,
 * this function applies the selector to each element of the array and
 * returns the first `Some` result. Otherwise it returns `None`.
 *
 * @example
 * import { findFirstMap } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string;
 *   readonly age: number;
 * }
 *
 * const persons: Array<Person> = [
 *   { name: "John", age: 16 },
 *   { name: "Mary", age: 45 },
 *   { name: "Joey", age: 28 },
 * ];
 *
 * const nameOfPersonAbove18 = (p: Person) => (p.age <= 18 ? none : some(p.name));
 * const nameOfPersonAbove70 = (p: Person) => (p.age <= 70 ? none : some(p.name));
 * assert.deepStrictEqual(findFirstMap(nameOfPersonAbove18)(persons), some("Mary"));
 * assert.deepStrictEqual(findFirstMap(nameOfPersonAbove70)(persons), none);
 *
 * @since 2.0.0
 */
export const findFirstMap = RA.findFirstMap;
export function findLast(predicate) {
    return RA.findLast(predicate);
}
/**
 * Given a selector function which takes an element and returns an option,
 * this function applies the selector to each element of the array starting from the
 * end and returns the last `Some` result. Otherwise it returns `None`.
 *
 * @example
 * import { findLastMap } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string;
 *   readonly age: number;
 * }
 *
 * const persons: Array<Person> = [
 *   { name: "John", age: 16 },
 *   { name: "Mary", age: 45 },
 *   { name: "Joey", age: 28 },
 * ];
 *
 * const nameOfPersonAbove18 = (p: Person) => (p.age <= 18 ? none : some(p.name));
 * const nameOfPersonAbove70 = (p: Person) => (p.age <= 70 ? none : some(p.name));
 * assert.deepStrictEqual(findLastMap(nameOfPersonAbove18)(persons), some("Joey"));
 * assert.deepStrictEqual(findLastMap(nameOfPersonAbove70)(persons), none);
 *
 * @since 2.0.0
 */
export const findLastMap = RA.findLastMap;
/**
 * Returns the index of the last element of the list which matches the predicate.
 * It returns an `Option` containing the index or `None` if not found.
 *
 * @example
 * import { findLastIndex } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 * @since 2.0.0
 */
export const findLastIndex = RA.findLastIndex;
/**
 * This function takes an array and makes a new array containing the same elements.
 *
 * @since 2.0.0
 */
export const copy = (as) => as.slice();
/**
 * Insert an element at the specified index, creating a new array,
 * or returning `None` if the index is out of bounds.
 *
 * @example
 * import { insertAt } from 'fp-ts/Array'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.0.0
 */
export const insertAt = (i, a) => (as) => i < 0 || i > as.length ? _.none : _.some(unsafeInsertAt(i, a, as));
/**
 * Change the element at the specified index, creating a new array,
 * or returning `None` if the index is out of bounds.
 *
 * @example
 * import { updateAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.0.0
 */
export const updateAt = (i, a) => modifyAt(i, () => a);
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds.
 *
 * @example
 * import { deleteAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.0.0
 */
export const deleteAt = (i) => (as) => isOutOfBound(i, as) ? _.none : _.some(unsafeDeleteAt(i, as));
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds.
 *
 * @example
 * import { modifyAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.0.0
 */
export const modifyAt = (i, f) => (as) => isOutOfBound(i, as) ? _.none : _.some(unsafeUpdateAt(i, f(as[i]), as));
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @since 2.0.0
 */
export const reverse = (as) => (isEmpty(as) ? [] : as.slice().reverse());
/**
 * Takes an `Array` of `Either` and produces a new `Array` containing
 * the values of all the `Right` elements in the same order.
 *
 * @example
 * import { rights } from 'fp-ts/Array'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @since 2.0.0
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
 * Takes an `Array` of `Either` and produces a new `Array` containing
 * the values of all the `Left` elements in the same order.
 *
 * @example
 * import { lefts } from 'fp-ts/Array'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @since 2.0.0
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
 * import { sort } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @since 2.0.0
 */
export const sort = (O) => (as) => as.length <= 1 ? copy(as) : as.slice().sort(O.compare);
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @since 2.0.0
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
 * import { unzip } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.0.0
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
 * Creates a new `Array`, prepending an element to every member of the input `Array`.
 *
 * @example
 * import { prependAll } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.10.0
 */
export const prependAll = (middle) => {
    const f = NEA.prependAll(middle);
    return (as) => (isNonEmpty(as) ? f(as) : []);
};
/**
 * Creates a new `Array` placing an element in between members of the input `Array`.
 *
 * @example
 * import { intersperse } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 2.9.0
 */
export const intersperse = (middle) => {
    const f = NEA.intersperse(middle);
    return (as) => (isNonEmpty(as) ? f(as) : copy(as));
};
/**
 * Creates a new `Array` rotating the input `Array` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @since 2.0.0
 */
export const rotate = (n) => {
    const f = NEA.rotate(n);
    return (as) => (isNonEmpty(as) ? f(as) : copy(as));
};
// TODO: remove non-curried overloading in v3
/**
 * Test if a value is a member of an `Array`. Takes a `Eq<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an `Array<A>`.
 *
 * @example
 * import { elem } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(2)), true)
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(0)), false)
 *
 * @since 2.0.0
 */
export const elem = RA.elem;
/**
 * Creates a new `Array` removing duplicate elements, keeping the first occurrence of an element,
 * based on a `Eq<A>`.
 *
 * @example
 * import { uniq } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 2.0.0
 */
export const uniq = (E) => {
    const f = NEA.uniq(E);
    return (as) => (isNonEmpty(as) ? f(as) : copy(as));
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/Array'
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
 * @since 2.0.0
 */
export const sortBy = (ords) => {
    const f = NEA.sortBy(ords);
    return (as) => (isNonEmpty(as) ? f(as) : copy(as));
};
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as A from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
 *   return A.chop(as => {
 *     const { init, rest } = pipe(as, A.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @since 2.0.0
 */
export const chop = (f) => {
    const g = NEA.chop(f);
    return (as) => (isNonEmpty(as) ? g(as) : []);
};
/**
 * Splits an `Array` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @since 2.0.0
 */
export const splitAt = (n) => (as) => n >= 1 && isNonEmpty(as) ? NEA.splitAt(n)(as) : isEmpty(as) ? [copy(as), []] : [[], copy(as)];
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @since 2.0.0
 */
export const chunksOf = (n) => {
    const f = NEA.chunksOf(n);
    return (as) => (isNonEmpty(as) ? f(as) : []);
};
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromOptionK = (f) => (...a) => fromOption(f(...a));
export function comprehension(input, f, g = () => true) {
    const go = (scope, input) => isNonEmpty(input)
        ? flatMap(NEA.head(input), (a) => go(pipe(scope, append(a)), NEA.tail(input)))
        : g(...scope)
            ? [f(...scope)]
            : [];
    return go([], input);
}
/**
 * @since 2.11.0
 */
export const concatW = (second) => (first) => isEmpty(first) ? copy(second) : isEmpty(second) ? copy(first) : first.concat(second);
/**
 * @since 2.11.0
 */
export const concat = concatW;
export function union(E) {
    const unionE = NEA.union(E);
    return (first, second) => {
        if (second === undefined) {
            const unionE = union(E);
            return (second) => unionE(second, first);
        }
        return isNonEmpty(first) && isNonEmpty(second)
            ? unionE(second)(first)
            : isNonEmpty(first)
                ? copy(first)
                : copy(second);
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
/* istanbul ignore next */
const _mapWithIndex = (fa, f) => pipe(fa, mapWithIndex(f));
const _ap = (fab, fa) => pipe(fab, ap(fa));
/* istanbul ignore next */
const _filter = (fa, predicate) => pipe(fa, filter(predicate));
/* istanbul ignore next */
const _filterMap = (fa, f) => pipe(fa, filterMap(f));
/* istanbul ignore next */
const _partition = (fa, predicate) => pipe(fa, partition(predicate));
/* istanbul ignore next */
const _partitionMap = (fa, f) => pipe(fa, partitionMap(f));
/* istanbul ignore next */
const _partitionWithIndex = (fa, predicateWithIndex) => pipe(fa, partitionWithIndex(predicateWithIndex));
/* istanbul ignore next */
const _partitionMapWithIndex = (fa, f) => pipe(fa, partitionMapWithIndex(f));
/* istanbul ignore next */
const _alt = (fa, that) => pipe(fa, alt(that));
const _reduce = (fa, b, f) => pipe(fa, reduce(b, f));
/* istanbul ignore next */
const _foldMap = (M) => {
    const foldMapM = foldMap(M);
    return (fa, f) => pipe(fa, foldMapM(f));
};
/* istanbul ignore next */
const _reduceRight = (fa, b, f) => pipe(fa, reduceRight(b, f));
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
const _filterMapWithIndex = (fa, f) => pipe(fa, filterMapWithIndex(f));
/* istanbul ignore next */
const _filterWithIndex = (fa, predicateWithIndex) => pipe(fa, filterWithIndex(predicateWithIndex));
/* istanbul ignore next */
const _extend = (fa, f) => pipe(fa, extend(f));
/* istanbul ignore next */
const _traverse = (F) => {
    const traverseF = traverse(F);
    return (ta, f) => pipe(ta, traverseF(f));
};
/* istanbul ignore next */
const _traverseWithIndex = (F) => {
    const traverseWithIndexF = traverseWithIndex(F);
    return (ta, f) => pipe(ta, traverseWithIndexF(f));
};
const _chainRecDepthFirst = RA._chainRecDepthFirst;
const _chainRecBreadthFirst = RA._chainRecBreadthFirst;
/**
 * Given an element of the base type, `of` builds an `Array` containing just that
 * element of the base type (this is useful for building a `Monad`).
 *
 * @example
 * import { of } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(of("a"), ["a"]);
 *
 * @category constructors
 * @since 2.0.0
 */
export const of = NEA.of;
/**
 * Makes an empty `Array`, useful for building a [`Monoid`](#Monoid)
 *
 * @since 2.7.0
 */
export const zero = () => [];
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: Array<A>) => Array<B>`.
 * In practice it applies the base function to each element of the array and collects the
 * results in a new array.
 *
 * @example
 * import { map } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (n: number) => n * 2;
 * assert.deepStrictEqual(pipe([1, 2, 3], map(f)), [2, 4, 6]);
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => fa.map((a) => f(a));
/**
 * @example
 * import { ap, map, of } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * // a curried function with 3 input parameteres
 * const f = (s1: string) => (n: number) => (s2: string) => s1 + n + s2;
 *
 * // let's use `ap` to iterate `f` over an array for each input parameter
 * assert.deepStrictEqual(pipe(["a", "b"], map(f), ap([1, 2]), ap(["😀", "😫", "😎"])), [
 *   "a1😀", "a1😫", "a1😎",
 *   "a2😀", "a2😫", "a2😎",
 *   "b1😀", "b1😫", "b1😎",
 *   "b2😀", "b2😫", "b2😎",
 * ]);
 *
 * // given Array implements the Applicative interface with the `of` method,
 * // we can write exactly the same thing in a more symmetric way
 * // using `of` on `f` and `ap` on each array in input
 * assert.deepStrictEqual(
 *   pipe(of(f), ap(["a", "b"]), ap([1, 2]), ap(["😀", "😫", "😎"])),
 *   pipe(["a", "b"], map(f), ap([1, 2]), ap(["😀", "😫", "😎"]))
 * );
 *
 * @since 2.0.0
 */
export const ap = (fa) => flatMap((f) => pipe(fa, map(f)));
/**
 * Composes computations in sequence, using the return value of one computation to
 * determine the next computation.
 *
 * In other words it takes a function `f` that produces an array from a single element of
 * the base type `A` and returns a new function which applies `f` to each element of the
 * input array (like [`map`](#map)) and, instead of returning an array of arrays, concatenates the
 * results into a single array (like [`flatten`](#flatten)).
 *
 * @example
 * import { flatMap, map, replicate } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (n: number) => replicate(n, `${n}`);
 * assert.deepStrictEqual(pipe([1, 2, 3], map(f)), [["1"], ["2", "2"], ["3", "3", "3"]]);
 * assert.deepStrictEqual(pipe([1, 2, 3], flatMap(f)), ["1", "2", "2", "3", "3", "3"]);
 *
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => pipe(ma, chainWithIndex((i, a) => f(a, i))));
/**
 * Takes an array of arrays of `A` and flattens them into an array of `A`
 * by concatenating the elements of each array in order.
 *
 * @example
 * import { flatten } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(flatten([["a"], ["b", "c"], ["d", "e", "f"]]), ["a", "b", "c", "d", "e", "f"]);
 *
 * @category sequencing
 * @since 2.5.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * Same as [`map`](#map), but the iterating function takes both the index and the value
 * of the element.
 *
 * @example
 * import { mapWithIndex } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (i: number, s: string) => `${s} - ${i}`;
 * assert.deepStrictEqual(pipe(["a", "b", "c"], mapWithIndex(f)), ["a - 0", "b - 1", "c - 2"]);
 *
 * @category mapping
 * @since 2.0.0
 */
export const mapWithIndex = (f) => (fa) => fa.map((a, i) => f(i, a));
/**
 * Maps an array with an iterating function that takes the index and the value of
 * each element and returns an `Option`. It keeps only the `Some` values discarding
 * the `None`s.
 *
 * Same as [`filterMap`](#filterMap), but with an iterating function which takes also
 * the index as input.
 *
 * @example
 * import { filterMapWithIndex } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 * import { option } from "fp-ts";
 *
 * const f = (i: number, s: string) => (i % 2 === 1 ? option.some(s.toUpperCase()) : option.none);
 * assert.deepStrictEqual(pipe(["a", "no", "neither", "b"], filterMapWithIndex(f)), ["NO", "B"]);
 *
 * @category filtering
 * @since 2.0.0
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
 * Maps an array with an iterating function that returns an `Option`
 * and it keeps only the `Some` values discarding the `None`s.
 *
 * @example
 * import { filterMap } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 * import { option } from "fp-ts";
 *
 * const f = (s: string) => s.length === 1 ? option.some(s.toUpperCase()) : option.none;
 * assert.deepStrictEqual(pipe(["a", "no", "neither", "b"], filterMap(f)), ["A", "B"]);
 *
 * @category filtering
 * @since 2.0.0
 */
export const filterMap = (f) => filterMapWithIndex((_, a) => f(a));
/**
 * Compact an array of `Option`s discarding the `None` values and
 * keeping the `Some` values. It returns a new array containing the values of
 * the `Some` options.
 *
 * @example
 * import { compact } from 'fp-ts/Array'
 * import { option } from "fp-ts";
 *
 * assert.deepStrictEqual(compact([option.some("a"), option.none, option.some("b")]), ["a", "b"]);
 *
 * @category filtering
 * @since 2.0.0
 */
export const compact = /*#__PURE__*/ filterMap(identity);
/**
 * Separate an array of `Either`s into `Left`s and `Right`s, creating two new arrays:
 * one containing all the left values and one containing all the right values.
 *
 * @example
 * import { separate } from 'fp-ts/Array'
 * import { either } from "fp-ts";
 *
 * assert.deepStrictEqual(separate([either.right("r1"), either.left("l1"), either.right("r2")]), {
 *   left: ["l1"],
 *   right: ["r1", "r2"],
 * });
 *
 * @category filtering
 * @since 2.0.0
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
 * Given an iterating function that is a `Predicate` or a `Refinement`,
 * `filter` creates a new `Array` containing the elements of the original
 * `Array` for which the iterating function is `true`.
 *
 * @example
 * import { filter } from 'fp-ts/Array'
 * import { isString } from "fp-ts/lib/string";
 *
 * assert.deepStrictEqual(filter(isString)(["a", 1, {}, "b", 5]), ["a", "b"]);
 * assert.deepStrictEqual(filter((x:number) => x > 0)([-3, 1, -2, 5]), [1, 5]);
 *
 * @category filtering
 * @since 2.0.0
 */
export const filter = (predicate) => (as) => as.filter(predicate);
/**
 * Given an iterating function that is a `Predicate` or a `Refinement`,
 * `partition` creates two new `Array`s: `right` containing the elements of the original
 * `Array` for which the iterating function is `true`, `left` containing the elements
 * for which it is false.
 *
 * @example
 * import { partition } from 'fp-ts/Array'
 * import { isString } from "fp-ts/lib/string";
 *
 * assert.deepStrictEqual(partition(isString)(["a", 1, {}, "b", 5]), { left: [1, {}, 5], right: ["a", "b"] });
 * assert.deepStrictEqual(partition((x: number) => x > 0)([-3, 1, -2, 5]), { left: [-3, -2], right: [1, 5] });
 *
 * @category filtering
 * @since 2.0.0
 */
export const partition = (predicate) => partitionWithIndex((_, a) => predicate(a));
/**
 * Same as [`partition`](#partition), but passing also the index to the iterating function.
 *
 * @example
 * import { partitionWithIndex } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(partitionWithIndex((index, x: number) => index < 3 && x > 0)([-2, 5, 6, 7]), {
 *   left: [-2, 7],
 *   right: [5, 6],
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const partitionWithIndex = (predicateWithIndex) => (as) => {
    const left = [];
    const right = [];
    for (let i = 0; i < as.length; i++) {
        const b = as[i];
        if (predicateWithIndex(i, b)) {
            right.push(b);
        }
        else {
            left.push(b);
        }
    }
    return separated(left, right);
};
/**
 * Given an iterating function that returns an `Either`,
 * `partitionMap` applies the iterating function to each element and it creates two `Array`s:
 * `right` containing the values of `Right` results, `left` containing the values of `Left` results.
 *
 * @example
 * import { partitionMap } from 'fp-ts/Array'
 * import { Either, left, right } from "fp-ts/lib/Either";
 *
 * const upperIfString = <B>(x: B): Either<B, string> =>
 *   typeof x === "string" ? right(x.toUpperCase()) : left(x);
 * assert.deepStrictEqual(partitionMap(upperIfString)([-2, "hello", 6, 7, "world"]), {
 *   left: [-2, 6, 7],
 *   right: [ 'HELLO', 'WORLD' ],
 * });
 *
 * @category filtering
 * @since 2.0.0
 */
export const partitionMap = (f) => partitionMapWithIndex((_, a) => f(a));
/**
 * Same as [`partitionMap`](#partitionMap), but passing also the index to the iterating function.
 *
 * @example
 * import { partitionMapWithIndex } from 'fp-ts/Array'
 * import { Either, left, right } from "fp-ts/lib/Either";
 *
 * const upperIfStringBefore3 = <B>(index: number, x: B): Either<B, string> =>
 *   index < 3 && typeof x === "string" ? right(x.toUpperCase()) : left(x);
 * assert.deepStrictEqual(partitionMapWithIndex(upperIfStringBefore3)([-2, "hello", 6, 7, "world"]), {
 *   left: [-2, 6, 7, "world"],
 *   right: ["HELLO"],
 * });
 *
 * @category filtering
 * @since 2.0.0
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
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @example
 * import * as A from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     A.altW(() => ['a', 'b'])
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
 * In case of `Array` concatenates the inputs into a single array.
 *
 * @example
 * import * as A from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     A.alt(() => [4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
export const alt = altW;
/**
 * Same as [`filter`](#filter), but passing also the index to the iterating function.
 *
 * @example
 * import { filterWithIndex } from 'fp-ts/Array';
 *
 * const f = (index: number, x: number) => x > 0 && index <= 2;
 * assert.deepStrictEqual(filterWithIndex(f)([-3, 1, -2, 5]), [1]);
 *
 * @category filtering
 * @since 2.0.0
 */
export const filterWithIndex = (predicateWithIndex) => (as) => as.filter((b, i) => predicateWithIndex(i, b));
/**
 * Given an iterating function that takes `Array<A>` as input, `extend` returns
 * an array containing the results of the iterating function applied to the whole input
 * `Array`, then to the input `Array` without the first element, then to the input
 * `Array` without the first two elements, etc.
 *
 * @example
 * import { extend } from 'fp-ts/Array'
 *
 * const f = (a: string[]) => a.join(",");
 * assert.deepStrictEqual(extend(f)(["a", "b", "c"]), ["a,b,c", "b,c", "c"]);
 *
 * @since 2.0.0
 */
export const extend = (f) => (wa) => wa.map((_, i) => f(wa.slice(i)));
/**
 * `duplicate` returns an array containing the whole input `Array`,
 * then to the input `Array` dropping the first element, then to the input
 * `Array` dropping the first two elements, etc.
 *
 * @example
 * import { duplicate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(duplicate(["a", "b", "c"]), [["a", "b", "c"], ["b", "c"], ["c"]]);
 *
 * @since 2.0.0
 */
export const duplicate = /*#__PURE__*/ extend(identity);
/**
 * Map and fold an `Array`.
 * Map the `Array` passing each value to the iterating function.
 * Then fold the results using the provided `Monoid`.
 *
 * @example
 * import { foldMap } from 'fp-ts/Array'
 *
 * const monoid = { concat: (a: string, b: string) => a + b, empty: "" };
 * const f = (s: string) => s.toUpperCase()
 * assert.deepStrictEqual(foldMap(monoid)(f)(["a", "b", "c"]), "ABC");
 *
 * @category folding
 * @since 2.0.0
 */
export const foldMap = RA.foldMap;
/**
 * Same as [`foldMap`](#foldMap) but passing also the index to the iterating function.
 *
 * @example
 * import { foldMapWithIndex } from 'fp-ts/Array'
 *
 * const monoid = { concat: (a: string, b: string) => a + b, empty: "" };
 * const f = (index:number, s: string) => `${s.toUpperCase()}(${index})`
 * assert.deepStrictEqual(foldMapWithIndex(monoid)(f)(["a", "b", "c"]), "A(0)B(1)C(2)");
 *
 * @category folding
 * @since 2.0.0
 */
export const foldMapWithIndex = RA.foldMapWithIndex;
/**
 * Reduces an `Array`.
 *
 * `reduce` executes the supplied iterating function on each element of the array,
 * in order, passing in the element and the return value from the calculation on the preceding element.
 *
 * The first time that the iterating function is called there is no "return value of the
 * previous calculation", the initial value is used in its place.
 *
 * @example
 * import { reduce } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(reduce(5, (acc: number, cur: number) => acc * cur)([2, 3]), 5 * 2 * 3);
 *
 * @category folding
 * @since 2.0.0
 */
export const reduce = RA.reduce;
/**
 * Same as [`reduce`](#reduce) but passing also the index to the iterating function.
 *
 * @example
 * import { reduceWithIndex } from 'fp-ts/Array'
 *
 * const f = (index: number, acc: string, cur: unknown) =>
 *   acc + (typeof cur === "string" ? cur.toUpperCase() + index : "");
 * assert.deepStrictEqual(reduceWithIndex("", f)([2, "a", "b", null]), "A1B2");
 *
 * @category folding
 * @since 2.0.0
 */
export const reduceWithIndex = RA.reduceWithIndex;
/**
 * Same as [`reduce`](#reduce) but applied from the end to the start.
 *
 * *Note*: the iterating function in this case takes the accumulator as the last argument.
 *
 * @example
 * import { reduceRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(reduceRight("", (cur: string, acc: string) => acc + cur)(["a", "b", "c"]), "cba");
 *
 * @category folding
 * @since 2.0.0
 */
export const reduceRight = RA.reduceRight;
/**
 * Same as [`reduceRight`](#reduceRight) but passing also the index to the iterating function.
 *
 * @example
 * import { reduceRightWithIndex } from 'fp-ts/Array'
 *
 * const f = (index: number, cur: unknown, acc: string) =>
 *   acc + (typeof cur === "string" ? cur.toUpperCase() + index : "");
 * assert.deepStrictEqual(reduceRightWithIndex("", f)([2, "a", "b", null]), "B2A1");
 *
 * @category folding
 * @since 2.0.0
 */
export const reduceRightWithIndex = RA.reduceRightWithIndex;
/**
 * Given an iterating function that returns a `HKT` (higher kinded type), `traverse`
 * applies the iterating function to each element of the `Array` and then [`sequence`](#sequence)-s
 * the results using the provided `Applicative`.
 *
 * E.g. suppose you have an `Array` and you want to format each element with a function
 * that returns a result or an error as `f = (a: A) => Either<Error, B>`, using `traverse`
 * you can apply `f` to all elements and directly obtain as a result an `Either<Error,Array<B>>`
 * i.e. an `Array<B>` if all the results are `B`, or an `Error` if some of the results
 * are `Error`s.
 *
 * @example
 * import { traverse } from 'fp-ts/Array'
 * import { Applicative, left, right } from "fp-ts/lib/Either";
 *
 * const f = (x: unknown) =>
 *   typeof x === "string" ? right(x.toUpperCase()) : left(new Error("not a string"));
 * assert.deepStrictEqual(traverse(Applicative)(f)(["a", "b"]), right(["A", "B"]));
 * assert.deepStrictEqual(traverse(Applicative)(f)(["a", 5]), left(new Error("not a string")));
 *
 * @category traversing
 * @since 2.6.3
 */
export const traverse = (F) => {
    const traverseWithIndexF = traverseWithIndex(F);
    return (f) => traverseWithIndexF((_, a) => f(a));
};
/**
 * `sequence` takes an `Array` where elements are `HKT<A>` (higher kinded type) and,
 * using an applicative of that `HKT`, returns an `HKT` of `Array<A>`.
 * E.g. it can turn an `Array<Either<Error, string>>` into an `Either<Error, Array<string>>`.
 *
 * `sequence` requires an `Applicative` of the `HKT` you are targeting, e.g. to turn an
 * `Array<Either<E, A>>` into an `Either<E, Array<A>>`, it needs an
 * `Applicative` for `Either`, to to turn an `Array<Option<A>>` into an `Option<Array<A>>`,
 * it needs an `Applicative` for `Option`.
 *
 * @example
 * import { sequence } from 'fp-ts/Array'
 * import { Applicative, left, right } from "fp-ts/lib/Either";
 *
 * assert.deepStrictEqual(sequence(Applicative)([right("a"), right("b")]), right(["a", "b"]));
 * assert.deepStrictEqual(
 *   sequence(Applicative)([right("a"), left(new Error("not a string"))]),
 *   left(new Error("not a string"))
 * );
 *
 * @category traversing
 * @since 2.6.3
 */
export const sequence = (F) => (ta) => {
    return _reduce(ta, F.of(zero()), (fas, fa) => F.ap(F.map(fas, (as) => (a) => pipe(as, append(a))), fa));
};
/**
 * Same as [`traverse`](#traverse) but passing also the index to the iterating function.
 *
 * @example
 * import { traverseWithIndex } from 'fp-ts/Array'
 * import { Applicative, left, right } from "fp-ts/lib/Either";
 *
 * const f = (index:number, x:unknown) =>
 *   typeof x === "string" ? right(x.toUpperCase() + index) : left(new Error("not a string"));
 * assert.deepStrictEqual(traverseWithIndex(Applicative)(f)(["a", "b"]), right(["A0", "B1"]));
 * assert.deepStrictEqual(traverseWithIndex(Applicative)(f)(["a", 5]), left(new Error("not a string")));
 *
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
 * `unfold` takes a function `f` which returns an `Option` of a tuple containing an outcome
 * value and an input for the following iteration.
 * `unfold` applies `f` to the initial value `b` and then recursively to the second
 * element of the tuple contained in the returned `option` of the previous
 * calculation until `f` returns `Option.none`.
 *
 * @example
 * import { unfold } from 'fp-ts/Array'
 * import { option } from 'fp-ts'
 *
 * const f = (n: number) => {
 *   if (n <= 0) return option.none;
 *   const returnValue = n * 2;
 *   const inputForNextRound = n - 1;
 *   return option.some([returnValue, inputForNextRound] as const);
 * };
 * assert.deepStrictEqual(unfold(5, f), [10, 8, 6, 4, 2]);
 *
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
 * @since 2.0.0
 */
export const URI = 'Array';
/**
 * `getShow` makes a `Show` for an `Array<A>` from a `Show` for
 * an `A`.
 *
 * @example
 * import { getShow } from 'fp-ts/Array'
 *
 * const numShow = { show: (n: number) => (n >= 0 ? `${n}` : `(${-n})`) };
 * assert.deepStrictEqual(getShow(numShow).show([-2, -1, 0, 1]), "[(2), (1), 0, 1]");
 *
 * @category instances
 * @since 2.0.0
 */
export const getShow = RA.getShow;
/**
 * Get a `Semigroup` based on the concatenation of `Array`s.
 * See also [`getMonoid`](#getMonoid).
 *
 * @example
 * import { getSemigroup } from 'fp-ts/Array'
 *
 * const S = getSemigroup<number>();
 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [1, 2, 2, 3]);
 *
 * @category instances
 * @since 2.10.0
 */
export const getSemigroup = () => ({
    concat: (first, second) => first.concat(second)
});
/**
 * Returns a `Monoid` for `Array<A>` based on the concatenation of `Array`s.
 *
 * @example
 * import { getMonoid } from 'fp-ts/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.0.0
 */
export const getMonoid = () => ({
    concat: getSemigroup().concat,
    empty: []
});
/**
 * Derives an `Eq` over the `Array` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/Array'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.0.0
 */
export const getEq = RA.getEq;
/**
 * Derives an `Ord` over the `Array` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/Array'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 * @category instances
 * @since 2.0.0
 */
export const getOrd = RA.getOrd;
/**
 * Get a `Semigroup` based on the union of the elements of `Array`s.
 * Elements which equal according to the provided `Eq` are included
 * only once in the result.
 * See also [`getUnionMonoid`](#getUnionMonoid).
 *
 * @example
 * import { getUnionSemigroup } from 'fp-ts/Array';
 * import { Eq } from 'fp-ts/number';
 *
 * const S = getUnionSemigroup<number>(Eq);
 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [1, 2, 3]);
 *
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
 * Get a `Monoid` based on the union of the elements of `Array`s.
 * Elements which equal according to the provided `Eq` are included
 * only once in the result.
 *
 * @example
 * import { getUnionMonoid } from 'fp-ts/Array'
 * import { Eq } from 'fp-ts/number';
 *
 * const M = getUnionMonoid<number>(Eq);
 * assert.deepStrictEqual(M.concat([1, 2], [2, 3]), [1, 2, 3]);
 * assert.deepStrictEqual(M.empty,[]);
 *
 * @category instances
 * @since 2.11.0
 */
export const getUnionMonoid = (E) => ({
    concat: getUnionSemigroup(E).concat,
    empty: []
});
/**
 * Get a `Semigroup` based on the intersection of the elements of `Array`s.
 * Only elements present in the two arrays which are equal according to the
 * provided `Eq` are included in the result.
 *
 * @example
 * import { getIntersectionSemigroup } from 'fp-ts/Array'
 * import { Eq } from 'fp-ts/number';
 *
 * const S = getIntersectionSemigroup<number>(Eq);
 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [2]);
 *
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
 * Get a `Magma` for `Array` where the `concat` function is the differnce between
 * the first and the second array, i.e. the result contains all the elements of the
 * first array for which their is no equal element in the second array according
 * to the `Eq` provided.
 *
 *
 * @example
 * import { getDifferenceMagma } from 'fp-ts/Array'
 * import { Eq } from 'fp-ts/number';
 *
 * const S = getDifferenceMagma<number>(Eq);
 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [1]);
 *
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
 * Given an input an `Array` of functions, `flap` returns an `Array` containing
 * the results of applying each function to the given input.
 *
 * @example
 * import { flap } from 'fp-ts/Array'
 *
 * const funs = [
 *   (n: number) => `Double: ${n * 2}`,
 *   (n: number) => `Triple: ${n * 3}`,
 *   (n: number) => `Square: ${n * n}`,
 * ];
 * assert.deepStrictEqual(flap(4)(funs), ['Double: 8', 'Triple: 12', 'Square: 16']);
 *
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
 * import * as A from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     A.chainFirst(() => ['a', 'b'])
 *   ),
 *   [1, 1, 2, 2, 3, 3]
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     A.chainFirst(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 2.0.0
 */
export const chainFirst = 
/*#__PURE__*/ chainFirst_(Chain);
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
 * @category sequencing
 * @since 2.11.0
 */
export const chainRecDepthFirst = RA.chainRecDepthFirst;
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
export const chainRecBreadthFirst = RA.chainRecBreadthFirst;
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
/**
 * Filter values inside a context.
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
 * @since 2.0.0
 */
export const unsafeInsertAt = NEA.unsafeInsertAt;
/**
 * @category unsafe
 * @since 2.0.0
 */
export const unsafeUpdateAt = (i, a, as) => isNonEmpty(as) ? NEA.unsafeUpdateAt(i, a, as) : [];
/**
 * @category unsafe
 * @since 2.0.0
 */
export const unsafeDeleteAt = (i, as) => {
    const xs = as.slice();
    xs.splice(i, 1);
    return xs;
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * `every` tells if the provided predicate holds true for every element in the `Array`.
 *
 * @example
 * import { every } from 'fp-ts/Array'
 *
 * assert.equal(every((x: number) => x >= 0)([1, 2, 3]), true);
 * assert.equal(every((x: number) => x >= 0)([-1, 2, 3]), false);
 *
 * @since 2.9.0
 */
export const every = RA.every;
/**
 * `some` tells if the provided predicate holds true at least for one element in the `Array`.
 *
 * @example
 * import { some } from 'fp-ts/Array'
 *
 * assert.equal(some((x: number) => x >= 0)([1, 2, 3]), true);
 * assert.equal(some((x: number) => x >= 10)([1, 2, 3]), false);
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
 * Places an element in between members of an `Array`, then folds the results using the provided `Monoid`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { intercalate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 2.12.0
 */
export const intercalate = RA.intercalate;
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
 * Use `NonEmptyArray` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const range = NEA.range;
/**
 * Use a new `[]` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const empty = [];
/**
 * Use `prepend` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const cons = NEA.cons;
/**
 * Use `append` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const snoc = NEA.snoc;
/**
 * Use `prependAll` instead
 *
 * @category zone of death
 * @since 2.9.0
 * @deprecated
 */
export const prependToAll = prependAll;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `A.Functor` instead of `A.array`
 * (where `A` is from `import A from 'fp-ts/Array'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const array = {
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
//# sourceMappingURL=Array.js.map