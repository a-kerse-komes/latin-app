import * as _ from './internal.js';
export function wiltDefault(T, C) {
    return (F) => {
        const traverseF = T.traverse(F);
        return (wa, f) => F.map(traverseF(wa, f), C.separate);
    };
}
export function witherDefault(T, C) {
    return (F) => {
        const traverseF = T.traverse(F);
        return (wa, f) => F.map(traverseF(wa, f), C.compact);
    };
}
export function filterE(W) {
    return (F) => {
        const witherF = W.wither(F);
        return (predicate) => (ga) => witherF(ga, (a) => F.map(predicate(a), (b) => (b ? _.some(a) : _.none)));
    };
}
//# sourceMappingURL=Witherable.js.map