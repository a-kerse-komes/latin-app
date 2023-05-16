import { identity } from './function.js';
import * as RS from './ReadonlySet.js';
import { separated } from './Separated.js';
/**
 * @category instances
 * @since 2.0.0
 */
export const getShow = RS.getShow;
/**
 * @category instances
 * @since 2.0.0
 */
export const getEq = RS.getEq;
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @since 2.0.0
 */
export function map(E) {
    const elemE = elem(E);
    return (f) => (set) => {
        const r = new Set();
        set.forEach((e) => {
            const v = f(e);
            if (!elemE(v, r)) {
                r.add(v);
            }
        });
        return r;
    };
}
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @since 2.0.0
 */
export function chain(E) {
    const elemE = elem(E);
    return (f) => (set) => {
        const r = new Set();
        set.forEach((e) => {
            f(e).forEach((e) => {
                if (!elemE(e, r)) {
                    r.add(e);
                }
            });
        });
        return r;
    };
}
export function filter(predicate) {
    return (set) => {
        const values = set.values();
        let e;
        const r = new Set();
        while (!(e = values.next()).done) {
            const a = e.value;
            if (predicate(a)) {
                r.add(a);
            }
        }
        return r;
    };
}
export function partition(predicate) {
    return (set) => {
        const values = set.values();
        let e;
        const right = new Set();
        const left = new Set();
        while (!(e = values.next()).done) {
            const a = e.value;
            if (predicate(a)) {
                right.add(a);
            }
            else {
                left.add(a);
            }
        }
        return separated(left, right);
    };
}
export function union(E) {
    const elemE = elem(E);
    return (me, that) => {
        if (that === undefined) {
            const unionE = union(E);
            return (that) => unionE(me, that);
        }
        if (isEmpty(me)) {
            return that;
        }
        if (isEmpty(that)) {
            return me;
        }
        const r = new Set(me);
        that.forEach((e) => {
            if (!elemE(e, r)) {
                r.add(e);
            }
        });
        return r;
    };
}
export function intersection(E) {
    const elemE = elem(E);
    return (me, that) => {
        if (that === undefined) {
            const intersectionE = intersection(E);
            return (that) => intersectionE(that, me);
        }
        if (isEmpty(me) || isEmpty(that)) {
            return new Set();
        }
        const r = new Set();
        me.forEach((e) => {
            if (elemE(e, that)) {
                r.add(e);
            }
        });
        return r;
    };
}
/**
 * @since 2.0.0
 */
export function partitionMap(EB, EC) {
    return (f) => (set) => {
        const values = set.values();
        let e;
        const left = new Set();
        const right = new Set();
        const hasB = elem(EB);
        const hasC = elem(EC);
        while (!(e = values.next()).done) {
            const v = f(e.value);
            switch (v._tag) {
                case 'Left':
                    if (!hasB(v.left, left)) {
                        left.add(v.left);
                    }
                    break;
                case 'Right':
                    if (!hasC(v.right, right)) {
                        right.add(v.right);
                    }
                    break;
            }
        }
        return separated(left, right);
    };
}
export function difference(E) {
    const elemE = elem(E);
    return (me, that) => {
        if (that === undefined) {
            const differenceE = difference(E);
            return (that) => differenceE(that, me);
        }
        return filter((a) => !elemE(a, that))(me);
    };
}
/**
 * @category instances
 * @since 2.11.0
 */
export const getUnionSemigroup = (E) => ({
    concat: union(E)
});
/**
 * @category instances
 * @since 2.0.0
 */
export const getUnionMonoid = (E) => ({
    concat: getUnionSemigroup(E).concat,
    empty: new Set()
});
/**
 * @category instances
 * @since 2.0.0
 */
export const getIntersectionSemigroup = (E) => ({
    concat: intersection(E)
});
/**
 * @category instances
 * @since 2.11.0
 */
export const getDifferenceMagma = (E) => ({
    concat: difference(E)
});
/**
 * @category folding
 * @since 2.0.0
 */
export const reduce = RS.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
export const foldMap = RS.foldMap;
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceRight = RS.reduceRight;
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.0.0
 */
export const singleton = (a) => new Set([a]);
/**
 * Insert a value into a set
 *
 * @since 2.0.0
 */
export function insert(E) {
    const elemE = elem(E);
    return (a) => (set) => {
        if (!elemE(a)(set)) {
            const r = new Set(set);
            r.add(a);
            return r;
        }
        else {
            return set;
        }
    };
}
/**
 * Delete a value from a set
 *
 * @since 2.0.0
 */
export const remove = (E) => (a) => (set) => filter((ax) => !E.equals(a, ax))(set);
/**
 * Checks an element is a member of a set;
 * If yes, removes the value from the set
 * If no, inserts the value to the set
 *
 * @since 2.5.0
 */
export const toggle = (E) => {
    const elemE = elem(E);
    const removeE = remove(E);
    const insertE = insert(E);
    return (a) => (set) => (elemE(a, set) ? removeE : insertE)(a)(set);
};
/**
 * Create a set from an array
 *
 * @category conversions
 * @since 2.0.0
 */
export const fromArray = (E) => (as) => {
    const len = as.length;
    const out = new Set();
    const has = elem(E);
    for (let i = 0; i < len; i++) {
        const a = as[i];
        if (!has(a, out)) {
            out.add(a);
        }
    }
    return out;
};
/**
 * @since 2.0.0
 */
export const compact = (E) => filterMap(E)(identity);
/**
 * @since 2.0.0
 */
export function separate(EE, EA) {
    return (fa) => {
        const elemEE = elem(EE);
        const elemEA = elem(EA);
        const left = new Set();
        const right = new Set();
        fa.forEach((e) => {
            switch (e._tag) {
                case 'Left':
                    if (!elemEE(e.left, left)) {
                        left.add(e.left);
                    }
                    break;
                case 'Right':
                    if (!elemEA(e.right, right)) {
                        right.add(e.right);
                    }
                    break;
            }
        });
        return separated(left, right);
    };
}
/**
 * @since 2.0.0
 */
export function filterMap(E) {
    const elemE = elem(E);
    return (f) => (fa) => {
        const r = new Set();
        fa.forEach((a) => {
            const ob = f(a);
            if (ob._tag === 'Some' && !elemE(ob.value, r)) {
                r.add(ob.value);
            }
        });
        return r;
    };
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export const empty = new Set();
/**
 * Test whether a `Set` is empty.
 *
 * @since 2.10.0
 */
export const isEmpty = (set) => set.size === 0;
/**
 * Calculate the number of elements in a `Set`.
 *
 * @since 2.10.0
 */
export const size = (set) => set.size;
/**
 * @since 2.0.0
 */
export const some = RS.some;
/**
 * @since 2.0.0
 */
export const every = RS.every;
/**
 * @since 2.10.0
 */
export const isSubset = RS.isSubset;
// TODO: remove non-curried overloading in v3
/**
 * Test if a value is a member of a set
 *
 * @since 2.0.0
 */
export const elem = RS.elem;
/**
 * Get a sorted `Array` of the values contained in a `Set`.
 *
 * @category conversions
 * @since 2.0.0
 */
export const toArray = (O) => (set) => {
    const out = [];
    set.forEach((e) => out.push(e));
    return out.sort(O.compare);
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`isSubset`](#issubset) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const subset = RS.isSubset;
//# sourceMappingURL=Set.js.map