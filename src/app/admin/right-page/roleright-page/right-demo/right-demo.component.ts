import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import jqxButton = jqwidgets.jqxButton;

import {CompanyDepartment, NavItem, Person} from '../../../../shared/interfaces';

import {RolerightPageComponent} from '../roleright-page.component';


@Component({
  selector: 'app-right-demo',
  templateUrl: './right-demo.component.html',
  styleUrls: ['./right-demo.component.css']
})
export class RightDemoComponent implements OnInit,
  // AfterViewInit,
  // AfterContentChecked,
  // AfterViewChecked,
  OnDestroy {

  // variables from master component
  @Input() roleSiteMap: NavItem[];
  @Input() companies: CompanyDepartment[];
  @Input() theme: string;
  @Input() heightSplitterRoleright: number;
  @Input() heightGridRoleright: number;

  // determine the functions that need to be performed in the parent component
  @Output() onCloseWindow = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('rolerightPageComponent', {static: false}) rolerightPageComponent: RolerightPageComponent;
  @ViewChild('demoRightWindow', {static: false}) demoRightWindow: jqxWindowComponent;
  @ViewChild('cancelButton', {static: false}) cancelButton: jqxButton;

  // other variables


  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

  // ngAfterViewInit() {
  //
  // }
  //
  // ngAfterContentChecked() {
  //
  // }
  //
  // ngAfterViewChecked() {
  //   this.demoRightWindow.title(this.translate.instant('site.menu.administration.right-page.right-demo'));
  //   this.cancelButton.val(this.translate.instant('site.forms.editforms.close'));
  //   // this.jqxTabs.setTitleAt(1, this.translate.instant('site.menu.administration.right-page.role-page'));
  // }

  ngOnDestroy() {
    this.destroy();
  }

  close() {
    this.onCloseWindow.emit();
    this.demoRightWindow.close();
  }

  open() {
    this.demoRightWindow.open();
  }

  isOpen() {
    return this.demoRightWindow.isOpen();
  }

  destroy() {
    if (this.demoRightWindow) {
      this.demoRightWindow.destroy();
    }
    if (this.rolerightPageComponent) {
      this.rolerightPageComponent.destroy();
    }
  }

  hide() {
    this.demoRightWindow.hide();
  }

  positionWindow(coord: any) {
    this.demoRightWindow.position({x: coord.x, y: coord.y});
  }

  isRusLang(lang: string) {
    if (lang === 'ru') {
      return true;
    } else {
      return false;
    }
  }

  isEngLang(lang: string) {
    if (lang === 'en') {
      return true;
    } else {
      return false;
    }
  }

}
