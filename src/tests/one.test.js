"use strict";
describe('Create method', () => {
    test("It should return true when data is same", () => {
        const payload = {
            name: 'Pasta',
            slug: 'pasta',
            description: 'abcd make some pasta'
        };
        expect(payload.slug).toEqual("pasta");
    });
});
//# sourceMappingURL=one.test.js.map