import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavItem} from '../../interfaces';

@Component({
  selector: 'app-not-right',
  templateUrl: './not-right.component.html',
  styleUrls: ['./not-right.component.css']
})
export class NotRightComponent implements OnInit {

  // variables from parent component
  @Input() message: NavItem[];

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

}
