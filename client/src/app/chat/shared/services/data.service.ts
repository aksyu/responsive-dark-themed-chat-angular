import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mode } from '../model/mode';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public mode$ = new BehaviorSubject<number>(Mode.NIGHT);

  constructor() { }
}
