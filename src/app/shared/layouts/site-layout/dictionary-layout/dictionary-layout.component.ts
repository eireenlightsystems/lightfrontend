// @ts-ignore
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-dictionary-layout',
  templateUrl: './dictionary-layout.component.html',
  styleUrls: ['./dictionary-layout.component.css']
})
export class DictionaryLayoutComponent implements OnInit, OnDestroy {

  // subscription

  // source

  constructor(private route: ActivatedRoute,
              private router: Router,
              // service
              ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
