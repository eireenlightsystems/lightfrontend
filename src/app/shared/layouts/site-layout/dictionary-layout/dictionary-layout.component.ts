// @ts-ignore
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Geograph} from '../../../interfaces';
import {GeographService} from '../../../services/geograph/geograph.service';

@Component({
  selector: 'app-dictionary-layout',
  templateUrl: './dictionary-layout.component.html',
  styleUrls: ['./dictionary-layout.component.css']
})
export class DictionaryLayoutComponent implements OnInit, OnDestroy {

  // subscription
  geographSub: Subscription;

  // source
  geographs: Geograph[];


  constructor(private route: ActivatedRoute,
              private router: Router,
              // service
              private geographService: GeographService) {
  }

  ngOnInit() {
    this.fetch_refbook();
  }

  ngOnDestroy(): void {
    // subscription
    this.geographSub.unsubscribe();
  }

  fetch_refbook() {
    // refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);
  }
}
