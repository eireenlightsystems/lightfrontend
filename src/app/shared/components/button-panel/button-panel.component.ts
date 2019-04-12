import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Fixture, SettingButtonPanel} from '../../interfaces';
import {FixturelistJqxgridComponent} from '../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-jqxgrid/fixturelist-jqxgrid.component';
import jqxTooltip = jqwidgets.jqxTooltip;

@Component({
  selector: 'app-button-panel',
  templateUrl: './button-panel.component.html',
  styleUrls: ['./button-panel.component.css']
})
export class ButtonPanelComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onGetSourceForButtonPanel = new EventEmitter();
  @Output() onIns = new EventEmitter();
  @Output() onUpd = new EventEmitter();
  @Output() onDel = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onFilterNone = new EventEmitter();
  @Output() onFilterList = new EventEmitter();
  @Output() onPlace = new EventEmitter();
  @Output() onPinDrop = new EventEmitter();
  @Output() onGroupIn = new EventEmitter();
  @Output() onGroupOut = new EventEmitter();
  @Output() onSwitchOn = new EventEmitter();
  @Output() onSwitchOff = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('tooltipAdd') tooltipAdd: jqxTooltip;

  // other variables


  constructor() {
  }

  ngOnInit() {
    this.onGetSourceForButtonPanel.emit();
  }

  ngOnDestroy(): void {
    if (this.tooltipAdd) {
      this.tooltipAdd.destroy();
    }
  }

  destroy() {
    if (this.tooltipAdd) {
      this.tooltipAdd.destroy();
    }
  }

  ins() {
    this.onIns.emit();
  }

  upd() {
    this.onUpd.emit();
  }

  del() {
    this.onDel.emit();
  }

  refresh() {
    this.onRefresh.emit();
  }

  filterNone() {
    this.onFilterNone.emit();
  }

  filterList() {
    this.onFilterList.emit();
  }

  place() {
    this.onPlace.emit();
  }

  pinDrop() {
    this.onPinDrop.emit();
  }

  groupIn() {
    this.onGroupIn.emit();
  }

  groupOut() {
    this.onGroupOut.emit();
  }

  switchOn() {
    this.onSwitchOn.emit();
  }

  switchOff() {
    this.onSwitchOff.emit();
  }
}
