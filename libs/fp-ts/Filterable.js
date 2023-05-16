/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */
import { compact, separate } from './Compactable.js';
import { pipe } from './function.js';
import { getFunctorComposition } from './Functor.js';
import { getLeft, getRight } from './Option.js';
import { not } from './Predicate.js';
import { separated } from './Separated.js';
export function filter(F, G) {
    return (predicate) => (fga) => F.map(fga, (ga) => G.filter(ga, predicate));
}
export function filterMap(F, G) {
    return (f) => (fga) => F.map(fga, (ga) => G.filterMap(ga, f));
}
export function partition(F, G) {
    const _filter = filter(F, G);
    return (predicate) => {
        const left = _filter(not(predicate));
        const right = _filter(predicate);
        return (fgb) => separated(left(fgb), right(fgb));
    };
}
export function partitionMap(F, G) {
    const _filterMap = filterMap(F, G);
    return (f) => (fga) => separated(pipe(fga, _filterMap((a) => getLeft(f(a)))), pipe(fga, _filterMap((a) => getRight(f(a)))));
}
/** @deprecated */
export function getFilterableComposition(F, G) {
    const map = getFunctorComposition(F, G).map;
    const _compact = compact(F, G);
    const _separate = separate(F, G, G);
    const _filter = filter(F, G);
    const _filterMap = filterMap(F, G);
    const _partition = partition(F, G);
    const _partitionMap = partitionMap(F, G);
    return {
        map,
        compact: _compact,
        separate: _separate,
        filter: (fga, f) => pipe(fga, _filter(f)),
        filterMap: (fga, f) => pipe(fga, _filterMap(f)),
        partition: (fga, p) => pipe(fga, _partition(p)),
        partitionMap: (fga, f) => pipe(fga, _partitionMap(f))
    };
}
//# sourceMappingURL=Filterable.js.map