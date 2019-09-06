// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// jqwidgets
// app interfaces
import {
  CompanyDepartment,
  Contract,
  ContractType,
  FixtureType,
  GatewayType,
  NavItem,
  NodeType,
  Person,
  SensorType, Substation
} from '../../../interfaces';
// app services
// app components
import {ContractComponent} from '../../../../dictionary/contract/contract.component';
import {EquipmentTypeComponent} from '../../../../dictionary/equipment-type/equipment-type.component';
import {ContragentComponent} from '../../../../dictionary/contragent/contragent.component';

@Component({
  selector: 'app-dictionary-layout',
  templateUrl: './dictionary-layout.component.html',
  styleUrls: ['./dictionary-layout.component.css']
})
export class DictionaryLayoutComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  @Input() contracts: Contract[];
  @Input() contractTypes: ContractType[];
  @Input() fixtureTypes: FixtureType[];
  @Input() nodeTypes: NodeType[];
  @Input() gatewayTypes: GatewayType[];
  @Input() sensorTypes: SensorType[];
  @Input() companies: CompanyDepartment[];
  @Input() persons: Person[];
  @Input() substations: Substation[];

  // determine the functions that need to be performed in the parent component
  @Output() onGetContracts = new EventEmitter();
  @Output() onGetContractTypes = new EventEmitter();
  @Output() onGetFixtureTypes = new EventEmitter();
  @Output() onGetNodeTypes = new EventEmitter();
  @Output() onGetGatewayTypes = new EventEmitter();
  @Output() onGetSensorTypes = new EventEmitter();
  @Output() onGetCompanies = new EventEmitter();
  @Output() onGetPersons = new EventEmitter();
  @Output() onGetSubstations = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('contractComponent', {static: false}) contractComponent: ContractComponent;
  @ViewChild('equipmentTypeComponent', {static: false}) equipmentTypeComponent: EquipmentTypeComponent;
  @ViewChild('contragentComponent', {static: false}) contragentComponent: ContragentComponent;

  // other variables
  // grid


  constructor(private route: ActivatedRoute,
              private router: Router,
              // service
  ) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  getContracts() {
    this.onGetContracts.emit();
  }

  getContractTypes() {
    this.onGetContractTypes.emit();
  }

  getFixtureTypes() {
    this.onGetFixtureTypes.emit();
  }

  getNodeTypes() {
    this.onGetNodeTypes.emit();
  }

  getGatewayTypes() {
    this.onGetGatewayTypes.emit();
  }

  getSensorTypes() {
    this.onGetSensorTypes.emit();
  }

  getCompanies() {
    this.onGetCompanies.emit();
  }

  getPersons() {
    this.onGetPersons.emit();
  }

  getSubstations() {
    this.onGetSubstations.emit();
  }
}
