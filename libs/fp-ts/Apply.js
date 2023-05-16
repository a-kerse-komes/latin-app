/**
 * The `Apply` class provides the `ap` which is used to apply a function to an argument under a type constructor.
 *
 * `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
 * `f`.
 *
 * Instances must satisfy the following law in addition to the `Functor` laws:
 *
 * 1. Associative composition: `F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) <-> F.ap(fbc, F.ap(fab, fa))`
 *
 * Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (a: string) => (b: number) => (c: boolean) => a + String(b) + String(c)
 * const fa: O.Option<string> = O.some('s')
 * const fb: O.Option<number> = O.some(1)
 * const fc: O.Option<boolean> = O.some(true)
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     // lift a function
 *     O.some(f),
 *     // apply the first argument
 *     O.ap(fa),
 *     // apply the second argument
 *     O.ap(fb),
 *     // apply the third argument
 *     O.ap(fc)
 *   ),
 *   O.some('s1true')
 * )
 *
 * @since 2.0.0
 */
import { tuple } from './function.js';
import * as _ from './internal.js';
export function ap(F, G) {
    return (fa) => (fab) => F.ap(F.map(fab, (gab) => (ga) => G.ap(gab, ga)), fa);
}
export function apFirst(A) {
    return (second) => (first) => A.ap(A.map(first, (a) => () => a), second);
}
export function apSecond(A) {
    return (second) => (first) => A.ap(A.map(first, () => (b) => b), second);
}
export function apS(F) {
    return (name, fb) => (fa) => F.ap(F.map(fa, (a) => (b) => Object.assign({}, a, { [name]: b })), fb);
}
export function getApplySemigroup(F) {
    return (S) => ({
        concat: (first, second) => F.ap(F.map(first, (x) => (y) => S.concat(x, y)), second)
    });
}
function curried(f, n, acc) {
    return function (x) {
        const combined = Array(acc.length + 1);
        for (let i = 0; i < acc.length; i++) {
            combined[i] = acc[i];
        }
        combined[acc.length] = x;
        return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
    };
}
const tupleConstructors = {
    1: (a) => [a],
    2: (a) => (b) => [a, b],
    3: (a) => (b) => (c) => [a, b, c],
    4: (a) => (b) => (c) => (d) => [a, b, c, d],
    5: (a) => (b) => (c) => (d) => (e) => [a, b, c, d, e]
};
function getTupleConstructor(len) {
    if (!_.has.call(tupleConstructors, len)) {
        tupleConstructors[len] = curried(tuple, len - 1, []);
    }
    return tupleConstructors[len];
}
export function sequenceT(F) {
    return (...args) => {
        const len = args.length;
        const f = getTupleConstructor(len);
        let fas = F.map(args[0], f);
        for (let i = 1; i < len; i++) {
            fas = F.ap(fas, args[i]);
        }
        return fas;
    };
}
function getRecordConstructor(keys) {
    const len = keys.length;
    switch (len) {
        case 1:
            return (a) => ({ [keys[0]]: a });
        case 2:
            return (a) => (b) => ({ [keys[0]]: a, [keys[1]]: b });
        case 3:
            return (a) => (b) => (c) => ({ [keys[0]]: a, [keys[1]]: b, [keys[2]]: c });
        case 4:
            return (a) => (b) => (c) => (d) => ({
                [keys[0]]: a,
                [keys[1]]: b,
                [keys[2]]: c,
                [keys[3]]: d
            });
        case 5:
            return (a) => (b) => (c) => (d) => (e) => ({
                [keys[0]]: a,
                [keys[1]]: b,
                [keys[2]]: c,
                [keys[3]]: d,
                [keys[4]]: e
            });
        default:
            return curried((...args) => {
                const r = {};
                for (let i = 0; i < len; i++) {
                    r[keys[i]] = args[i];
                }
                return r;
            }, len - 1, []);
    }
}
export function sequenceS(F) {
    return (r) => {
        const keys = Object.keys(r);
        const len = keys.length;
        const f = getRecordConstructor(keys);
        let fr = F.map(r[keys[0]], f);
        for (let i = 1; i < len; i++) {
            fr = F.ap(fr, r[keys[i]]);
        }
        return fr;
    };
}
//# sourceMappingURL=Apply.js.map