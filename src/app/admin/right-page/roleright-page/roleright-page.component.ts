import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatIcon, MatSnackBar, MatTree, MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import * as cloneDeep from 'lodash/cloneDeep';
import {isUndefined} from 'util';

import {NavItem, SettingButtonPanel, Roleright, CompanyDepartment} from '../../../shared/interfaces';

import {RolerightService} from '../../../shared/services/admin/roleright.service';
import {RolelistPageComponent} from '../role-page/role-md-page/rolelist-page/rolelist-page.component';


@Component({
  selector: 'app-roleright-page',
  templateUrl: './roleright-page.component.html',
  styleUrls: ['./roleright-page.component.css'],
})
export class RolerightPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() roleSiteMap: NavItem[];
  @Input() companies: CompanyDepartment[];
  @Input() theme: string;
  @Input() heightSplitterRoleright: number;
  @Input() heightGridRoleright: number;

  @Input() selectRoleId: number;

  // define variables - link to view objects
  @ViewChild('matTree', {static: false}) matTree: MatTree<any>;
  @ViewChild('iconExpanded', {static: false}) iconExpanded: MatIcon;
  @ViewChild('rolelistPageComponent', {static: false}) rolelistPageComponent: RolelistPageComponent;

  // other variables
  oSub: Subscription;
  rolerights: Roleright[] = [];
  offset = 0;
  limit = 100000;
  settingRoleButtonPanel: SettingButtonPanel;

  // NestedTree
  treeControl = new NestedTreeControl<NavItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  constructor(
    private _snackBar: MatSnackBar,
    // service
    public translate: TranslateService,
    private rolerightService: RolerightService
  ) {
  }

  hasChildNested = (_: number, node: NavItem) => !!node.children && node.children.length > 0;

  ngOnInit() {
    // init role button panel
    this.settingRoleButtonPanel = {
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
        visible: false,
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

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  changeRight(event: any, node: any) {
    let elements: NavItem[] = [];
    // find nodes with componentName
    for (let i = 0; i < this.roleSiteMap.length; i++) {
      if (this.roleSiteMap[i].componentName === node.componentName) {
        elements.push(this.roleSiteMap[i]);
      } else {
        elements = [...elements, ...this.findNodes(this.roleSiteMap[i], node.componentName)];
      }
    }
    // disabled/enabled components
    for (let i = 0; i < elements.length; i++) {
      this.disabledElementsNode(elements[i], !event.checked);
    }
  }

  findNodes(node: NavItem, componentName: string) {
    let elements: NavItem[] = [];
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i].componentName === componentName) {
        elements.push(node.children[i]);
      } else {
        elements = [...elements, ...this.findNodes(node.children[i], componentName)];
      }
    }
    return elements;
  }

  disabledElementsNode(node: NavItem, action: boolean) {
    node.disabled = action;

    // ins
    if (action === false) {
      const selectObject: Roleright = new Roleright();
      selectObject.roleId = +this.selectRoleId;
      selectObject.componentCode = node.componentName;
      this.oSub = this.rolerightService.ins(selectObject).subscribe(
        response => {
          selectObject.rolerightId = +response;
          this.openSnackBar(this.translate.instant('site.menu.administration.right-page.roleright-page.roleright-ins') + response, 'OK');
        },
        error =>
          this.openSnackBar(error.error.message, 'OK'),
        () => {

        }
      );
    } else {
      this.rolerightService.del(node.rolerightId).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.administration.right-page.roleright-page.roleright-del'), 'OK');
        },
        error =>
          this.openSnackBar(error.error.message, 'OK'),
        () => {

        }
      );
    }

    for (let i = 0; i < node.children.length; i++) {
      this.disabledElementsNode(node.children[i], action);
    }
  }

  onItemSelected(node: any) {
    // node.expandable = !node.expandable;
    // this.iconExpanded._elementRef.nativeElement.textContent = this.treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right';
    // console.log(this.iconExpanded)
  }

  refreshChildSiteMap(roleId: number) {
    if (roleId > 0) {
      this.selectRoleId = roleId;
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        {
          roleId: roleId,
        });
      this.oSub = this.rolerightService.getAll(params).subscribe(rolerights => {
        this.rolerights = rolerights;
        // update rights roleSiteMap
        // this.roleSiteMap = cloneDeep(this.siteMap);
        this.dataSource.data = this.roleSiteMap;
        for (let i = 0; i < this.roleSiteMap.length; i++) {
          this.updRightSiteMap(this.roleSiteMap[i]);
        }
      });
    }
  }

  // update rights
  updRightSiteMap(node: NavItem) {
    // node.disabled = !JSON.parse(this.rolerights.find(
    //   (one: Roleright) => one.componentCode === node.componentName).rights);
    let isСoincidence = 0;
    for (let i = 0; i < this.rolerights.length; i++) {
      if (this.rolerights[i].componentCode === node.componentName) {
        node.disabled = !JSON.parse(this.rolerights[i].rights);
        node.rolerightId = +this.rolerights[i].rolerightId;
        isСoincidence = 1;
      }
    }

    if (isСoincidence === 0) {
      node.disabled = true;
    } else {
      isСoincidence = 0;
    }

    for (let i = 0; i < node.children.length; i++) {
      this.updRightSiteMap(node.children[i]);
    }
  }

  getHeightSplitter() {
    return this.heightSplitterRoleright;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
