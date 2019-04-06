import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {FilterFixture, FixtureType, Geograph, OwnerFixture, Substation} from '../../../../../shared/interfaces';
import {FixturelistJqxgridComponent} from '../fixturelist-jqxgrid/fixturelist-jqxgrid.component';


@Component({
  selector: 'app-fixturelist-filter',
  templateUrl: './fixturelist-filter.component.html',
  styleUrls: ['./fixturelist-filter.component.css']
})
export class FixturelistFilterComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerFixtures: OwnerFixture[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  // for filtering from master component
  @Input() selectContractId: number;
  @Input() selectNodeId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterFixture>();

  // define variables - link to view objects

  // other variables
  isValid = true;
  geographId: string;
  ownerId: string;
  fixtureTypeId: string;
  substationId: string;
  modeId: string;
  nullVar = '';
  modes = [
    {
      id: 0,
      code: 'Выкл.'
    },
    {
      id: 1,
      code: 'Вкл.'
    }
  ];

  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  validate() {
    if (!(this.geographId && this.ownerId && this.fixtureTypeId && this.substationId && this.modeId)) {
      this.isValid = false;
      return;
    }
  }

  submitFilter() {
    const filter: FilterFixture = {
      geographId: '',
      ownerId: '',
      fixtureTypeId: '',
      substationId: '',
      modeId: '',
      contractId: this.selectContractId.toString(),
      nodeId: this.selectNodeId.toString()
    };

    if (this.geographId) {
      filter.geographId = this.geographId;
    }
    if (this.ownerId) {
      filter.ownerId = this.ownerId;
    }
    if (this.fixtureTypeId) {
      filter.fixtureTypeId = this.fixtureTypeId;
    }
    if (this.substationId) {
      filter.substationId = this.substationId;
    }
    if (this.modeId) {
      filter.modeId = this.modeId;
    }

    this.onFilter.emit(filter);
  }

}
