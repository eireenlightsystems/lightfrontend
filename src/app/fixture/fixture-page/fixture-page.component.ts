import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {
  CommandStatus,
  CommandType,
  Contract, FixtureGroupOwner, FixtureGroupType,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  OwnerFixture, SpeedDirection,
  Substation
} from '../../shared/interfaces';
import {GeographService} from '../../shared/services/geograph/geograph.service';
import {OwnerFixtureService} from '../../shared/services/fixture/ownerFixture.service';
import {FixtureTypeService} from '../../shared/services/fixture/fixtureType.service';
import {ContractFixtureService} from '../../shared/services/fixture/contractFixture.service';
import {InstallerFixtureService} from '../../shared/services/fixture/installerFixture.service';
import {HeightTypeService} from '../../shared/services/fixture/heightType.service';
import {SubstationService} from '../../shared/services/fixture/substation.service';
import {CommandSwitchTypeService} from '../../shared/services/command/commandSwitchType.service';
import {CommandStatusService} from '../../shared/services/command/commandStatus.service';
import {SpeedDirectionService} from '../../shared/services/command/speedDirection';
import {FixtureGroupService} from '../../shared/services/fixture/fixtureGroup.service';
import {CommandSpeedTypeService} from '../../shared/services/command/commandSpeedType.service';

@Component({
  selector: 'app-fixture-page',
  templateUrl: './fixture-page.component.html',
  styleUrls: ['./fixture-page.component.css']
})
export class FixturePageComponent implements OnInit, OnDestroy {

  // fixturecom subscription
  commandTypeSub: Subscription;
  commandStatusSub: Subscription;
  speedDirectionSub: Subscription;

  // node subscription
  geographSub: Subscription;

  // fixture subscription
  ownerFixtureSub: Subscription;
  fixtureTypeSub: Subscription;
  substationSub: Subscription;
  contractFixtureSub: Subscription;
  installerSub: Subscription;
  heightTypeSub: Subscription;

  // fixture group
  fixtureGroupTypeSub: Subscription;
  fixtureGroupOwnerSub: Subscription;

  // fixturecom source
  commandTypes: CommandType[];
  commandStatuses: CommandStatus[];
  speedDirectiones: SpeedDirection[];

  // node source
  geographs: Geograph[];

  // fixture source
  ownerFixtures: OwnerFixture[];
  fixtureTypes: FixtureType[];
  substations: Substation[];
  contractFixtures: Contract[];
  installers: Installer[];
  heightTypes: HeightType[];

  // fixture group source
  fixtureGroupTypes: FixtureGroupType[];
  fixtureGroupOwners: FixtureGroupOwner[];

  constructor(
    // fixturecom service
    private commandTypeService: CommandSwitchTypeService,
    private commandSpeedTypeService: CommandSpeedTypeService,
    private commandStatusService: CommandStatusService,
    private speedDirectionService: SpeedDirectionService,
    // node service
    private geographService: GeographService,
    // fixture service
    private ownerFixtureService: OwnerFixtureService,
    private fixtureTypeService: FixtureTypeService,
    private substationService: SubstationService,
    private contractFixtureService: ContractFixtureService,
    private installerService: InstallerFixtureService,
    private heightTypeService: HeightTypeService,
    // fixture group service
    private fixtureGroupService: FixtureGroupService) {
  }

  ngOnInit() {
    this.fetch_refbook();
  }

  ngOnDestroy(): void {
    // fixturecom subscription
    this.commandTypeSub.unsubscribe();
    this.commandStatusSub.unsubscribe();
    this.speedDirectionSub.unsubscribe();

    // node subscription
    this.geographSub.unsubscribe();

    // fixture subscription
    this.ownerFixtureSub.unsubscribe();
    this.fixtureTypeSub.unsubscribe();
    this.substationSub.unsubscribe();
    this.contractFixtureSub.unsubscribe();
    this.installerSub.unsubscribe();
    this.heightTypeSub.unsubscribe();

    // fixture group subscription
    this.fixtureGroupTypeSub.unsubscribe();
    this.fixtureGroupOwnerSub.unsubscribe();
  }

  fetch_refbook() {
    // fixturecom refbook
    this.commandTypeSub = this.commandTypeService.fetch().subscribe(commandTypes => this.commandTypes = commandTypes);
    this.commandStatusSub = this.commandStatusService.fetch().subscribe(commandStatuses => this.commandStatuses = commandStatuses);
    this.speedDirectionSub = this.speedDirectionService.fetch().subscribe(speedDirectiones => this.speedDirectiones = speedDirectiones);

    // node refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);

    // fixture refbook
    this.ownerFixtureSub = this.ownerFixtureService.fetch().subscribe(owners => this.ownerFixtures = owners);
    this.fixtureTypeSub = this.fixtureTypeService.fetch().subscribe(fixtureTypes => this.fixtureTypes = fixtureTypes);
    this.substationSub = this.substationService.fetch().subscribe(substations => this.substations = substations);
    this.contractFixtureSub = this.contractFixtureService.fetch().subscribe(contracts => this.contractFixtures = contracts);
    this.installerSub = this.installerService.fetch().subscribe(installers => this.installers = installers);
    this.heightTypeSub = this.heightTypeService.fetch().subscribe(heightTypes => this.heightTypes = heightTypes);

    // fixture group
    this.fixtureGroupTypeSub = this.fixtureGroupService.getFixtureGroupTypeAll().subscribe(fixtureGroupTypes => this.fixtureGroupTypes = fixtureGroupTypes);
    this.fixtureGroupOwnerSub = this.fixtureGroupService.getFixtureGroupOwnerAll().subscribe(fixtureGroupOwners => this.fixtureGroupOwners = fixtureGroupOwners);
  }


}
