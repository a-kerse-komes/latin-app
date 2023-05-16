import { getFoldableComposition } from './Foldable.js';
import { pipe } from './function.js';
import { getFunctorComposition } from './Functor.js';
export function traverse(T, G) {
    return (F) => {
        const traverseT = T.traverse(F);
        const traverseG = G.traverse(F);
        return (f) => (fga) => traverseT(fga, (ga) => traverseG(ga, f));
    };
}
export function sequence(T, G) {
    return (F) => {
        const sequenceT = T.sequence(F);
        const sequenceG = G.sequence(F);
        return (fgha) => sequenceT(T.map(fgha, sequenceG));
    };
}
/** @deprecated */
export function getTraversableComposition(F, G) {
    const map = getFunctorComposition(F, G).map;
    const FC = getFoldableComposition(F, G);
    const _traverse = traverse(F, G);
    const _sequence = sequence(F, G);
    return {
        map,
        reduce: FC.reduce,
        foldMap: FC.foldMap,
        reduceRight: FC.reduceRight,
        traverse: (H) => {
            const traverseH = _traverse(H);
            return (fga, f) => pipe(fga, traverseH(f));
        },
        sequence: (H) => {
            const sequenceH = _sequence(H);
            return (fgha) => pipe(fgha, sequenceH);
        }
    };
}
//# sourceMappingURL=Traversable.js.map