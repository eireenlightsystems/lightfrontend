// angular lib
import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {NavItem, SettingButtonPanel} from '../../../shared/interfaces';
// app services
// app components


@Component({
  selector: 'app-component-page',
  templateUrl: './component-page.component.html',
  styleUrls: ['./component-page.component.css']
})
export class ComponentPageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects

  // other variables
  settingComponentButtonPanel: SettingButtonPanel;


  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
    // init button panel
    this.settingComponentButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: true,
        disabled: false,
      },
      del: {
        visible: true,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: false,
        disabled: false,
      },
      groupOut: {
        visible: false,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
  }

}
