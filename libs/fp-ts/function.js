// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
export const getBooleanAlgebra = (B) => () => ({
    meet: (x, y) => (a) => B.meet(x(a), y(a)),
    join: (x, y) => (a) => B.join(x(a), y(a)),
    zero: () => B.zero,
    one: () => B.one,
    implies: (x, y) => (a) => B.implies(x(a), y(a)),
    not: (x) => (a) => B.not(x(a))
});
/**
 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
 *
 * @example
 * import { Predicate, getSemigroup } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const S1 = getSemigroup(B.SemigroupAll)<number>()
 *
 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
 *
 * const S2 = getSemigroup(B.SemigroupAny)<number>()
 *
 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
export const getSemigroup = (S) => () => ({
    concat: (f, g) => (a) => S.concat(f(a), g(a))
});
/**
 * Unary functions form a monoid as long as you can provide a monoid for the codomain.
 *
 * @example
 * import { Predicate } from 'fp-ts/Predicate'
 * import { getMonoid } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const M1 = getMonoid(B.MonoidAll)<number>()
 *
 * assert.deepStrictEqual(M1.concat(f, g)(1), true)
 * assert.deepStrictEqual(M1.concat(f, g)(3), false)
 *
 * const M2 = getMonoid(B.MonoidAny)<number>()
 *
 * assert.deepStrictEqual(M2.concat(f, g)(1), true)
 * assert.deepStrictEqual(M2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
export const getMonoid = (M) => {
    const getSemigroupM = getSemigroup(M);
    return () => ({
        concat: getSemigroupM().concat,
        empty: () => M.empty
    });
};
/**
 * @category instances
 * @since 2.10.0
 */
export const getSemiring = (S) => ({
    add: (f, g) => (x) => S.add(f(x), g(x)),
    zero: () => S.zero,
    mul: (f, g) => (x) => S.mul(f(x), g(x)),
    one: () => S.one
});
/**
 * @category instances
 * @since 2.10.0
 */
export const getRing = (R) => {
    const S = getSemiring(R);
    return {
        add: S.add,
        mul: S.mul,
        one: S.one,
        zero: S.zero,
        sub: (f, g) => (x) => R.sub(f(x), g(x))
    };
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export const apply = (a) => (f) => f(a);
/**
 * @since 2.0.0
 */
export function identity(a) {
    return a;
}
/**
 * @since 2.0.0
 */
export const unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
export function constant(a) {
    return () => a;
}
/**
 * A thunk that returns always `true`.
 *
 * @since 2.0.0
 */
export const constTrue = /*#__PURE__*/ constant(true);
/**
 * A thunk that returns always `false`.
 *
 * @since 2.0.0
 */
export const constFalse = /*#__PURE__*/ constant(false);
/**
 * A thunk that returns always `null`.
 *
 * @since 2.0.0
 */
export const constNull = /*#__PURE__*/ constant(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @since 2.0.0
 */
export const constUndefined = /*#__PURE__*/ constant(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @since 2.0.0
 */
export const constVoid = constUndefined;
export function flip(f) {
    return (...args) => {
        if (args.length > 1) {
            return f(args[1], args[0]);
        }
        return (a) => f(a)(args[0]);
    };
}
export function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
/**
 * @since 2.0.0
 */
export function tuple(...t) {
    return t;
}
/**
 * @since 2.0.0
 */
export function increment(n) {
    return n + 1;
}
/**
 * @since 2.0.0
 */
export function decrement(n) {
    return n - 1;
}
/**
 * @since 2.0.0
 */
export function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
export function tupled(f) {
    return (a) => f(...a);
}
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
export function untupled(f) {
    return (...a) => f(a);
}
export function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        default: {
            let ret = arguments[0];
            for (let i = 1; i < arguments.length; i++) {
                ret = arguments[i](ret);
            }
            return ret;
        }
    }
}
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
export const hole = absurd;
/**
 * @since 2.11.0
 */
export const SK = (_, b) => b;
/**
 * Use `Predicate` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export function not(predicate) {
    return (a) => !predicate(a);
}
/**
 * Use `Endomorphism` module instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
export const getEndomorphismMonoid = () => ({
    concat: (first, second) => flow(first, second),
    empty: identity
});
/** @internal */
export const dual = (arity, body) => {
    const isDataFirst = typeof arity === 'number' ? (args) => args.length >= arity : arity;
    return function () {
        const args = Array.from(arguments);
        if (isDataFirst(arguments)) {
            return body.apply(this, args);
        }
        return (self) => body(self, ...args);
    };
};
//# sourceMappingURL=function.js.map