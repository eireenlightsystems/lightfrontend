import {Input} from '@angular/core';

export interface User {
  login: string;
  password: string;
}

export interface Message {
  message: string;
}

export interface Geograph {
  id: number;
  code: string;
  fullName: string;
}

export interface Contract {
  id: number;
  code: string;
  name: string;
}

export interface Owner {
  id: number;
  code: string;
  name: string;
}

export interface EquipmentType {
  id: number;
  code: string;
  name: string;
  model: string;
}

export interface SourceForFilter {
  name: string;
  type: string;
  source: any[];
  theme: string;
  width: string;
  height: string;
  placeHolder: string;
  displayMember: string;
  valueMember: string;
  defaultValue: any;
  selectId: string;
}

export interface SettingWinForEditForm {
  code: string;
  name: string;
  theme: string;
  isModal: boolean;
  modalOpacity: number;
  width: number;
  maxWidth: number;
  minWidth: number;
  height: number;
  maxHeight: number;
  minHeight: number;
  coordX: number;
  coordY: number;
}

export interface SourceForEditForm {
  nameField: string;
  type: string;
  source: any[];
  theme: string;
  width: string;
  height: string;
  placeHolder: string;
  displayMember: string;
  valueMember: string;
  selectedIndex: number;
  selectId: string;
  selectCode: string;
  selectName: string;
}

export interface SourceForLinkForm {
  window: {
    code: string;
    name: string;
    theme: string;
    autoOpen: boolean;
    isModal: boolean;
    modalOpacity: number;
    width: number;
    maxWidth: number;
    minWidth: number;
    height: number;
    maxHeight: number;
    minHeight: number;
  };
  grid: {
    source: any[];
    columns: any[];
    theme: string;
    width: number;
    height: number;
    columnsresize: boolean;
    sortable: boolean;
    filterable: boolean;
    altrows: boolean;
    selectionmode: string;

    valueMember: string;
    sortcolumn: any[];
    sortdirection: string;
    selectId: any[];
  };
}

export interface SourceForJqxGrid {
  listbox: {
    source: any[];
    theme: string;
    width: number;
    height: number;
    checkboxes: boolean;
    filterable: boolean;
    allowDrag: boolean;
  };
  grid: {
    source: any[];
    columns: any[];
    theme: string;
    width: number;
    height: number;

    columnsresize: boolean;
    sortable: boolean;
    filterable: boolean;
    altrows: boolean;
    selectionmode: string;
    isMasterGrid: boolean;

    valueMember: string;
    sortcolumn: any[];
    sortdirection: string;
    selectId: any[];
  };
}

export class ItemsLinkForm {
  code: string;
  Ids: number[];
}

export class SettingButtonPanel {
  add: {
    visible: boolean;
    disabled: boolean;
  };
  upd: {
    visible: boolean;
    disabled: boolean;
  };
  del: {
    visible: boolean;
    disabled: boolean;
  };
  refresh: {
    visible: boolean;
    disabled: boolean;
  };
  filterNone: {
    visible: boolean;
    disabled: boolean;
  };
  filterList: {
    visible: boolean;
    disabled: boolean;
  };
  place: {
    visible: boolean;
    disabled: boolean;
  };
  pinDrop: {
    visible: boolean;
    disabled: boolean;
  };
  groupIn: {
    visible: boolean;
    disabled: boolean;
  };
  groupOut: {
    visible: boolean;
    disabled: boolean;
  };
  switchOn: {
    visible: boolean;
    disabled: boolean;
  };
  switchOff: {
    visible: boolean;
    disabled: boolean;
  };
}

// Fixture

export class Fixture {
  fixtureId: number;
  contractId: number;
  fixtureTypeId: number;
  geographId: number;
  installerId: number;
  substationId: number;
  heightTypeId: number;
  ownerId: number;
  nodeId: number;

  contractCode: string;
  fixtureTypeCode: string;
  fixtureTypeModel: string;
  geographCode: string;
  installerCode: string;
  substationCode: string;
  heightTypeCode: string;
  ownerCode: string;

  n_coordinate: number;
  e_coordinate: number;

