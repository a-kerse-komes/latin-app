import { fromEquals } from './Eq.js';
import { pipe, SK } from './function.js';
import { flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
import * as O from './Option.js';
import { separated } from './Separated.js';
import { wiltDefault, witherDefault } from './Witherable.js';
/**
 * @category conversions
 * @since 2.5.0
 */
export const fromMap = (m) => new Map(m);
/**
 * @category conversions
 * @since 2.5.0
 */
export function toMap(m) {
    return new Map(m);
}
/**
 * @category instances
 * @since 2.5.0
 */
export function getShow(SK, SA) {
    return {
        show: (m) => {
            const entries = [];
            m.forEach((a, k) => {
                entries.push(`[${SK.show(k)}, ${SA.show(a)}]`);
            });
            return `new Map([${entries.sort().join(', ')}])`;
        }
    };
}
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.5.0
 */
export const size = (m) => m.size;
/**
 * Test whether or not a map is empty
 *
 * @since 2.5.0
 */
export const isEmpty = (m) => m.size === 0;
export function member(E) {
    const lookupE = lookup(E);
    return (k, m) => {
        if (m === undefined) {
            const memberE = member(E);
            return (m) => memberE(k, m);
        }
        return _.isSome(lookupE(k, m));
    };
}
export function elem(E) {
    return (a, m) => {
        if (m === undefined) {
            const elemE = elem(E);
            return (m) => elemE(a, m);
        }
        const values = m.values();
        let e;
        while (!(e = values.next()).done) {
            const v = e.value;
            if (E.equals(a, v)) {
                return true;
            }
        }
        return false;
    };
}
/**
 * Get a sorted `ReadonlyArray` of the keys contained in a `ReadonlyMap`.
 *
 * @since 2.5.0
 */
export const keys = (O) => (m) => Array.from(m.keys()).sort(O.compare);
/**
 * Get a sorted `ReadonlyArray` of the values contained in a `ReadonlyMap`.
 *
 * @since 2.5.0
 */
export const values = (O) => (m) => Array.from(m.values()).sort(O.compare);
/**
 * @since 2.5.0
 */
export function collect(O) {
    const keysO = keys(O);
    return (f) => (m) => {
        const out = [];
        const ks = keysO(m);
        for (const key of ks) {
            out.push(f(key, m.get(key)));
        }
        return out;
    };
}
/**
 * Get a sorted `ReadonlyArray` of the key/value pairs contained in a `ReadonlyMap`.
 *
 * @category conversions
 * @since 2.5.0
 */
export const toReadonlyArray = (O) => collect(O)((k, a) => [k, a]);
export function toUnfoldable(ord, U) {
    const toReadonlyArrayO = toReadonlyArray(ord);
    return (d) => {
        const kas = toReadonlyArrayO(d);
        const len = kas.length;
        return U.unfold(0, (b) => (b < len ? _.some([kas[b], b + 1]) : _.none));
    };
}
/**
 * Insert or replace a key/value pair in a `ReadonlyMap`.
 *
 * @since 2.10.0
 */
export const upsertAt = (E) => {
    const lookupWithKeyE = lookupWithKey(E);
    return (k, a) => {
        const lookupWithKeyEk = lookupWithKeyE(k);
        return (m) => {
            const found = lookupWithKeyEk(m);
            if (_.isNone(found)) {
                const out = new Map(m);
                out.set(k, a);
                return out;
            }
            else if (found.value[1] !== a) {
                const out = new Map(m);
                out.set(found.value[0], a);
                return out;
            }
            return m;
        };
    };
};
/**
 * Delete a key and value from a map
 *
 * @since 2.5.0
 */
export const deleteAt = (E) => {
    const lookupWithKeyE = lookupWithKey(E);
    return (k) => (m) => {
        const found = lookupWithKeyE(k, m);
        if (_.isSome(found)) {
            const r = new Map(m);
            r.delete(found.value[0]);
            return r;
        }
        return m;
    };
};
/**
 * @since 2.5.0
 */
export const updateAt = (E) => {
    const modifyAtE = modifyAt(E);
    return (k, a) => modifyAtE(k, () => a);
};
/**
 * @since 2.5.0
 */
export const modifyAt = (E) => {
    const lookupWithKeyE = lookupWithKey(E);
    return (k, f) => (m) => {
        const found = lookupWithKeyE(k, m);
        if (_.isNone(found)) {
            return _.none;
        }
        const [fk, fv] = found.value;
        const next = f(fv);
        if (next === fv) {
            return _.some(m);
        }
        const r = new Map(m);
        r.set(fk, next);
        return _.some(r);
    };
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 *
 * @since 2.5.0
 */
export function pop(E) {
    const lookupE = lookup(E);
    const deleteAtE = deleteAt(E);
    return (k) => {
        const deleteAtEk = deleteAtE(k);
        return (m) => pipe(lookupE(k, m), O.map((a) => [a, deleteAtEk(m)]));
    };
}
export function lookupWithKey(E) {
    return (k, m) => {
        if (m === undefined) {
            const lookupWithKeyE = lookupWithKey(E);
            return (m) => lookupWithKeyE(k, m);
        }
        const entries = m.entries();
        let e;
        while (!(e = entries.next()).done) {
            const [ka, a] = e.value;
            if (E.equals(ka, k)) {
                return _.some([ka, a]);
            }
        }
        return _.none;
    };
}
export function lookup(E) {
    const lookupWithKeyE = lookupWithKey(E);
    return (k, m) => {
        if (m === undefined) {
            const lookupE = lookup(E);
            return (m) => lookupE(k, m);
        }
        return pipe(lookupWithKeyE(k, m), O.map(([_, a]) => a));
    };
}
export function isSubmap(SK, SA) {
    const lookupWithKeyS = lookupWithKey(SK);
    return (me, that) => {
        if (that === undefined) {
            const isSubmapSKSA = isSubmap(SK, SA);
            return (that) => isSubmapSKSA(that, me);
        }
        const entries = me.entries();
        let e;
        while (!(e = entries.next()).done) {
            const [k, a] = e.value;
            const d2OptA = lookupWithKeyS(k, that);
            if (_.isNone(d2OptA) || !SK.equals(k, d2OptA.value[0]) || !SA.equals(a, d2OptA.value[1])) {
                return false;
            }
        }
        return true;
    };
}
/**
 * @since 2.5.0
 */
export const empty = 
// the type annotation here is intended (otherwise it doesn't type-check)
new Map();
/**
 * @category instances
 * @since 2.5.0
 */
export function getEq(SK, SA) {
    const isSubmapSKSA = isSubmap(SK, SA);
    return fromEquals((x, y) => isSubmapSKSA(x, y) && isSubmapSKSA(y, x));
}
/**
 * Gets `Monoid` instance for Maps given `Semigroup` instance for their values
 *
 * @category instances
 * @since 2.5.0
 */
export function getMonoid(SK, SA) {
    const lookupWithKeyS = lookupWithKey(SK);
    return {
        concat: (mx, my) => {
            if (isEmpty(mx)) {
                return my;
            }
            if (isEmpty(my)) {
                return mx;
            }
            const r = new Map(mx);
            const entries = my.entries();
            let e;
            while (!(e = entries.next()).done) {
                const [k, a] = e.value;
                const mxOptA = lookupWithKeyS(k, mx);
                if (_.isSome(mxOptA)) {
                    r.set(mxOptA.value[0], SA.concat(mxOptA.value[1], a));
                }
                else {
                    r.set(k, a);
                }
            }
            return r;
        },
        empty
    };
}
/**
 * Create a map with one key/value pair
 *
 * @category constructors
 * @since 2.5.0
 */
export const singleton = (k, a) => new Map([[k, a]]);
export function fromFoldable(E, M, F) {
    return (fka) => {
        const lookupWithKeyE = lookupWithKey(E);
        return F.reduce(fka, new Map(), (b, [k, a]) => {
            const bOpt = lookupWithKeyE(k, b);
            if (_.isSome(bOpt)) {
                b.set(bOpt.value[0], M.concat(bOpt.value[1], a));
            }
            else {
                b.set(k, a);
            }
            return b;
        });
    };
}
const _mapWithIndex = (fa, f) => {
    const m = new Map();
    const entries = fa.entries();
    let e;
    while (!(e = entries.next()).done) {
        const [key, a] = e.value;
        m.set(key, f(key, a));
    }
    return m;
};
/**
 * @since 2.10.0
 */
export const partitionMapWithIndex = (f) => (fa) => {
    const left = new Map();
    const right = new Map();
    const entries = fa.entries();
    let e;
    while (!(e = entries.next()).done) {
        const [k, a] = e.value;
        const ei = f(k, a);
        if (_.isLeft(ei)) {
            left.set(k, ei.left);
        }
        else {
            right.set(k, ei.right);
        }
    }
    return separated(left, right);
};
export function partitionWithIndex(predicateWithIndex) {
    return (m) => {
        const left = new Map();
        const right = new Map();
        const entries = m.entries();
        let e;
        while (!(e = entries.next()).done) {
            const [k, a] = e.value;
            if (predicateWithIndex(k, a)) {
                right.set(k, a);
            }
            else {
                left.set(k, a);
            }
        }
        return separated(left, right);
    };
}
/**
 * @since 2.10.0
 */
export const filterMapWithIndex = (f) => (fa) => {
    const m = new Map();
    const entries = fa.entries();
    let e;
    while (!(e = entries.next()).done) {
        const [k, a] = e.value;
        const o = f(k, a);
        if (_.isSome(o)) {
            m.set(k, o.value);
        }
    }
    return m;
};
export function filterWithIndex(predicateWithIndex) {
    return (m) => {
        const out = new Map();
        const entries = m.entries();
        let e;
        while (!(e = entries.next()).done) {
            const [k, a] = e.value;
            if (predicateWithIndex(k, a)) {
                out.set(k, a);
            }
        }
        return out;
    };
}
const _map = (fa, f) => _mapWithIndex(fa, (_, a) => f(a));
const _filter = (fa, p) => _filterWithIndex(fa, (_, a) => p(a));
const _filterMap = (fa, f) => _filterMapWithIndex(fa, (_, a) => f(a));
const _partition = (fa, predicate) => _partitionWithIndex(fa, (_, a) => predicate(a));
const _partitionMap = (fa, f) => _partitionMapWithIndex(fa, (_, a) => f(a));
const _filterWithIndex = (fa, p) => pipe(fa, filterWithIndex(p));
const _filterMapWithIndex = (fa, f) => pipe(fa, filterMapWithIndex(f));
const _partitionWithIndex = (fa, p) => pipe(fa, partitionWithIndex(p));
const _partitionMapWithIndex = (fa, f) => pipe(fa, partitionMapWithIndex(f));
/**
 * @category filtering
 * @since 2.5.0
 */
export const compact = (fa) => {
    const m = new Map();
    const entries = fa.entries();
    let e;
    while (!(e = entries.next()).done) {
        const [k, oa] = e.value;
        if (_.isSome(oa)) {
            m.set(k, oa.value);
        }
    }
    return m;
};
/**
 * @category filtering
 * @since 2.5.0
 */
export const filter = (predicate) => (fa) => _filter(fa, predicate);
/**
 * @category filtering
 * @since 2.5.0
 */
export const filterMap = (f) => (fa) => _filterMap(fa, f);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.5.0
 */
export const map = (f) => (fa) => _map(fa, f);
/**
 * @category mapping
 * @since 2.7.1
 */
export const mapWithIndex = (f) => (fa) => _mapWithIndex(fa, f);
/**
 * @category filtering
 * @since 2.5.0
 */
export const partition = (predicate) => (fa) => _partition(fa, predicate);
/**
 * @category filtering
 * @since 2.5.0
 */
export const partitionMap = (f) => (fa) => _partitionMap(fa, f);
/**
 * @category filtering
 * @since 2.5.0
 */
export const separate = (fa) => {
    const left = new Map();
    const right = new Map();
    const entries = fa.entries();
    let e;
    while (!(e = entries.next()).done) {
        const [k, ei] = e.value;
        if (_.isLeft(ei)) {
            left.set(k, ei.left);
        }
        else {
            right.set(k, ei.right);
        }
    }
    return separated(left, right);
};
/**
 * @category type lambdas
 * @since 2.5.0
 */
export const URI = 'ReadonlyMap';
/**
 * @category instances
 * @since 2.11.0
 */
export const getUnionSemigroup = (E, S) => {
    const unionES = union(E, S);
    return {
        concat: (first, second) => unionES(second)(first)
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
export const getUnionMonoid = (E, S) => ({
    concat: getUnionSemigroup(E, S).concat,
    empty
});
/**
 * @category instances
 * @since 2.11.0
 */
export const getIntersectionSemigroup = (E, S) => {
    const intersectionES = intersection(E, S);
    return {
        concat: (first, second) => intersectionES(second)(first)
    };
};
/**
 * @category instances
 * @since 2.11.0
 */
export const getDifferenceMagma = (E) => () => {
    const differenceE = difference(E);
    return {
        concat: (first, second) => differenceE(second)(first)
    };
};
/**
 * @category filtering
 * @since 2.5.0
 */
export function getFilterableWithIndex() {
    return {
        URI,
        _E: undefined,
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
export const getFunctorWithIndex = () => ({
    URI,
    _E: undefined,
    map: _map,
    mapWithIndex: _mapWithIndex
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
 * @category folding
 * @since 2.11.0
 */
export const reduce = (O) => {
    const reduceWithIndexO = reduceWithIndex(O);
    return (b, f) => reduceWithIndexO(b, (_, b, a) => f(b, a));
};
/**
 * @category folding
 * @since 2.11.0
 */
export const foldMap = (O) => {
    const foldMapWithIndexO = foldMapWithIndex(O);
    return (M) => {
        const foldMapWithIndexOM = foldMapWithIndexO(M);
        return (f) => foldMapWithIndexOM((_, a) => f(a));
    };
};
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceRight = (O) => {
    const reduceRightWithIndexO = reduceRightWithIndex(O);
    return (b, f) => reduceRightWithIndexO(b, (_, b, a) => f(b, a));
};
/**
 * @category folding
 * @since 2.10.0
 */
export const getFoldable = (O) => {
    const reduceO = reduce(O);
    const foldMapO = foldMap(O);
    const reduceRightO = reduceRight(O);
    return {
        URI,
        _E: undefined,
        reduce: (fa, b, f) => pipe(fa, reduceO(b, f)),
        foldMap: (M) => {
            const foldMapOM = foldMapO(M);
            return (fa, f) => pipe(fa, foldMapOM(f));
        },
        reduceRight: (fa, b, f) => pipe(fa, reduceRightO(b, f))
    };
};
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceWithIndex = (O) => {
    const keysO = keys(O);
    return (b, f) => (m) => {
        let out = b;
        for (const k of keysO(m)) {
            out = f(k, out, m.get(k));
        }
        return out;
    };
};
/**
 * @category folding
 * @since 2.11.0
 */
export const foldMapWithIndex = (O) => {
    const keysO = keys(O);
    return (M) => (f) => (m) => {
        let out = M.empty;
        for (const k of keysO(m)) {
            out = M.concat(out, f(k, m.get(k)));
        }
        return out;
    };
};
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceRightWithIndex = (O) => {
    const keysO = keys(O);
    return (b, f) => (m) => {
        let out = b;
        const ks = keysO(m);
        const len = ks.length;
        for (let i = len - 1; i >= 0; i--) {
            const k = ks[i];
            out = f(k, m.get(k), out);
        }
        return out;
    };
};
/**
 * @category folding
 * @since 2.10.0
 */
export const getFoldableWithIndex = (O) => {
    const F = getFoldable(O);
    const reduceWithIndexO = reduceWithIndex(O);
    const foldMapWithIndexO = foldMapWithIndex(O);
    const reduceRightWithIndexO = reduceRightWithIndex(O);
    return {
        URI,
        _E: undefined,
        reduce: F.reduce,
        foldMap: F.foldMap,
        reduceRight: F.reduceRight,
        reduceWithIndex: (fa, b, f) => pipe(fa, reduceWithIndexO(b, f)),
        foldMapWithIndex: (M) => {
            const foldMapWithIndexOM = foldMapWithIndexO(M);
            return (fa, f) => pipe(fa, foldMapWithIndexOM(f));
        },
        reduceRightWithIndex: (fa, b, f) => pipe(fa, reduceRightWithIndexO(b, f))
    };
};
/**
 * @category traversing
 * @since 2.10.0
 */
export const getTraversable = (O) => {
    const TWI = getTraversableWithIndex(O);
    const F = getFoldable(O);
    return {
        URI,
        _E: undefined,
        map: _map,
        reduce: F.reduce,
        foldMap: F.foldMap,
        reduceRight: F.reduceRight,
        traverse: TWI.traverse,
        sequence: TWI.sequence
    };
};
/**
 * @category traversing
 * @since 2.10.0
 */
export const getTraversableWithIndex = (O) => {
    const FWI = getFoldableWithIndex(O);
    const keysO = keys(O);
    const traverseWithIndex = (F) => {
        return (ta, f) => {
            let fm = F.of(new Map());
            const ks = keysO(ta);
            const len = ks.length;
            for (let i = 0; i < len; i++) {
                const key = ks[i];
                const a = ta.get(key);
                fm = F.ap(F.map(fm, (m) => (b) => m.set(key, b)), f(key, a));
            }
            return fm;
        };
    };
    const traverse = (F) => {
        const traverseWithIndexF = traverseWithIndex(F);
        return (ta, f) => traverseWithIndexF(ta, (_, a) => f(a));
    };
    const sequence = (F) => {
        const traverseWithIndexF = traverseWithIndex(F);
        return (ta) => traverseWithIndexF(ta, SK);
    };
    return {
        URI,
        _E: undefined,
        map: _map,
        mapWithIndex: _mapWithIndex,
        reduce: FWI.reduce,
        foldMap: FWI.foldMap,
        reduceRight: FWI.reduceRight,
        reduceWithIndex: FWI.reduceWithIndex,
        foldMapWithIndex: FWI.foldMapWithIndex,
        reduceRightWithIndex: FWI.reduceRightWithIndex,
        traverse,
        sequence,
        traverseWithIndex
    };
};
/**
 * @category filtering
 * @since 2.5.0
 */
export function getWitherable(O) {
    const TWI = getTraversableWithIndex(O);
    return {
        URI,
        _E: undefined,
        map: _map,
        compact,
        separate,
        filter: _filter,
        filterMap: _filterMap,
        partition: _partition,
        partitionMap: _partitionMap,
        reduce: TWI.reduce,
        foldMap: TWI.foldMap,
        reduceRight: TWI.reduceRight,
        traverse: TWI.traverse,
        sequence: TWI.sequence,
        mapWithIndex: _mapWithIndex,
        reduceWithIndex: TWI.reduceWithIndex,
        foldMapWithIndex: TWI.foldMapWithIndex,
        reduceRightWithIndex: TWI.reduceRightWithIndex,
        traverseWithIndex: TWI.traverseWithIndex,
        wilt: wiltDefault(TWI, Compactable),
        wither: witherDefault(TWI, Compactable)
    };
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export const union = (E, M) => {
    const lookupE = lookup(E);
    return (second) => (first) => {
        if (isEmpty(first)) {
            return second;
        }
        if (isEmpty(second)) {
            return first;
        }
        const out = new Map();
        const firstEntries = first.entries();
        let e;
        while (!(e = firstEntries.next()).done) {
            const [k, a] = e.value;
            const oka = lookupE(k)(second);
            if (_.isSome(oka)) {
                out.set(k, M.concat(a, oka.value));
            }
            else {
                out.set(k, a);
            }
        }
        const secondEntries = second.entries();
        while (!(e = secondEntries.next()).done) {
            const [k, a] = e.value;
            const oka = lookupE(k)(out);
            if (_.isNone(oka)) {
                out.set(k, a);
            }
        }
        return out;
    };
};
/**
 * @since 2.11.0
 */
export const intersection = (E, M) => {
    const lookupE = lookup(E);
    return (second) => (first) => {
        if (isEmpty(first) || isEmpty(second)) {
            return empty;
        }
        const out = new Map();
        const entries = first.entries();
        let e;
        while (!(e = entries.next()).done) {
            const [k, a] = e.value;
            const oka = lookupE(k)(second);
            if (_.isSome(oka)) {
                out.set(k, M.concat(a, oka.value));
            }
        }
        return out;
    };
};
/**
 * @since 2.11.0
 */
export const difference = (E) => {
    const memberE = member(E);
    return (second) => (first) => {
        if (isEmpty(first)) {
            return second;
        }
        if (isEmpty(second)) {
            return first;
        }
        const out = new Map();
        const firstEntries = first.entries();
        let e;
        while (!(e = firstEntries.next()).done) {
            const [k, a] = e.value;
            if (!memberE(k)(second)) {
                out.set(k, a);
            }
        }
        const secondEntries = second.entries();
        while (!(e = secondEntries.next()).done) {
            const [k, a] = e.value;
            if (!memberE(k)(first)) {
                out.set(k, a);
            }
        }
        return out;
    };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const insertAt = upsertAt;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RM.Functor` instead of `RM.readonlyMap`
 * (where `RM` is from `import RM from 'fp-ts/ReadonlyMap'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const readonlyMap = {
    URI,
    map: _map,
    compact,
    separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
//# sourceMappingURL=ReadonlyMap.js.map