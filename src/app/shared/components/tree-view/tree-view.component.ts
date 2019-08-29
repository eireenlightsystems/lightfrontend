import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {NavItem} from '../../interfaces';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  @Input() treeData: NavItem[];

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
