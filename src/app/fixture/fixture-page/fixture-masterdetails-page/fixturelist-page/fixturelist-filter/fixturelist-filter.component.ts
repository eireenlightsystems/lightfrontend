import {Component, EventEmitter, Input, Output} from '@angular/core';

import {FilterFixture, FixtureType, Geograph, Owner_fixture, Substation} from "../../../../../shared/interfaces";


@Component({
  selector: 'app-fixturelist-filter',
  templateUrl: './fixturelist-filter.component.html',
  styleUrls: ['./fixturelist-filter.component.css']
})
export class FixturelistFilterComponent {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_fixtures: Owner_fixture[]
  @Input() fixtureTypes: FixtureType[]
  @Input() substations: Substation[]
  //for filtering from master component
  @Input() id_contract_select: number
  @Input() id_node_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterFixture>()

  //other variables
  isValid = true
  id_geograph: number
  id_owner: number
  id_fixture_type: number
  id_substation: number
  id_mode: number
  modes = [
    {
      id_mode: 0,
      name_mode: "Вкл."
    },
    {
      id_mode: 1,
      name_mode: "Выкл."
    }
  ]

  constructor() {
  }

  validate() {
    if (!(this.id_geograph && this.id_owner && this.id_fixture_type && this.id_substation && this.id_mode)) {
      this.isValid = false
      return
    }
  }

  submitFilter() {
    const filter: FilterFixture = {
      id_geograph: -1,
      id_owner: -1,
      id_fixture_type: -1,
      id_substation: -1,
      id_mode: -1,
      id_contract: this.id_contract_select,
      id_node: this.id_node_select
    }

    if (this.id_geograph) {
      filter.id_geograph = this.id_geograph
    }
    if (this.id_owner) {
      filter.id_owner = this.id_owner
    }
    if (this.id_fixture_type) {
      filter.id_fixture_type = this.id_fixture_type
    }
    if (this.id_substation) {
      filter.id_substation = this.id_substation
    }
    if (this.id_mode) {
      filter.id_mode = this.id_mode
    }

    this.onFilter.emit(filter)
  }

}
