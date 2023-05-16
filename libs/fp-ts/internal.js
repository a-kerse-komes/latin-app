import { dual } from './function.js';
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
export const isNone = (fa) => fa._tag === 'None';
/** @internal */
export const isSome = (fa) => fa._tag === 'Some';
/** @internal */
export const none = { _tag: 'None' };
/** @internal */
export const some = (a) => ({ _tag: 'Some', value: a });
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
export const isLeft = (ma) => ma._tag === 'Left';
/** @internal */
export const isRight = (ma) => ma._tag === 'Right';
/** @internal */
export const left = (e) => ({ _tag: 'Left', left: e });
/** @internal */
export const right = (a) => ({ _tag: 'Right', right: a });
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
export const singleton = (a) => [a];
/** @internal */
export const isNonEmpty = (as) => as.length > 0;
/** @internal */
export const head = (as) => as[0];
/** @internal */
export const tail = (as) => as.slice(1);
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
export const emptyReadonlyArray = [];
/** @internal */
export const emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
export const has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
export const fromReadonlyNonEmptyArray = (as) => [as[0], ...as.slice(1)];
/** @internal */
export const liftNullable = (F) => (f, onNullable) => (...a) => {
    const o = f(...a);
    return F.fromEither(o == null ? left(onNullable(...a)) : right(o));
};
/** @internal */
export const liftOption = (F) => (f, onNone) => (...a) => {
    const o = f(...a);
    return F.fromEither(isNone(o) ? left(onNone(...a)) : right(o.value));
};
/** @internal */
export const flatMapNullable = (F, M) => 
/*#__PURE__*/ dual(3, (self, f, onNullable) => M.flatMap(self, liftNullable(F)(f, onNullable)));
/** @internal */
export const flatMapOption = (F, M) => 
/*#__PURE__*/ dual(3, (self, f, onNone) => M.flatMap(self, liftOption(F)(f, onNone)));
/** @internal */
export const flatMapEither = (F, M) => 
/*#__PURE__*/ dual(2, (self, f) => M.flatMap(self, (a) => F.fromEither(f(a))));
//# sourceMappingURL=internal.js.map