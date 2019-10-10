// angular lib
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';
// app interfaces
import {FilterComponent, FilterRole, FilterUser, NavItem, Person, SettingButtonPanel} from '../../../../shared/interfaces';
// app services
// app components
import {UserlistPageComponent} from './userlist-page/userlist-page.component';
import {RolelistPageComponent} from '../../role-page/role-md-page/rolelist-page/rolelist-page.component';
import {ComponentlistPageComponent} from '../../component-page/componentlist-page/componentlist-page.component';


@Component({
  selector: 'app-user-md-page',
  templateUrl: './user-md-page.component.html',
  styleUrls: ['./user-md-page.component.css']
})
export class UserMdPageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  // role source
  @Input() roleSortcolumn: any[];
  @Input() roleColumns: any[];
  @Input() roleListBoxSource: any[];
  // user source
  @Input() persons: Person[];

  // define variables - link to view objects
  @ViewChild('userlistPageComponent', {static: false}) userlistPageComponent: UserlistPageComponent;
  @ViewChild('rolelistPageComponent', {static: false}) rolelistPageComponent: RolelistPageComponent;
  @ViewChild('componentlistPageComponent', {static: false}) componentlistPageComponent: ComponentlistPageComponent;
  @ViewChild('mainSplitter', {static: false}) mainSplitter: jqxSplitterComponent;

  // other variables
  settingUserButtonPanel: SettingButtonPanel;
  settingRoleButtonPanel: SettingButtonPanel;
  settingComponentButtonPanel: SettingButtonPanel;
  selectUserId = 0;
  filterUser: FilterUser = {
    contragentId: '',
    roleId: '',
    notRoleId: '',
  };
  filterRole: FilterRole = {
    userId: '',
    notUserId: '',
  };
  filterComponent: FilterComponent = {
    roleId: '',
    userId: '',
  };
  heightDeltaParentGrid = 55;
  heightDeltaChildGrid = 110;
  sizeParentSplitter: any;
  sizeChildSplitter: any;

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
    // init user button panel
    this.settingUserButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: false,
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
        visible: true,
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
    // init role button panel
    this.settingRoleButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: false,
        disabled: false,
      },
      del: {
        visible: false,
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
        visible: true,
        disabled: false,
      },
      groupOut: {
        visible: true,
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
    // init component button panel
    this.settingComponentButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: false,
        disabled: false,
      },
      del: {
        visible: false,
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

  refreshGrid() {
    this.userlistPageComponent.applyFilter(this.filterUser);
    this.refreshChildGrid(0);
  }

  refreshChildGrid(userId: number) {
    this.selectUserId = userId;
    this.filterRole.userId = userId.toString();
    this.filterComponent.userId = userId.toString();

    if (userId === 0) {
      // Role
      if (!isUndefined(this.rolelistPageComponent)) {
        this.rolelistPageComponent.items = [];
        if (!isUndefined(this.rolelistPageComponent.jqxgridComponent)) {
          this.rolelistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.rolelistPageComponent.getDisabledButtons();
      }
      // Components
      if (!isUndefined(this.componentlistPageComponent)) {
        this.componentlistPageComponent.items = [];
        if (!isUndefined(this.componentlistPageComponent.jqxgridComponent)) {
          this.componentlistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.componentlistPageComponent.getDisabledButtons();
      }
    } else {
      // Role
      if (!isUndefined(this.rolelistPageComponent)) {
        this.rolelistPageComponent.applyFilter(this.filterRole);
      }
      // Components
      if (!isUndefined(this.componentlistPageComponent)) {
        this.componentlistPageComponent.applyFilter(this.filterComponent);
      }
    }
  }

  resize(sizeParent: any, sizeChild: any) {
    const sizeParentGrid = sizeParent - this.heightDeltaParentGrid;
    const sizeChildGrid = sizeChild - this.heightDeltaChildGrid;

    this.userlistPageComponent.jqxgridComponent.myGrid.height(sizeParentGrid);
    this.userlistPageComponent.sourceForJqxGrid.grid.height = sizeParentGrid;

    if (!isUndefined(this.rolelistPageComponent)) {
      this.rolelistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.rolelistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }

    if (!isUndefined(this.componentlistPageComponent)) {
      this.componentlistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.componentlistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }
  }

  collapsed(sizeParent: any, sizeChild: any) {
    this.sizeParentSplitter = sizeParent;
    this.sizeChildSplitter = sizeChild;
    this.mainSplitter.attrPanels[0].size = this.getHeightSplitter();
  }

  expanded() {
    this.mainSplitter.attrPanels[0].size = this.sizeParentSplitter;
    this.mainSplitter.attrPanels[1].size = this.sizeChildSplitter;
  }

  getHeightSplitter() {
    return 785;
  }
}
