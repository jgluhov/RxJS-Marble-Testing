import { cold, getTestScheduler } from 'jasmine-marbles';
import * as main from './main';

type Values = {
    [index: string]: string
};

const helpers = {
    generateSymbols(): string[] {
        return new Array( 26 ).fill('').map((_: string, i: number) => String.fromCharCode( 65 + i ).toLowerCase());
    },
    generateAlphabet() {
        this.generateSymbols()
            .reduce((acc: Values, char: string) => {
                acc[char] = char;

                return acc;
            }, {});
    }
}

describe('#sum()', () => {
    it('should sum numbers correctly', () => {
        const numbers$ = cold('--a--b--', { a: 1, b: 2 });
        const expected$ = cold('--c--d--', { c: 1, d: 3 });

        expect(main.sum(numbers$)).toBeObservable(expected$);
    })
});

describe('#delayedSum()', () => {
    it('should sum numbers with delay correctly', () => {
        const scheduler = getTestScheduler();
        const numbers$ = cold('--a---b---', { a: 1, b: 2 });
        const ms = 10;

        const expected$ = cold('---c---d--', { c: 1, d: 3 });

        expect(main.delayedSum(numbers$, ms, scheduler)).toBeObservable(expected$);
    })
});

describe('#filterChars()', () => {
    it('should filter chars which are going after param symbol', () => {
        const values = helpers.generateAlphabet();

        const chars$ = cold('--a--b--c--d--e--f--', values);
        const expected$ = cold('-----------d--e--f--', values);

        expect(main.filterChars(chars$, 'c')).toBeObservable(expected$);
    })
})
