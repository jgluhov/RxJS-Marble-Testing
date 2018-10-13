import { Observable, Scheduler, asyncScheduler } from 'rxjs'
import { scan, delay, filter, debounceTime, throttleTime, distinctUntilChanged } from 'rxjs/operators'

export const sum = (numbers$: Observable<number>) => {
  return numbers$.pipe(scan((total: number, el: number) => total + el, 0))
}

export const delayedSum = (
  input$: Observable<number>,
  ms: number,
  scheduler: Scheduler = asyncScheduler
) => {
  return sum(input$).pipe(delay(ms, scheduler))
}

export const filterChars = (chars$: Observable<string>, borderChar: string) => {
  return chars$.pipe(filter((char: string) => char > borderChar))
}

export const debounceOut = <T>(
  events$: Observable<T>,
  ms: number,
  scheduler: Scheduler = asyncScheduler
) => {
  return events$.pipe(debounceTime(ms, scheduler))
}

export const throttleOut = <T>(
  events$: Observable<T>,
  ms: number,
  scheduler: Scheduler = asyncScheduler
) => {
  return events$.pipe(throttleTime(ms, scheduler))
}


export const searchTerm = (
  term$: Observable<string>,
  ms: number,
  scheduler: Scheduler = asyncScheduler
) => {
  return term$.pipe(
    filter((term: string) => !!term),
    distinctUntilChanged(),
    debounceTime(ms, scheduler)
  )
}
