import { fromEquals } from './Eq.js';
import { identity } from './function.js';
import { not } from './Predicate.js';
import { separated } from './Separated.js';
/**
 * @category conversions
 * @since 2.5.0
 */
export const fromSet = (s) => new Set(s);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Create a set with one element
 *
 * @category constructors
 * @since 2.5.0
 */
export const singleton = (a) => new Set([a]);
/**
 * Create a `ReadonlySet` from a `ReadonlyArray`
 *
 * @category conversions
 * @since 2.10.0
 */
export const fromReadonlyArray = (E) => (as) => {
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
 * @category conversions
 * @since 2.5.0
 */
export function toSet(s) {
    return new Set(s);
}
/**
 * Projects a Set through a function
 *
 * @since 2.5.0
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
 * @since 2.5.0
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
            return empty;
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
 * @since 2.5.0
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
 * @since 2.5.0
 */
export function reduce(O) {
    const toReadonlyArrayO = toReadonlyArray(O);
    return (b, f) => (fa) => toReadonlyArrayO(fa).reduce(f, b);
}
/**
 * @since 2.5.0
 */
export function foldMap(O, M) {
    const toReadonlyArrayO = toReadonlyArray(O);
    return (f) => (fa) => toReadonlyArrayO(fa).reduce((b, a) => M.concat(b, f(a)), M.empty);
}
/**
 * @category folding
 * @since 2.11.0
 */
export const reduceRight = (O) => {
    const toReadonlyArrayO = toReadonlyArray(O);
    return (b, f) => (fa) => toReadonlyArrayO(fa).reduceRight((b, a) => f(a, b), b);
};
/**
 * Insert a value into a set
 *
 * @since 2.5.0
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
 * @since 2.5.0
 */
export const remove = (E) => (a) => (set) => filter((ax) => !E.equals(a, ax))(set);
/**
 * Checks an element is a member of a set;
 * If yes, removes the value from the set
 * If no, inserts the value to the set
 *
 * @since 2.10.0
 */
export const toggle = (E) => {
    const elemE = elem(E);
    const removeE = remove(E);
    const insertE = insert(E);
    return (a) => (set) => (elemE(a, set) ? removeE : insertE)(a)(set);
};
/**
 * @since 2.5.0
 */
export const compact = (E) => filterMap(E)(identity);
/**
 * @since 2.5.0
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
 * @since 2.5.0
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
 * @since 2.5.0
 */
export const empty = new Set();
/**
 * Test whether a `ReadonlySet` is empty.
 *
 * @since 2.10.0
 */
export const isEmpty = (set) => set.size === 0;
/**
 * Calculate the number of elements in a `ReadonlySet`.
 *
 * @since 2.10.0
 */
export const size = (set) => set.size;
/**
 * @since 2.5.0
 */
export const some = (predicate) => (set) => {
    const values = set.values();
    let e;
    let found = false;
    while (!found && !(e = values.next()).done) {
        found = predicate(e.value);
    }
    return found;
};
export function every(predicate) {
    return not(some(not(predicate)));
}
export function isSubset(E) {
    const elemE = elem(E);
    return (me, that) => {
        if (that === undefined) {
            const isSubsetE = isSubset(E);
            return (that) => isSubsetE(that, me);
        }
        return every((a) => elemE(a, that))(me);
    };
}
export function elem(E) {
    return (a, set) => {
        if (set === undefined) {
            const elemE = elem(E);
            return (set) => elemE(a, set);
        }
        const values = set.values();
        let e;
        let found = false;
        while (!found && !(e = values.next()).done) {
            found = E.equals(a, e.value);
        }
        return found;
    };
}
/**
 * Get a sorted `ReadonlyArray` of the values contained in a `ReadonlySet`.
 *
 * @category conversions
 * @since 2.5.0
 */
export const toReadonlyArray = (O) => (set) => {
    const out = [];
    set.forEach((e) => out.push(e));
    return out.sort(O.compare);
};
/**
 * @category type lambdas
 * @since 2.11.0
 */
export const URI = 'ReadonlySet';
/**
 * @category instances
 * @since 2.5.0
 */
export function getShow(S) {
    return {
        show: (s) => {
            const entries = [];
            s.forEach((a) => {
                entries.push(S.show(a));
            });
            return `new Set([${entries.sort().join(', ')}])`;
        }
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
export function getEq(E) {
    const subsetE = isSubset(E);
    return fromEquals((x, y) => subsetE(x, y) && subsetE(y, x));
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
 * @since 2.5.0
 */
export const getUnionMonoid = (E) => ({
    concat: getUnionSemigroup(E).concat,
    empty
});
/**
 * @category instances
 * @since 2.5.0
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
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`fromReadonlyArray`](#fromreadonlyarray) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const fromArray = fromReadonlyArray;
//# sourceMappingURL=ReadonlySet.js.map