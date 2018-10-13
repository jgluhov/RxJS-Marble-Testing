import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export const sum = (numbers$: Observable<number>) => numbers$
    .pipe(
        scan((total: number, el: number) => total + el, 0)
    );