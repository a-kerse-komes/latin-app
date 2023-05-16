import { pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
import * as _ from './internal.js';
import * as O from './Option.js';
import * as RM from './ReadonlyMap.js';
import { separated } from './Separated.js';
import { wiltDefault, witherDefault } from './Witherable.js';
/**
 * @category instances
 * @since 2.0.0
 */
export const getShow = RM.getShow;
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.0.0
 */
export const size = RM.size;
/**
 * Test whether or not a map is empty
 *
 * @since 2.0.0
 */
export const isEmpty = RM.isEmpty;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a key exists in a map
 *
 * @since 2.0.0
 */
export const member = RM.member;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a value is a member of a map
 *
 * @since 2.0.0
 */
export const elem = RM.elem;
/**
 * Get a sorted `Array` of the keys contained in a `Map`.
 *
 * @since 2.0.0
 */
export const keys = (O) => (m) => Array.from(m.keys()).sort(O.compare);
/**
 * Get a sorted `Array` of the values contained in a `Map`.
 *
 * @since 2.0.0
 */
export const values = (O) => (m) => Array.from(m.values()).sort(O.compare);
/**
 * @since 2.0.0
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
 * Get a sorted `Array` of the key/value pairs contained in a `Map`.
 *
 * @since 2.0.0
 */
export function toArray(O) {
    return collect(O)((k, a) => [k, a]);
}
export function toUnfoldable(ord, U) {
    const toArrayO = toArray(ord);
    return (d) => {
        const kas = toArrayO(d);
        const len = kas.length;
        return U.unfold(0, (b) => (b < len ? _.some([kas[b], b + 1]) : _.none));
    };
}
/**
 * Insert or replace a key/value pair in a `Map`.
 *
 * @since 2.0.0
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
 * @since 2.0.0
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
 * @since 2.0.0
 */
export const updateAt = (E) => {
    const modifyAtE = modifyAt(E);
    return (k, a) => modifyAtE(k, () => a);
};
/**
 * @since 2.0.0
 */
export const modifyAt = (E) => {
    const lookupWithKeyE = lookupWithKey(E);
    return (k, f) => (m) => {
        const found = lookupWithKeyE(k, m);
        if (_.isNone(found)) {
            return _.none;
        }
        const r = new Map(m);
        r.set(found.value[0], f(found.value[1]));
        return _.some(r);
    };
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 *
 * @since 2.0.0
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
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Map`.
 *
 * @since 2.0.0
 */
export const lookup = RM.lookup;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not one `Map` contains all of the keys and values contained in another `Map`
 *
 * @since 2.0.0
 */
export const isSubmap = RM.isSubmap;
/**
 * @category instances
 * @since 2.0.0
 */
export const getEq = RM.getEq;
/**
 * Gets `Monoid` instance for Maps given `Semigroup` instance for their values
 *
 * @category instances
 * @since 2.0.0
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
        empty: new Map()
    };
}
/**
 * Create a map with one key/value pair
 *
 * @since 2.0.0
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
    return (fa) => {
        const left = new Map();
        const right = new Map();
        const entries = fa.entries();
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
export function filterWithIndex(p) {
    return (m) => {
        const out = new Map();
        const entries = m.entries();
        let e;
        while (!(e = entries.next()).done) {
            const [k, a] = e.value;
            if (p(k, a)) {
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
 * @since 2.0.0
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
 * @since 2.0.0
 */
export const filter = (predicate) => (fa) => _filter(fa, predicate);
/**
 * @category filtering
 * @since 2.0.0
 */
export const filterMap = (f) => (fa) => _filterMap(fa, f);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => _map(fa, f);
/**
 * @category mapping
 * @since 2.7.1
 */
export const mapWithIndex = (f) => (fa) => _mapWithIndex(fa, f);
/**
 * @category filtering
 * @since 2.0.0
 */
export const partition = (predicate) => (fa) => _partition(fa, predicate);
/**
 * @category filtering
 * @since 2.0.0
 */
export const partitionMap = (f) => (fa) => _partitionMap(fa, f);
/**
 * @category filtering
 * @since 2.0.0
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
 * @since 2.0.0
 */
export const URI = 'Map';
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
    empty: new Map()
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
 * @since 2.0.0
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
 * @category filtering
 * @since 2.0.0
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
/**
 * @category folding
 * @since 2.11.0
 */
export const reduce = RM.reduce;
/**
 * @category folding
 * @since 2.11.0
 */
export const foldMap = RM.foldMap;
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceRight = RM.reduceRight;
/**
 * @category folding
 * @since 2.11.0
 */
export const getFoldable = (O) => {
    return {
        ...RM.getFoldable(O),
        URI
    };
};
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceWithIndex = RM.reduceWithIndex;
/**
 * @category folding
 * @since 2.11.0
 */
export const foldMapWithIndex = RM.foldMapWithIndex;
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceRightWithIndex = RM.reduceRightWithIndex;
/**
 * @category folding
 * @since 2.10.0
 */
export const getFoldableWithIndex = (O) => {
    return {
        ...RM.getFoldableWithIndex(O),
        URI
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
        return (ta) => traverseWithIndexF(ta, (_, a) => a);
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
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
const copy = (m) => new Map(m);
/**
 * @since 2.11.0
 */
export const union = (E, M) => {
    const unionEM = RM.union(E, M);
    return (second) => (first) => {
        if (isEmpty(first)) {
            return copy(second);
        }
        if (isEmpty(second)) {
            return copy(first);
        }
        return unionEM(second)(first);
    };
};
/**
 * @since 2.11.0
 */
export const intersection = (E, M) => {
    const intersectionEM = RM.intersection(E, M);
    return (second) => (first) => {
        if (isEmpty(first) || isEmpty(second)) {
            return new Map();
        }
        return intersectionEM(second)(first);
    };
};
/**
 * @since 2.11.0
 */
export const difference = (E) => {
    const differenceE = RM.difference(E);
    return (second) => (first) => {
        if (isEmpty(first)) {
            return copy(second);
        }
        if (isEmpty(second)) {
            return copy(first);
        }
        return differenceE(second)(first);
    };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use a `new Map()` instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const empty = new Map();
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const insertAt = upsertAt;
/**
 * Use [`Filterable`](#filterable) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const map_ = Filterable;
//# sourceMappingURL=Map.js.map