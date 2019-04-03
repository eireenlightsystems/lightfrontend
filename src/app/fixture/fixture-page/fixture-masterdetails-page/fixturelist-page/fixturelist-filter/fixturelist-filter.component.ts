import {Component, EventEmitter, Input, Output} from '@angular/core';

import {FilterFixture, FixtureType, Geograph, OwnerFixture, Substation} from '../../../../../shared/interfaces';


@Component({
  selector: 'app-fixturelist-filter',
  templateUrl: './fixturelist-filter.component.html',
  styleUrls: ['./fixturelist-filter.component.css']
})
export class FixturelistFilterComponent {

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

  // other variables
  isValid = true;
  geographId: number;
  ownerId: number;
  fixtureTypeId: number;
  substationId: number;
  modeId: number;
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
      filter.geographId = this.geographId.toString();
    }
    if (this.ownerId) {
      filter.ownerId = this.ownerId.toString();
    }
    if (this.fixtureTypeId) {
      filter.fixtureTypeId = this.fixtureTypeId.toString();
    }
    if (this.substationId) {
      filter.substationId = this.substationId.toString();
    }
    if (this.modeId) {
      filter.modeId = this.modeId.toString();
    }

    this.onFilter.emit(filter);
  }

}
