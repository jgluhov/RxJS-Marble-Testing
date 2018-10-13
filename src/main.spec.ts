import { cold, getTestScheduler } from 'jasmine-marbles'
import * as main from './main'
import { TestScheduler } from 'rxjs/testing';

type Values<V> = {
  [index: string]: V
}

const helpers = {
  generateSymbols(): string[] {
    return new Array(26)
      .fill('')
      .map((_: string, i: number) => String.fromCharCode(65 + i).toLowerCase())
  },
  generateAlphabet() {
    return this.generateSymbols().reduce((acc: Values<string>, char: string) => {
      acc[char] = char

      return acc
    }, {})
  },
  generateEvents(type: string) {
    return this.generateSymbols().reduce((acc: Values<object>, char: string) => {
      acc[char] = {
        type,
        key: char,
        which: char.charCodeAt(0)
      };

      return acc;
    }, {})
  }
}

describe('#sum()', () => {
  it('should sum numbers correctly', () => {
    const numbers$ =  cold('--a--b--', { a: 1, b: 2 })
    const expected$ = cold('--c--d--', { c: 1, d: 3 })

    expect(main.sum(numbers$)).toBeObservable(expected$)
  })
})

describe('#delayedSum()', () => {
  it('should sum numbers with delay correctly', () => {
    const scheduler = getTestScheduler()
    const numbers$ =  cold('--a---b---', { a: 1, b: 2 })
    const expected$ = cold('---c---d--', { c: 1, d: 3 })
    const ms = 10

    expect(main.delayedSum(numbers$, ms, scheduler)).toBeObservable(expected$)
  })
})

describe('#filterChars()', () => {
  it('should filter chars which are going after param symbol', () => {
    const values = helpers.generateAlphabet()

    const chars$ = cold('--a--b--c--d--e--f--', values)
    const expected$ = cold('-----------d--e--f--', values)

    expect(main.filterChars(chars$, 'c')).toBeObservable(expected$)
  })
})

describe('#debounceOut()', () => {
  it('should output only last value', () => {
    const scheduler = getTestScheduler()

    const events$ =   cold('--abcd-e')
    const expected$ = cold('------d-e')
    const ms = 10

    expect(main.debounceOut(events$, ms, scheduler)).toBeObservable(expected$)
  })
})

describe('#throttleOut()', () => {
  it('should output events after time elapsed', () => {
    const scheduler = getTestScheduler()

    const events$ =   cold('--abcd-e')
    const expected$ = cold('--a-c--e')
    const ms = 10

    expect(main.throttleOut(events$, ms, scheduler)).toBeObservable(expected$)
  })
})

describe('#searchTerm()', () => {
  let scheduler: TestScheduler;
  let ms: number = 10;
  let termValues: object;

  beforeEach(() => {
    scheduler = getTestScheduler()
    termValues = {
      a: 'te',
      b: 'ter',
      c: 'term',
      d: 'terms'
    };
  })

  describe('when term is not correct', () => {
    it('should not do anything', () => {
      const event$ =    cold('--a--', { a: '' })
      const expected$ = cold('-----')

      expect(main.searchTerm(event$, ms, scheduler)).toBeObservable(expected$);
    })
  })

  describe('when term is correct', () => {

    describe('when user emits single event', () => {
      it('should make a request', () => {
        const term$ =     cold('--a--', termValues)
        const expected$ = cold('---a-', termValues)

        expect(main.searchTerm(term$, ms, scheduler)).toBeObservable(expected$);
      })
    })

    describe('when user emits multiple events', () => {
      describe('when events are the same', () => {
        it('should make a single request', () => {
          const term$ =     cold('--a-a-a-a--a-a-', termValues)
          const expected$ = cold('---a-----------', termValues)

          expect(main.searchTerm(term$, ms, scheduler)).toBeObservable(expected$);
        })
      })
    })

    describe('when user emits multiple events', () => {
      describe('when events are different', () => {
        it('should make a single request', () => {
          const term$ =     cold('--abc-d---', termValues)
          const expected$ = cold('-----c-d--', termValues)

          expect(main.searchTerm(term$, ms, scheduler)).toBeObservable(expected$);
        })
      })
    })
  })
})
