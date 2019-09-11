// angular lib
import {
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
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
// app interfaces
import {CompanyDepartment, NavItem} from '../../../../shared/interfaces';
// app services
// app components


@Component({
  selector: 'app-right-demo',
  templateUrl: './right-demo.component.html',
  styleUrls: ['./right-demo.component.css']
})
export class RightDemoComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() roleSiteMap: NavItem[];
  @Input() companies: CompanyDepartment[];
  @Input() theme: string;
  @Input() heightSplitterRoleright: number;
  @Input() heightGridRoleright: number;

  // determine the functions that need to be performed in the parent component
  @Output() onInitRightDemoForm = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('rightDemoForm', {static: false}) rightDemoForm: jqxWindowComponent;

  // other variables


  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.rightDemoForm) {
      this.rightDemoForm.destroy();
    }
  }

  open() {
    this.rightDemoForm.open();
  }

  close() {
    this.rightDemoForm.close();
  }

  closeDestroy() {
    this.onInitRightDemoForm.emit();
    this.destroy();
  }

  hide() {
    this.rightDemoForm.hide();
  }

  positionWindow(coord: any) {
    this.rightDemoForm.position({x: coord.x, y: coord.y});
  }

  isOpen() {
    return this.rightDemoForm.isOpen();
  }
}
