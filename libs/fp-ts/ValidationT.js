/**
 * @since 2.0.0
 */
import { getApplicativeComposition } from './Applicative.js';
import * as E from './Either.js';
import * as _ from './internal.js';
/** @deprecated */
export function getValidationM(S, M) {
    const A = getApplicativeComposition(M, E.getApplicativeValidation(S));
    return {
        map: A.map,
        ap: A.ap,
        of: A.of,
        chain: (ma, f) => M.chain(ma, (e) => (_.isLeft(e) ? M.of(_.left(e.left)) : f(e.right))),
        alt: (me, that) => M.chain(me, (e1) => _.isRight(e1) ? M.of(e1) : M.map(that(), (e2) => (_.isLeft(e2) ? _.left(S.concat(e1.left, e2.left)) : e2)))
    };
}
//# sourceMappingURL=ValidationT.js.map