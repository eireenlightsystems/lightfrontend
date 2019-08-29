import {Component, Input, OnInit} from '@angular/core';
import {NavItem, SettingButtonPanel} from '../../../shared/interfaces';

@Component({
  selector: 'app-component-page',
  templateUrl: './component-page.component.html',
  styleUrls: ['./component-page.component.css']
})
export class ComponentPageComponent implements OnInit {

  // variables from master component
  @Input() siteMap: NavItem[];

  // define variables - link to view objects

  // other variables
  settingComponentButtonPanel: SettingButtonPanel;


  constructor() {
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
