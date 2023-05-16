import { apFirst as apFirst_, apSecond as apSecond_ } from './Apply.js';
import { chainFirst as chainFirst_ } from './Chain.js';
import { identity, pipe as pipeFromFunctionModule } from './function.js';
export function map(F) {
    return (f) => (fa) => F.map(fa, f);
}
export function contramap(F) {
    return (f) => (fa) => F.contramap(fa, f);
}
export function mapWithIndex(F) {
    return (f) => (fa) => F.mapWithIndex(fa, f);
}
export function ap(F) {
    return (fa) => (fab) => F.ap(fab, fa);
}
export function chain(F) {
    return (f) => (fa) => F.chain(fa, f);
}
export function bimap(F) {
    return (f, g) => (fea) => F.bimap(fea, f, g);
}
export function mapLeft(F) {
    return (f) => (fea) => F.mapLeft(fea, f);
}
export function extend(F) {
    return (f) => (wa) => F.extend(wa, f);
}
export function reduce(F) {
    return (b, f) => (fa) => F.reduce(fa, b, f);
}
export function foldMap(F) {
    return (M) => {
        const foldMapM = F.foldMap(M);
        return (f) => (fa) => foldMapM(fa, f);
    };
}
export function reduceRight(F) {
    return (b, f) => (fa) => F.reduceRight(fa, b, f);
}
export function reduceWithIndex(F) {
    return (b, f) => (fa) => F.reduceWithIndex(fa, b, f);
}
export function foldMapWithIndex(F) {
    return (M) => {
        const foldMapWithIndexM = F.foldMapWithIndex(M);
        return (f) => (fa) => foldMapWithIndexM(fa, f);
    };
}
export function reduceRightWithIndex(F) {
    return (b, f) => (fa) => F.reduceRightWithIndex(fa, b, f);
}
export function alt(F) {
    return (that) => (fa) => F.alt(fa, that);
}
export function filter(F) {
    return (predicate) => (fa) => F.filter(fa, predicate);
}
export function filterMap(F) {
    return (f) => (fa) => F.filterMap(fa, f);
}
export function partition(F) {
    return (f) => (fa) => F.partition(fa, f);
}
export function partitionMap(F) {
    return (f) => (fa) => F.partitionMap(fa, f);
}
export function filterWithIndex(F) {
    return (predicate) => (fa) => F.filterWithIndex(fa, predicate);
}
export function filterMapWithIndex(F) {
    return (f) => (fa) => F.filterMapWithIndex(fa, f);
}
export function partitionWithIndex(F) {
    return (f) => (fa) => F.partitionWithIndex(fa, f);
}
export function partitionMapWithIndex(F) {
    return (f) => (fa) => F.partitionMapWithIndex(fa, f);
}
export function promap(F) {
    return (f, g) => (fbc) => F.promap(fbc, f, g);
}
export function compose(F) {
    return (ea) => (ab) => F.compose(ab, ea);
}
const isFunctor = (I) => typeof I.map === 'function';
const isContravariant = (I) => typeof I.contramap === 'function';
const isFunctorWithIndex = (I) => typeof I.mapWithIndex === 'function';
const isApply = (I) => typeof I.ap === 'function';
const isChain = (I) => typeof I.chain === 'function';
const isBifunctor = (I) => typeof I.bimap === 'function';
const isExtend = (I) => typeof I.extend === 'function';
const isFoldable = (I) => typeof I.reduce === 'function';
const isFoldableWithIndex = (I) => typeof I.reduceWithIndex === 'function';
const isAlt = (I) => typeof I.alt === 'function';
const isCompactable = (I) => typeof I.compact === 'function';
const isFilterable = (I) => typeof I.filter === 'function';
const isFilterableWithIndex = (I) => typeof I.filterWithIndex === 'function';
const isProfunctor = (I) => typeof I.promap === 'function';
const isSemigroupoid = (I) => typeof I.compose === 'function';
const isMonadThrow = (I) => typeof I.throwError === 'function';
/** @deprecated */
export function pipeable(I) {
    const r = {};
    if (isFunctor(I)) {
        r.map = map(I);
    }
    if (isContravariant(I)) {
        r.contramap = contramap(I);
    }
    if (isFunctorWithIndex(I)) {
        r.mapWithIndex = mapWithIndex(I);
    }
    if (isApply(I)) {
        r.ap = ap(I);
        r.apFirst = apFirst_(I);
        r.apSecond = apSecond_(I);
    }
    if (isChain(I)) {
        r.chain = chain(I);
        r.chainFirst = chainFirst_(I);
        r.flatten = r.chain(identity);
    }
    if (isBifunctor(I)) {
        r.bimap = bimap(I);
        r.mapLeft = mapLeft(I);
    }
    if (isExtend(I)) {
        r.extend = extend(I);
        r.duplicate = r.extend(identity);
    }
    if (isFoldable(I)) {
        r.reduce = reduce(I);
        r.foldMap = foldMap(I);
        r.reduceRight = reduceRight(I);
    }
    if (isFoldableWithIndex(I)) {
        r.reduceWithIndex = reduceWithIndex(I);
        r.foldMapWithIndex = foldMapWithIndex(I);
        r.reduceRightWithIndex = reduceRightWithIndex(I);
    }
    if (isAlt(I)) {
        r.alt = alt(I);
    }
    if (isCompactable(I)) {
        r.compact = I.compact;
        r.separate = I.separate;
    }
    if (isFilterable(I)) {
        r.filter = filter(I);
        r.filterMap = filterMap(I);
        r.partition = partition(I);
        r.partitionMap = partitionMap(I);
    }
    if (isFilterableWithIndex(I)) {
        r.filterWithIndex = filterWithIndex(I);
        r.filterMapWithIndex = filterMapWithIndex(I);
        r.partitionWithIndex = partitionWithIndex(I);
        r.partitionMapWithIndex = partitionMapWithIndex(I);
    }
    if (isProfunctor(I)) {
        r.promap = promap(I);
    }
    if (isSemigroupoid(I)) {
        r.compose = compose(I);
    }
    if (isMonadThrow(I)) {
        const fromOption = (onNone) => (ma) => ma._tag === 'None' ? I.throwError(onNone()) : I.of(ma.value);
        const fromEither = (ma) => ma._tag === 'Left' ? I.throwError(ma.left) : I.of(ma.right);
        const fromPredicate = (predicate, onFalse) => (a) => predicate(a) ? I.of(a) : I.throwError(onFalse(a));
        const filterOrElse = (predicate, onFalse) => (ma) => I.chain(ma, (a) => (predicate(a) ? I.of(a) : I.throwError(onFalse(a))));
        r.fromOption = fromOption;
        r.fromEither = fromEither;
        r.fromPredicate = fromPredicate;
        r.filterOrElse = filterOrElse;
    }
    return r;
}
/**
 * Use [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#pipe) from `function` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
export const pipe = pipeFromFunctionModule;
//# sourceMappingURL=pipeable.js.map