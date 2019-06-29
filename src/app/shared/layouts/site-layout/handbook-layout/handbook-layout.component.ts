import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Geograph} from '../../../interfaces';
import {GeographService} from '../../../services/geograph/geograph.service';

@Component({
  selector: 'app-handbook-layout',
  templateUrl: './handbook-layout.component.html',
  styleUrls: ['./handbook-layout.component.css']
})
export class HandbookLayoutComponent implements OnInit, OnDestroy {

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
