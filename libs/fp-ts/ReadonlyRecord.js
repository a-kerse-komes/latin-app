import { fromEquals } from './Eq.js';
import { flow, identity, pipe, SK } from './function.js';
import { flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
import { separated } from './Separated.js';
import * as S from './string.js';
import { wiltDefault, witherDefault } from './Witherable.js';
/**
 * Builds a `ReadonlyRecord` by copying a `Record`.
 *
 * @example
 * import { ReadonlyRecord, fromRecord } from "fp-ts/ReadonlyRecord"
 *
 * const x: Record<string, number> = { a: 1, b: 2 };
 * const y: ReadonlyRecord<string, number> = fromRecord(x);
 * assert.deepStrictEqual(x,y);
 * // `y.a = 5` gives compiler error
 *
 * @category conversions
 * @since 2.5.0
 */
export const fromRecord = (r) => Object.assign({}, r);
/**
 * Builds a mutable `Record` from a `ReadonlyRecord`.
 *
 * @example
 * import { ReadonlyRecord, toRecord } from "fp-ts/ReadonlyRecord"
 *
 * const x: ReadonlyRecord<string, number> = { a: 1, b: 2 };
 * const y: Record<string, number> = toRecord(x);
 * assert.deepStrictEqual(x,y);
 * y.a = 5; // it's ok, y is mutable
 *
 * @category conversions
 * @since 2.5.0
 */
export const toRecord = (r) => Object.assign({}, r);
/**
 * Calculate the number of key/value pairs in a `ReadonlyRecord`,
 *
 * @example
 * import { size } from "fp-ts/ReadonlyRecord";
 *
 * assert.deepStrictEqual(size({ a: true, b: 2, c: "three" }), 3);
 *
 * @since 2.5.0
 */
export const size = (r) => Object.keys(r).length;
/**
 * Test whether a `ReadonlyRecord` is empty.
 *
 * @example
 * import { isEmpty } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(isEmpty({}), true);
 * assert.deepStrictEqual(isEmpty({ a: 3 }), false);
 * @since 2.5.0
 */
export const isEmpty = (r) => {
    for (const k in r) {
        if (_.has.call(r, k)) {
            return false;
        }
    }
    return true;
};
const keys_ = (O) => (r) => Object.keys(r).sort(O.compare);
/**
 * @since 2.5.0
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
 * Get a sorted `ReadonlyArray` of the key/value pairs contained in a `ReadonlyRecord`.
 *
 * @example
 * import { toReadonlyArray } from 'fp-ts/ReadonlyRecord'
 *
 * const x = { c: 3, a: "foo", b: false };
 * assert.deepStrictEqual(toReadonlyArray(x), [
 *   ["a", "foo"],
 *   ["b", false],
 *   ["c", 3],
 * ]);
 *
 * @category conversions
 * @since 2.5.0
 */
export const toReadonlyArray = 
/*#__PURE__*/ collect(S.Ord)((k, a) => [k, a]);
export function toUnfoldable(U) {
    return (r) => {
        const sas = toReadonlyArray(r);
        const len = sas.length;
        return U.unfold(0, (b) => (b < len ? _.some([sas[b], b + 1]) : _.none));
    };
}
/**
 * Insert or replace a key/value pair in a `ReadonlyRecord`.
 *
 * @example
 * import { upsertAt } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(upsertAt("a", 5)({ a: 1, b: 2 }), { a: 5, b: 2 });
 * assert.deepStrictEqual(upsertAt("c", 5)({ a: 1, b: 2 }), { a: 1, b: 2, c: 5 });
 *
 * @since 2.10.0
 */
export const upsertAt = (k, a) => (r) => {
    if (_.has.call(r, k) && r[k] === a) {
        return r;
    }
    const out = Object.assign({}, r);
    out[k] = a;
    return out;
};
/**
 * Test whether or not a key exists in a `ReadonlyRecord`.
 *
 * Note. This function is not pipeable because is a `Refinement`.
 *
 * @example
 * import { has } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(has("a", { a: 1, b: 2 }), true);
 * assert.deepStrictEqual(has("c", { a: 1, b: 2 }), false);
 *
 * @since 2.10.0
 */
export const has = (k, r) => _.has.call(r, k);
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
 * Replace a key/value pair in a `ReadonlyRecord`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { updateAt } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(updateAt("a", 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(updateAt("c", 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.5.0
 */
export const updateAt = (k, a) => (r) => {
    if (!has(k, r)) {
        return _.none;
    }
    if (r[k] === a) {
        return _.some(r);
    }
    const out = Object.assign({}, r);
    out[k] = a;
    return _.some(out);
};
/**
 * Applies a mapping function to one specific key/value pair in a `ReadonlyRecord`.
 *
 * @returns If the specified key exists it returns an `Option` containing a new `Record`
 * with the entry updated, otherwise it returns `None`
 *
 * @example
 * import { modifyAt } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(modifyAt("a", (x: number) => x * 3)({ a: 1, b: 2 }), option.some({ a: 3, b: 2 }));
 * assert.deepStrictEqual(modifyAt("c", (x: number) => x * 3)({ a: 1, b: 2 }), option.none);
 *
 * @since 2.5.0
 */
export const modifyAt = (k, f) => (r) => {
    if (!has(k, r)) {
        return _.none;
    }
    const next = f(r[k]);
    if (next === r[k]) {
        return _.some(r);
    }
    const out = Object.assign({}, r);
    out[k] = next;
    return _.some(out);
};
export function pop(k) {
    const deleteAtk = deleteAt(k);
    return (r) => {
        const oa = lookup(k, r);
        return _.isNone(oa) ? _.none : _.some([oa.value, deleteAtk(r)]);
    };
}
export function isSubrecord(E) {
    return (me, that) => {
        if (that === undefined) {
            const isSubrecordE = isSubrecord(E);
            return (that) => isSubrecordE(that, me);
        }
        for (const k in me) {
            if (!_.has.call(that, k) || !E.equals(me[k], that[k])) {
                return false;
            }
        }
        return true;
    };
}
export function lookup(k, r) {
    if (r === undefined) {
        return (r) => lookup(k, r);
    }
    return _.has.call(r, k) ? _.some(r[k]) : _.none;
}
/**
 * @since 2.5.0
 */
export const empty = {};
export function mapWithIndex(f) {
    return (r) => {
        const out = {};
        for (const k in r) {
            if (_.has.call(r, k)) {
                out[k] = f(k, r[k]);
            }
        }
        return out;
    };
}
export function map(f) {
    return mapWithIndex((_, a) => f(a));
}
export function reduceWithIndex(...args) {
    if (args.length === 2) {
        return reduceWithIndex(S.Ord)(...args);
    }
    const keysO = keys_(args[0]);
    return (b, f) => (fa) => {
        let out = b;
        const ks = keysO(fa);
        const len = ks.length;
        for (let i = 0; i < len; i++) {
            const k = ks[i];
            out = f(k, out, fa[k]);
        }
        return out;
    };
}
export function foldMapWithIndex(O) {
    if ('compare' in O) {
        const keysO = keys_(O);
        return (M) => (f) => (fa) => {
            let out = M.empty;
            const ks = keysO(fa);
            const len = ks.length;
            for (let i = 0; i < len; i++) {
                const k = ks[i];
                out = M.concat(out, f(k, fa[k]));
            }
            return out;
        };
    }
    return foldMapWithIndex(S.Ord)(O);
}
export function reduceRightWithIndex(...args) {
    if (args.length === 2) {
        return reduceRightWithIndex(S.Ord)(...args);
    }
    const keysO = keys_(args[0]);
    return (b, f) => (fa) => {
        let out = b;
        const ks = keysO(fa);
        const len = ks.length;
        for (let i = len - 1; i >= 0; i--) {
            const k = ks[i];
            out = f(k, fa[k], out);
        }
        return out;
    };
}
/**
 * Create a `ReadonlyRecord` with one key/value pair.
 *
 * @example
 * import { singleton } from "fp-ts/ReadonlyRecord";
 *
 * assert.deepStrictEqual(singleton("a", 1), { a: 1 });
 *
 * @category constructors
 * @since 2.5.0
 */
export const singleton = (k, a) => ({ [k]: a });
export function traverseWithIndex(F) {
    const traverseWithIndexOF = _traverseWithIndex(S.Ord)(F);
    return (f) => (ta) => traverseWithIndexOF(ta, f);
}
export function traverse(F) {
    const traverseOF = _traverse(S.Ord)(F);
    return (f) => (ta) => traverseOF(ta, f);
}
export function sequence(F) {
    return _sequence(S.Ord)(F);
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
export function partitionMapWithIndex(f) {
    return (r) => {
        const left = {};
        const right = {};
        for (const k in r) {
            if (_.has.call(r, k)) {
                const e = f(k, r[k]);
                switch (e._tag) {
                    case 'Left':
                        left[k] = e.left;
                        break;
                    case 'Right':
                        right[k] = e.right;
                        break;
                }
            }
        }
        return separated(left, right);
    };
}
export function partitionWithIndex(predicateWithIndex) {
    return (r) => {
        const left = {};
        const right = {};
        for (const k in r) {
            if (_.has.call(r, k)) {
                const a = r[k];
                if (predicateWithIndex(k, a)) {
                    right[k] = a;
                }
                else {
                    left[k] = a;
                }
            }
        }
        return separated(left, right);
    };
}
export function filterMapWithIndex(f) {
    return (r) => {
        const out = {};
        for (const k in r) {
            if (_.has.call(r, k)) {
                const ob = f(k, r[k]);
                if (_.isSome(ob)) {
                    out[k] = ob.value;
                }
            }
        }
        return out;
    };
}
export function filterWithIndex(predicateWithIndex) {
    return (fa) => {
        const out = {};
        let changed = false;
        for (const key in fa) {
            if (_.has.call(fa, key)) {
                const a = fa[key];
                if (predicateWithIndex(key, a)) {
                    out[key] = a;
                }
                else {
                    changed = true;
                }
            }
        }
        return changed ? out : fa;
    };
}
export function fromFoldable(M, F) {
    const fromFoldableMapM = fromFoldableMap(M, F);
    return (fka) => fromFoldableMapM(fka, identity);
}
export function fromFoldableMap(M, F) {
    return (ta, f) => {
        return F.reduce(ta, {}, (r, a) => {
            const [k, b] = f(a);
            r[k] = _.has.call(r, k) ? M.concat(r[k], b) : b;
            return r;
        });
    };
}
/**
 * Alias of [`toReadonlyArray`](#toreadonlyarray).
 *
 * @example
 * import { toEntries } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(toEntries({ b: 2, a: 1 }), [['a', 1], ['b', 2]])
 *
 * @category conversions
 * @since 2.12.0
 */
export const toEntries = toReadonlyArray;
/**
 * Converts a `ReadonlyArray` of `[key, value]` tuples into a `ReadonlyRecord`.
 *
 * @example
 * import { fromEntries } from 'fp-ts/ReadonlyRecord'
 *
 * assert.deepStrictEqual(fromEntries([['a', 1], ['b', 2], ['a', 3]]), { b: 2, a: 3 })
 *
 * @since 2.12.0
 * @category conversions
 */
export const fromEntries = (fa) => {
    const out = {};
    for (const a of fa) {
        out[a[0]] = a[1];
    }
    return out;
};
export function every(predicate) {
    return (r) => {
        for (const k in r) {
            if (!predicate(r[k])) {
                return false;
            }
        }
        return true;
    };
}
/**
 * Test if at least one value in a `ReadonlyRecord` satisfies the predicate.
 *
 * @example
 * import { some } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: 1, b: -2 }), true);
 * assert.deepStrictEqual(some((n: number) => n >= 0)({ a: -1, b: -2 }), false);
 *
 * @since 2.5.0
 */
export function some(predicate) {
    return (r) => {
        for (const k in r) {
            if (predicate(r[k])) {
                return true;
            }
        }
        return false;
    };
}
export function elem(E) {
    return (a, fa) => {
        if (fa === undefined) {
            const elemE = elem(E);
            return (fa) => elemE(a, fa);
        }
        for (const k in fa) {
            if (E.equals(fa[k], a)) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Union of two `ReadonlyRecord`s.
 * Takes two `ReadonlyRecord`s and produces a `ReadonlyRecord` combining all the
 * entries of the two inputs.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements with the same key.
 *
 * @example
 * import { union } from "fp-ts/ReadonlyRecord";
 * import { Magma } from "fp-ts/Magma";
 *
 * const m1: Magma<number> = { concat: (x: number, y: number) => x + y };
 * assert.deepStrictEqual(union(m1)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 4, b: 2, c: 3 });
 * const m2: Magma<number> = { concat: (x: number) => x };
 * assert.deepStrictEqual(union(m2)({ a: 3, c: 3 })({ a: 1, b: 2 }), { a: 1, b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export const union = (M) => (second) => (first) => {
    if (isEmpty(first)) {
        return second;
    }
    if (isEmpty(second)) {
        return first;
    }
    const out = {};
    for (const k in first) {
        if (has(k, second)) {
            out[k] = M.concat(first[k], second[k]);
        }
        else {
            out[k] = first[k];
        }
    }
    for (const k in second) {
        if (!has(k, out)) {
            out[k] = second[k];
        }
    }
    return out;
};
/**
 * Intersection of two `ReadonlyRecord`s.
 * Takes two `ReadonlyRecord`s and produces a `ReadonlyRecord` combining only the
 * entries of the two inputswith the same key.
 * It uses the `concat` function of the provided `Magma` to
 * combine the elements.
 *
 * @example
 * import { intersection } from "fp-ts/ReadonlyRecord";
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
        return empty;
    }
    const out = {};
    for (const k in first) {
        if (has(k, second)) {
            out[k] = M.concat(first[k], second[k]);
        }
    }
    return out;
};
/**
 * Difference between two `ReadonlyRecord`s.
 * Takes two `ReadonlyRecord`s and produces a `ReadonlyRecord` composed by the
 * entries of the two inputs, removing the entries with the same
 * key in both inputs.
 *
 * @example
 * import { difference } from "fp-ts/ReadonlyRecord";
 *
 * assert.deepStrictEqual(difference({ a: 1 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3 })({ a: 1, b: 2 }), { b: 2 });
 * assert.deepStrictEqual(difference({ a: 3, c: 3 })({ a: 1, b: 2 }), { b: 2, c: 3 });
 *
 * @since 2.11.0
 */
export const difference = (second) => (first) => {
    if (isEmpty(first)) {
        return second;
    }
    if (isEmpty(second)) {
        return first;
    }
    const out = {};
    for (const k in first) {
        if (!has(k, second)) {
            out[k] = first[k];
        }
    }
    for (const k in second) {
        if (!has(k, first)) {
            out[k] = second[k];
        }
    }
    return out;
};
/** @internal */
export const _map = (fa, f) => pipe(fa, map(f));
/** @internal */
/* istanbul ignore next */
export const _mapWithIndex = (fa, f) => pipe(fa, mapWithIndex(f));
/** @internal */
/* istanbul ignore next */
export const _reduce = (O) => {
    const reduceO = reduce(O);
    return (fa, b, f) => pipe(fa, reduceO(b, f));
};
/** @internal */
export const _foldMap = (O) => (M) => {
    const foldMapM = foldMap(O)(M);
    return (fa, f) => pipe(fa, foldMapM(f));
};
/** @internal */
/* istanbul ignore next */
export const _reduceRight = (O) => {
    const reduceRightO = reduceRight(O);
    return (fa, b, f) => pipe(fa, reduceRightO(b, f));
};
/** @internal */
/* istanbul ignore next */
export const _filter = (fa, predicate) => pipe(fa, filter(predicate));
/** @internal */
/* istanbul ignore next */
export const _filterMap = (fa, f) => pipe(fa, filterMap(f));
/** @internal */
/* istanbul ignore next */
export const _partition = (fa, predicate) => pipe(fa, partition(predicate));
/** @internal */
/* istanbul ignore next */
export const _partitionMap = (fa, f) => pipe(fa, partitionMap(f));
/** @internal */
/* istanbul ignore next */
export const _reduceWithIndex = (O) => {
    const reduceWithIndexO = reduceWithIndex(O);
    return (fa, b, f) => pipe(fa, reduceWithIndexO(b, f));
};
/** @internal */
export const _foldMapWithIndex = (O) => {
    const foldMapWithIndexO = foldMapWithIndex(O);
    return (M) => {
        const foldMapWithIndexM = foldMapWithIndexO(M);
        return (fa, f) => pipe(fa, foldMapWithIndexM(f));
    };
};
/** @internal */
/* istanbul ignore next */
export const _reduceRightWithIndex = (O) => {
    const reduceRightWithIndexO = reduceRightWithIndex(O);
    return (fa, b, f) => pipe(fa, reduceRightWithIndexO(b, f));
};
/** @internal */
/* istanbul ignore next */
export const _partitionMapWithIndex = (fa, f) => pipe(fa, partitionMapWithIndex(f));
/** @internal */
/* istanbul ignore next */
export const _partitionWithIndex = (fa, predicateWithIndex) => pipe(fa, partitionWithIndex(predicateWithIndex));
/** @internal */
/* istanbul ignore next */
export const _filterMapWithIndex = (fa, f) => pipe(fa, filterMapWithIndex(f));
/** @internal */
/* istanbul ignore next */
export const _filterWithIndex = (fa, predicateWithIndex) => pipe(fa, filterWithIndex(predicateWithIndex));
/** @internal */
export const _traverse = (O) => {
    const traverseWithIndexO = _traverseWithIndex(O);
    return (F) => {
        const traverseWithIndexOF = traverseWithIndexO(F);
        return (ta, f) => traverseWithIndexOF(ta, flow(SK, f));
    };
};
/** @internal */
export const _sequence = (O) => {
    const traverseO = _traverse(O);
    return (F) => {
        const traverseOF = traverseO(F);
        return (ta) => traverseOF(ta, identity);
    };
};
const _traverseWithIndex = (O) => (F) => {
    const keysO = keys_(O);
    return (ta, f) => {
        const ks = keysO(ta);
        if (ks.length === 0) {
            return F.of(empty);
        }
        let fr = F.of({});
        for (const key of ks) {
            fr = F.ap(F.map(fr, (r) => (b) => Object.assign({}, r, { [key]: b })), f(key, ta[key]));
        }
        return fr;
    };
};
/**
 * Given a `Predicate`, it produces a new `ReadonlyRecord` keeping only the entries with a
 * value that satisfies the provided predicate.
 *
 * @example
 * import { filter } from "fp-ts/ReadonlyRecord"
 *
 * assert.deepStrictEqual(filter((s: string) => s.length < 4)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo",
 *   b: "bar",
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export const filter = (predicate) => filterWithIndex((_, a) => predicate(a));
/**
 * Maps a `ReadonlyRecord` with an iterating function that returns an `Option`
 * and it keeps only the `Some` values discarding the `None`s.
 *
 * @example
 * import { filterMap } from "fp-ts/ReadonlyRecord"
 * import { option } from "fp-ts"
 *
 * const f = (s: string) => s.length < 4 ? option.some(`${s} is short`): option.none
 * assert.deepStrictEqual(filterMap(f)({ a: "foo", b: "bar", c: "verylong" }), {
 *   a: "foo is short",
 *   b: "bar is short",
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export const filterMap = (f) => filterMapWithIndex((_, a) => f(a));
/**
 * Partition a `ReadonlyRecord` into two parts according to a `Predicate`.
 *
 * @example
 * import { partition } from "fp-ts/ReadonlyRecord"
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
 * @since 2.5.0
 */
export const partition = (predicate) => partitionWithIndex((_, a) => predicate(a));
/**
 * Maps a `ReadonlyRecord` with a function returning an `Either` and
 * partitions the resulting `ReadonlyRecord` into `Left`s and `Right`s.
 *
 * @example
 * import { partitionMap } from "fp-ts/ReadonlyRecord"
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
 * @since 2.5.0
 */
export const partitionMap = (f) => partitionMapWithIndex((_, a) => f(a));
export function reduce(...args) {
    if (args.length === 1) {
        const reduceWithIndexO = reduceWithIndex(args[0]);
        return (b, f) => reduceWithIndexO(b, (_, b, a) => f(b, a));
    }
    return reduce(S.Ord)(...args);
}
export function foldMap(O) {
    if ('compare' in O) {
        const foldMapWithIndexO = foldMapWithIndex(O);
        return (M) => {
            const foldMapWithIndexM = foldMapWithIndexO(M);
            return (f) => foldMapWithIndexM((_, a) => f(a));
        };
    }
    return foldMap(S.Ord)(O);
}
export function reduceRight(...args) {
    if (args.length === 1) {
        const reduceRightWithIndexO = reduceRightWithIndex(args[0]);
        return (b, f) => reduceRightWithIndexO(b, (_, b, a) => f(b, a));
    }
    return reduceRight(S.Ord)(...args);
}
/**
 * Compact a `ReadonlyRecord` of `Option`s discarding the `None` values and
 * keeping the `Some` values.
 *
 * @example
 * import { compact } from 'fp-ts/ReadonlyRecord'
 * import { option } from 'fp-ts'
 *
 * assert.deepStrictEqual(compact({ a: option.some("foo"), b: option.none, c: option.some("bar") }), {
 *   a: "foo",
 *   c: "bar",
 * });
 *
 * @category filtering
 * @since 2.5.0
 */
export const compact = (r) => {
    const out = {};
    for (const k in r) {
        if (_.has.call(r, k)) {
            const oa = r[k];
            if (_.isSome(oa)) {
                out[k] = oa.value;
            }
        }
    }
    return out;
};
/**
 * Separate a `ReadonlyRecord` of `Either`s into `Left`s and `Right`s.
 *
 * @example
 * import { separate } from 'fp-ts/ReadonlyRecord'
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
 * @since 2.5.0
 */
export const separate = (r) => {
    const left = {};
    const right = {};
    for (const k in r) {
        if (_.has.call(r, k)) {
            const e = r[k];
            if (_.isLeft(e)) {
                left[k] = e.left;
            }
            else {
                right[k] = e.right;
            }
        }
    }
    return separated(left, right);
};
/**
 * @category type lambdas
 * @since 2.5.0
 */
export const URI = 'ReadonlyRecord';
export function getShow(O) {
    if ('compare' in O) {
        return (S) => ({
            show: (r) => {
                const elements = collect(O)((k, a) => `${JSON.stringify(k)}: ${S.show(a)}`)(r).join(', ');
                return elements === '' ? '{}' : `{ ${elements} }`;
            }
        });
    }
    return getShow(S.Ord)(O);
}
export function getEq(E) {
    const isSubrecordE = isSubrecord(E);
    return fromEquals((x, y) => isSubrecordE(x)(y) && isSubrecordE(y)(x));
}
export function getMonoid(S) {
    return {
        concat: (first, second) => {
            if (isEmpty(first)) {
                return second;
            }
            if (isEmpty(second)) {
                return first;
            }
            const r = Object.assign({}, first);
            for (const k in second) {
                if (_.has.call(second, k)) {
                    r[k] = _.has.call(first, k) ? S.concat(first[k], second[k]) : second[k];
                }
            }
            return r;
        },
        empty
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
 * Takes a value and a `ReadonlyRecord` of functions and returns a
 * `ReadonlyRecord` by applying each function to the input value.
 *
 * @example
 * import { flap } from "fp-ts/ReadonlyRecord"
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
 * Produces a `Foldable` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * Produces a `FoldableWithIndex1` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * Produces a `Traversable` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * Produces a `TraversableWithIndex` instance for a `ReadonlyRecord`, using the
 * provided `Ord` to sort the `ReadonlyRecord`'s entries by key.
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
 * in the `ReadonlyRecord` of the base type.
 * The resulting `Semigroup` concatenates two `ReadonlyRecord`s by
 * `union`.
 *
 * @example
 * import { getUnionSemigroup, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sReadonlyRecord: Semigroup<ReadonlyRecord<string, number>> = getUnionSemigroup(sNumber);
 * assert.deepStrictEqual(sReadonlyRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { a: 1, b: -1, c: 4 });
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
 * Returns a `Monoid` instance for `ReadonlyRecord`s given a `Semigroup`
 * instance for the base type.
 * The `Monoid` makes the union of two `ReadonlyRecord`s combining the
 * entries that have the same key with the provided `Semigroup`.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getUnionMonoid } from 'fp-ts/ReadonlyRecord'
 *
 * const M = getUnionMonoid(SemigroupSum);
 * assert.deepStrictEqual(M.concat({ foo: 123, bar: 234 }, { foo: 456, baz: 567 }), { foo: 579 , bar: 234, baz: 567 });
 *
 * @category instances
 * @since 2.11.0
 */
export const getUnionMonoid = (S) => ({
    concat: getUnionSemigroup(S).concat,
    empty
});
/**
 * Given a `Semigroup` in the base type, it produces a `Semigroup`
 * in the `ReadonlyRecord` of the base type.
 * The resulting `Semigroup` concatenates two `ReadonlyRecord`s by
 * `intersection`.
 *
 * @example
 * import { getIntersectionSemigroup, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Semigroup } from "fp-ts/Semigroup"
 *
 * const sNumber: Semigroup<number> = { concat: (x, y) => x - y };
 * const sReadonlyRecord: Semigroup<ReadonlyRecord<string, number>> = getIntersectionSemigroup(sNumber);
 * assert.deepStrictEqual(sReadonlyRecord.concat({ a: 1, b: 2 }, { b: 3, c: 4 }), { b: -1 });
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
 * two `ReadonlyRecord`s by making the `difference`.
 *
 * @example
 * import { getDifferenceMagma, difference, ReadonlyRecord } from "fp-ts/ReadonlyRecord"
 * import { Magma } from "fp-ts/Magma"
 *
 * const r1 = { a: 3, c: 3 };
 * const r2 = { a: 1, b: 2 };
 * const m: Magma<ReadonlyRecord<string, number>> = getDifferenceMagma<number>();
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
 * Use `getTraversableWithIndex` instead.
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
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const insertAt = upsertAt;
export function hasOwnProperty(k, r) {
    return _.has.call(r === undefined ? this : r, k);
}
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RR.Functor` instead of `RR.readonlyRecord`
 * (where `RR` is from `import RR from 'fp-ts/ReadonlyRecord'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const readonlyRecord = {
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
//# sourceMappingURL=ReadonlyRecord.js.map