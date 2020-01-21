import { Component, OnInit } from '@angular/core';
import { Mode } from '../shared/model/mode';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-mode-switcher',
  templateUrl: './mode-switcher.component.html',
  styleUrls: ['./mode-switcher.component.css'],
})
export class ModeSwitcherComponent implements OnInit {
  nightMode = Mode.NIGHT;

  constructor(
    private dataServise$: DataService,
  ) { }

  ngOnInit() {
  }

  changeMode(nightMode: boolean) {
    this.dataServise$.mode$.next(+nightMode);
  }
}
