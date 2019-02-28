import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";

import {
  CommandStatus,
  CommandType,
  Contract,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  Owner_fixture, SpeedDirection,
  Substation
} from "../../shared/interfaces";
import {GeographService} from "../../shared/services/geograph/geograph.service";
import {Owner_fixtureService} from "../../shared/services/fixture/owner_fixture.service";
import {FixtureTypeService} from "../../shared/services/fixture/fixtureType.service";
import {Contract_fixtureService} from "../../shared/services/fixture/contract_fixture.service";
import {Installer_fixtureService} from "../../shared/services/fixture/installer_fixture.service";
import {HeightTypeService} from "../../shared/services/fixture/heightType.service";
import {SubstationService} from "../../shared/services/fixture/substation.service";
import {CommandTypeService} from "../../shared/services/command/commandType.service";
import {CommandStatusService} from "../../shared/services/command/commandStatus.service";
import {SpeedDirectionService} from "../../shared/services/command/speedDirection";

@Component({
  selector: 'app-fixture-page',
  templateUrl: './fixture-page.component.html',
  styleUrls: ['./fixture-page.component.css']
})
export class FixturePageComponent implements OnInit, OnDestroy {

  //fixturecom subscription
  commandTypeSub: Subscription
  commandStatusSub: Subscription
  speedDirectionSub: Subscription

  //node subscription
  geographSub: Subscription

  //fixture subscription
  owner_fixtureSub: Subscription
  fixtureTypeSub: Subscription
  substationSub: Subscription
  contract_fixtureSub: Subscription
  installerSub: Subscription
  heightTypeSub: Subscription

  //fixturecom source
  commandTypes: CommandType[]
  commandStatuses: CommandStatus[]
  speedDirectiones: SpeedDirection[]

  //node source
  geographs: Geograph[]

  //fixture source
  owner_fixtures: Owner_fixture[];
  fixtureTypes: FixtureType[];
  substations: Substation[];
  contract_fixtures: Contract[];
  installers: Installer[];
  heightTypes: HeightType[];

  constructor(
    //fixturecom service
    private commandTypeService: CommandTypeService,
    private commandStatusService: CommandStatusService,
    private speedDirectionService: SpeedDirectionService,
    //node service
    private geographService: GeographService,
    //fixture service
    private owner_fixtureService: Owner_fixtureService,
    private fixtureTypeService: FixtureTypeService,
    private substationService: SubstationService,
    private contract_fixtureService: Contract_fixtureService,
    private installerService: Installer_fixtureService,
    private heightTypeService: HeightTypeService) {
  }

  ngOnInit() {
    this.fetch_refbook()
  }

  ngOnDestroy(): void {
    //fixturecom subscription
    this.commandTypeSub.unsubscribe()
    this.commandStatusSub.unsubscribe()
    this.speedDirectionSub.unsubscribe()

    //node subscription
    this.geographSub.unsubscribe()

    //fixture subscription
    this.owner_fixtureSub.unsubscribe()
    this.fixtureTypeSub.unsubscribe()
    this.substationSub.unsubscribe()
    this.contract_fixtureSub.unsubscribe()
    this.installerSub.unsubscribe()
    this.heightTypeSub.unsubscribe()
  }

  fetch_refbook() {
    //fixturecom refbook
    this.commandTypeSub = this.commandTypeService.fetch().subscribe(commandTypes => this.commandTypes = commandTypes);
    this.commandStatusSub = this.commandStatusService.fetch().subscribe(commandStatuses => this.commandStatuses = commandStatuses);
    this.speedDirectionSub = this.speedDirectionService.fetch().subscribe(speedDirectiones => this.speedDirectiones = speedDirectiones);

    //node refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);

    //fixture refbook
    this.owner_fixtureSub = this.owner_fixtureService.fetch().subscribe(owners => this.owner_fixtures = owners);
    this.fixtureTypeSub = this.fixtureTypeService.fetch().subscribe(fixtureTypes => this.fixtureTypes = fixtureTypes);
    this.substationSub = this.substationService.fetch().subscribe(substations => this.substations = substations);
    this.contract_fixtureSub = this.contract_fixtureService.fetch().subscribe(contracts => this.contract_fixtures = contracts);
    this.installerSub = this.installerService.fetch().subscribe(installers => this.installers = installers);
    this.heightTypeSub = this.heightTypeService.fetch().subscribe(heightTypes => this.heightTypes = heightTypes);
  }


}