  serialNumber: string;
  comment: string;

  workLevel: number;
  standbyLevel: number;
  speedUp: number;
  speedDown: number;
  flgLight: string;

  dateedit: string;
  useredit: number;
}

export interface FilterFixture {
  geographId: string;
  ownerId: string;
  fixtureTypeId: string;
  substationId: string;
  modeId: string;

  contractId: string;
  nodeId: string;
}

export class FixtureGroup {
  fixtureGroupId: number;
  fixtureGroupTypeId: number;
  ownerId: number;
  geographId: number;
  fixtureGroupName: string;
  fixtureGroupTypeName: string;
  ownerCode: string;
  geographCode: string;
  n_coordinate: string;
  e_coordinate: string;
}

export interface FilterFixtureGroup {
  ownerId: any;
  fixtureGroupTypeId: any;
}

export interface Substation {
  id: number;
  code: string;
  name: string;
  power: number;
}

export interface Installer {
  id: number;
  code: string;
  name: string;
}

export interface HeightType {
  id: number;
  code: string;
  name: string;
}

export interface FixtureGroupType {
  id: number;
  name: string;
}

// Node

export class Node {
  nodeId: number;
  contractId: number;
  nodeTypeId: number;
  geographId: number;
  ownerId: number;
  gatewayId: number;

  numberInGroup: string;
  contractCode: string;
  nodeTypeCode: string;
  geographCode: string;
  ownerCode: string;

  n_coordinate: number;
  e_coordinate: number;

  serialNumber: string;
  comment: string;

  dateedit: string;
  useredit: number;
}

export interface FilterNode {
  geographId: string;
  ownerId: string;
  nodeTypeId: string;
  contractId: string;

  gatewayId: string;
}

export class NodeGateway {
  nodeId: number;
  gatewayId: number;
}

// Gateway

export class Gateway {
  gatewayId: number;
  contractId: number;
  gatewayTypeId: number;
  ownerId: number;
  geographId: number;
  nodeId: number;

  contractCode: string;
  ownerCode: string;
  gatewayTypeCode: string;
  geographCode: string;

  n_coordinate: number;
  e_coordinate: number;

  nodeGroupName: string;
  serialNumber: string;
  comment: string;

  dateedit: string;
  useredit: number;
}

export interface FilterGateway {
  geographId: string;
  ownerId: string;
  gatewayTypeId: string;
  contractId: string;
  nodeId: string;
}

// Command

export class CommandSwitch {
  commandId: number;
  fixtureId: number;
  startDateTime: string;
  workLevel: number;
  standbyLevel: number;
  statusId: number;
  statusName: string;
}

export class FilterCommandSwitch {
  fixtureId: string;
  statusId: string;
  startDateTime: string;
  endDateTime: string;
}

export class CommandSwitchDflt {
  statusId: number;
}

export class CommandSpeedSwitch {
  commandId: number;
  fixtureId: number;
  statusId: number;
  speedDirectionId: number;
  speed: number;
  startDateTime: string;
  statusName: string;
  speedDirectionName: string;
}

export class FilterCommandSpeedSwitch {
  fixtureId: string;
  statusId: string;
  speedDirectionId: string;
  startDateTime: string;
  endDateTime: string;
}

export class CommandSpeedSwitchDflt {
  statusId: number;
}

export interface CommandType {
  id: number;
  code: string;
  name: string;
}

export interface CommandStatus {
  id: number;
  code: string;
  name: string;
}

// Sensor

export class Sensor {
  sensorId: number;
  contractId: number;
  sensorTypeId: number;
  ownerId: number;
  geographId: number;
  nodeId: number;

  contractCode: string;
  ownerCode: string;
  sensorTypeCode: string;
  geographCode: string;

  n_coordinate: number;
  e_coordinate: number;
  serialNumber: string;
  comment: string;

  dateedit: string;
  useredit: number;
}

export interface FilterSensor {
  geographId: string;
  ownerId: string;
  sensorTypeId: string;
  contractId: string;
  nodeId: string;
}

export interface NodeSensor {
  nodeId: number;
  sensorId: number;
}
