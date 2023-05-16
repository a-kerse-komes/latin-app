/**
 * The `Show` type class represents those types which can be converted into
 * a human-readable `string` representation.
 *
 * While not required, it is recommended that for any expression `x`, the
 * string `show(x)` be executable TypeScript code which evaluates to the same
 * value as the expression `x`.
 *
 * @since 2.0.0
 */
import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export const struct = (shows) => ({
    show: (a) => {
        let s = '{';
        for (const k in shows) {
            if (_.has.call(shows, k)) {
                s += ` ${k}: ${shows[k].show(a[k])},`;
            }
        }
        if (s.length > 1) {
            s = s.slice(0, -1) + ' ';
        }
        s += '}';
        return s;
    }
});
/**
 * @since 2.10.0
 */
export const tuple = (...shows) => ({
    show: (t) => `[${t.map((a, i) => shows[i].show(a)).join(', ')}]`
});
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getTupleShow = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getStructShow = struct;
/**
 * Use [`Show`](./boolean.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const showBoolean = {
    show: (a) => JSON.stringify(a)
};
/**
 * Use [`Show`](./string.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const showString = {
    show: (a) => JSON.stringify(a)
};
/**
 * Use [`Show`](./number.ts.html#show) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const showNumber = {
    show: (a) => JSON.stringify(a)
};
//# sourceMappingURL=Show.js.map