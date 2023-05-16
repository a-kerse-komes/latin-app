import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply.js';
import * as A from './Array.js';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain.js';
import { fromEquals } from './Eq.js';
import { dual, identity, pipe } from './function.js';
import { bindTo as bindTo_, flap as flap_, let as let__ } from './Functor.js';
import * as _ from './internal.js';
/**
 * @category constructors
 * @since 2.0.0
 */
export function make(value, forest = []) {
    return {
        value,
        forest
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getShow(S) {
    const show = (t) => {
        return A.isEmpty(t.forest)
            ? `make(${S.show(t.value)})`
            : `make(${S.show(t.value)}, [${t.forest.map(show).join(', ')}])`;
    };
    return {
        show
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getEq(E) {
    // eslint-disable-next-line prefer-const
    let SA;
    const R = fromEquals((x, y) => E.equals(x.value, y.value) && SA.equals(x.forest, y.forest));
    SA = A.getEq(R);
    return R;
}
const draw = (indentation, forest) => {
    let r = '';
    const len = forest.length;
    let tree;
    for (let i = 0; i < len; i++) {
        tree = forest[i];
        const isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
/**
 * Neat 2-dimensional drawing of a forest
 *
 * @since 2.0.0
 */
export function drawForest(forest) {
    return draw('\n', forest);
}
/**
 * Neat 2-dimensional drawing of a tree
 *
 * @example
 * import { make, drawTree } from 'fp-ts/Tree'
 *
 * const fa = make('a', [
 *   make('b'),
 *   make('c'),
 *   make('d', [make('e'), make('f')])
 * ])
 *
 * assert.strictEqual(drawTree(fa), `a
 * ├─ b
 * ├─ c
 * └─ d
 *    ├─ e
 *    └─ f`)
 *
 *
 * @since 2.0.0
 */
export function drawTree(tree) {
    return tree.value + drawForest(tree.forest);
}
/**
 * Build a (possibly infinite) tree from a seed value in breadth-first order.
 *
 * @category constructors
 * @since 2.0.0
 */
export function unfoldTree(b, f) {
    const [a, bs] = f(b);
    return { value: a, forest: unfoldForest(bs, f) };
}
/**
 * Build a (possibly infinite) forest from a list of seed values in breadth-first order.
 *
 * @category constructors
 * @since 2.0.0
 */
export function unfoldForest(bs, f) {
    return bs.map((b) => unfoldTree(b, f));
}
export function unfoldTreeM(M) {
    const unfoldForestMM = unfoldForestM(M);
    return (b, f) => M.chain(f(b), ([a, bs]) => M.map(unfoldForestMM(bs, f), (ts) => ({ value: a, forest: ts })));
}
export function unfoldForestM(M) {
    const traverseM = A.traverse(M);
    return (bs, f) => pipe(bs, traverseM((b) => unfoldTreeM(M)(b, f)));
}
/**
 * Fold a tree into a "summary" value in depth-first order.
 *
 * For each node in the tree, apply `f` to the `value` and the result of applying `f` to each `forest`.
 *
 * This is also known as the catamorphism on trees.
 *
 * @example
 * import { fold, make } from 'fp-ts/Tree'
 * import { concatAll } from 'fp-ts/Monoid'
 * import { MonoidSum } from 'fp-ts/number'
 *
 * const t = make(1, [make(2), make(3)])
 *
 * const sum = concatAll(MonoidSum)
 *
 * // Sum the values in a tree:
 * assert.deepStrictEqual(fold((a: number, bs: Array<number>) => a + sum(bs))(t), 6)
 *
 * // Find the maximum value in the tree:
 * assert.deepStrictEqual(fold((a: number, bs: Array<number>) => bs.reduce((b, acc) => Math.max(b, acc), a))(t), 3)
 *
 * // Count the number of leaves in the tree:
 * assert.deepStrictEqual(fold((_: number, bs: Array<number>) => (bs.length === 0 ? 1 : sum(bs)))(t), 2)
 *
 * @category folding
 * @since 2.6.0
 */
export function fold(f) {
    const go = (tree) => f(tree.value, tree.forest.map(go));
    return go;
}
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
const _ap = (fab, fa) => flatMap(fab, (f) => pipe(fa, map(f)));
/* istanbul ignore next */
const _reduce = (fa, b, f) => pipe(fa, reduce(b, f));
/* istanbul ignore next */
const _foldMap = (M) => {
    const foldMapM = foldMap(M);
    return (fa, f) => pipe(fa, foldMapM(f));
};
/* istanbul ignore next */
const _reduceRight = (fa, b, f) => pipe(fa, reduceRight(b, f));
/* istanbul ignore next */
const _extend = (wa, f) => pipe(wa, extend(f));
/* istanbul ignore next */
const _traverse = (F) => {
    const traverseF = traverse(F);
    return (ta, f) => pipe(ta, traverseF(f));
};
/**
 * @since 2.0.0
 */
export const ap = (fa) => (fab) => _ap(fab, fa);
/**
 * @category sequencing
 * @since 2.14.0
 */
export const flatMap = /*#__PURE__*/ dual(2, (ma, f) => {
    const { value, forest } = f(ma.value);
    const concat = A.getMonoid().concat;
    return {
        value,
        forest: concat(forest, ma.forest.map(flatMap(f)))
    };
});
/**
 * @since 2.0.0
 */
export const extend = (f) => (wa) => ({
    value: f(wa),
    forest: wa.forest.map(extend(f))
});
/**
 * @since 2.0.0
 */
export const duplicate = /*#__PURE__*/ extend(identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = /*#__PURE__*/ flatMap(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => ({
    value: f(fa.value),
    forest: fa.forest.map(map(f))
});
/**
 * @category folding
 * @since 2.0.0
 */
export const reduce = (b, f) => (fa) => {
    let r = f(b, fa.value);
    const len = fa.forest.length;
    for (let i = 0; i < len; i++) {
        r = pipe(fa.forest[i], reduce(r, f));
    }
    return r;
};
/**
 * @category folding
 * @since 2.0.0
 */
export const foldMap = (M) => (f) => reduce(M.empty, (acc, a) => M.concat(acc, f(a)));
/**
 * @category folding
 * @since 2.0.0
 */
export const reduceRight = (b, f) => (fa) => {
    let r = b;
    const len = fa.forest.length;
    for (let i = len - 1; i >= 0; i--) {
        r = pipe(fa.forest[i], reduceRight(r, f));
    }
    return f(fa.value, r);
};
/**
 * @category Extract
 * @since 2.6.2
 */
export const extract = (wa) => wa.value;
/**
 * @category traversing
 * @since 2.6.3
 */
export const traverse = (F) => {
    const traverseF = A.traverse(F);
    const out = (f) => (ta) => F.ap(F.map(f(ta.value), (value) => (forest) => ({
        value,
        forest
    })), pipe(ta.forest, traverseF(out(f))));
    return out;
};
/**
 * @category traversing
 * @since 2.6.3
 */
export const sequence = (F) => traverse(F)(identity);
/**
 * @category constructors
 * @since 2.7.0
 */
export const of = (a) => make(a);
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Tree';
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
 * @since 2.0.0
 */
export const apFirst = /*#__PURE__*/ apFirst_(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
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
 * @since 2.0.0
 */
export const chainFirst = /*#__PURE__*/ chainFirst_(Chain);
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
export const Comonad = {
    URI,
    map: _map,
    extend: _extend,
    extract
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
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export function elem(E) {
    const go = (a, fa) => E.equals(a, fa.value) || fa.forest.some((tree) => go(a, tree));
    return go;
}
/**
 * @since 2.11.0
 */
export const exists = (predicate) => (ma) => predicate(ma.value) || ma.forest.some(exists(predicate));
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
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.tree`
 * (where `T` is from `import T from 'fp-ts/Tree'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const tree = {
    URI,
    map: _map,
    of,
    ap: _ap,
    chain: flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence,
    extract,
    extend: _extend
};
//# sourceMappingURL=Tree.js.map