import { cold, getTestScheduler } from 'jasmine-marbles';
import * as main from './main';

describe('#sum()', () => {
    it('should sum numbers correctly', () => {
        const numbers$ = cold('--a--b--', { a: 1, b: 2 });
        const expected$ = cold('--c--d--', { c: 1, d: 3 });

        expect(main.sum(numbers$)).toBeObservable(expected$);
    })
});

describe('#delayedSum(),', () => {
    it('should sum numbers with delay correctly', () => {
        const scheduler = getTestScheduler();
        const numbers$ = cold('--a---b---', { a: 1, b: 2 });
        const ms = 10;

        const expected$ = cold('---c---d--', { c: 1, d: 3 });

        expect(main.delayedSum(numbers$, ms, scheduler)).toBeObservable(expected$);
    })
});
