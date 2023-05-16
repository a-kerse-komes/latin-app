import { pipe } from './function.js';
import { getFunctorComposition, map } from './Functor.js';
import { getLeft, getRight } from './Option.js';
import * as S from './Separated.js';
export function compact(F, G) {
    return (fga) => F.map(fga, G.compact);
}
export function separate(F, C, G) {
    const _compact = compact(F, C);
    const _map = map(F, G);
    return (fge) => S.separated(_compact(pipe(fge, _map(getLeft))), _compact(pipe(fge, _map(getRight))));
}
/** @deprecated */
export function getCompactableComposition(F, G) {
    const map = getFunctorComposition(F, G).map;
    return {
        map,
        compact: compact(F, G),
        separate: separate(F, G, G)
    };
}
//# sourceMappingURL=Compactable.js.map