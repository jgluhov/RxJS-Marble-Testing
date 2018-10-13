import * as main from './main';

describe('#add', () => {
    it('should count two numbers', () => {
        expect(main.add(5, 5)).toBe(10);
    })
})

