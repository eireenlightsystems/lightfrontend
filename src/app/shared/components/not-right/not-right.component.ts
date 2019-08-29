import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-not-right',
  templateUrl: './not-right.component.html',
  styleUrls: ['./not-right.component.css']
})
export class NotRightComponent implements OnInit {

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

}
