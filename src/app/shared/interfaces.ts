import {Input} from '@angular/core';

export class NavItem {
  displayName: string;
  rolerightId?: number;
  componentName?: string;
  disabled?: boolean; // скрывать/показывать элемент в соответсвие с назначенным правом
  expandable?: boolean; // раскрывать дочерние элементы, если данный элемент встроен в древовидное меню
  iconName?: string;
  route?: string;
  children?: NavItem[];
}

export class User {
  userId: number;
  contragentId: number;
  login: string;
  password: string;
  contragentCode: string;
  contragentName: string;
  contragentInn: string;
  contragentAdres: string;
  comments: string;
}

export interface FilterUser {
  roleId: string;
  contragentId: string;
  notRoleId: string;
}

export class Role {
  roleId: number;
  contragentId: number;
  password: string;
  contragentCode: string;
  contragentName: string;
  contragentInn: string;
  contragentAdres: string;
  name: string;
  comments: string;
}

export interface FilterRole {
  userId: string;
  notUserId: string;
}

export class Components {
  componentId: number;
  code: string;
  name: string;
  comments: string;
  rights: string;
}

export interface FilterComponent {
  roleId: string;
  userId: string;
}

export class Roleright {
  rolerightId: number;
  componentId: number;
  componentCode: string;
  componentName: string;
  componentComments: string;
  roleId: number;
  roleName: string;
  rights: string;
}

// export interface FilterRoleright {
//   roleId: string;
// }

export interface Message {
  message: string;
}

export interface Geograph {
  id: number;
  code: string;
  name: string;
  fullName: string;
}

export class GeographFias {
  postalCode: string;
  okato: string;
  fiasLevel: number;
  regionFiasId: string;
  regionWithType: string;
  areaFiasId: string;
  areaWithType: string;
  cityFiasId: string;
  cityWithType: string;
  cityDistrictFiasId: string;
  cityDistrictWithType: string;
  settlementFiasId: string;
  settlementWithType: string;
  streetFiasId: string;
  streetWithType: string;
  houseFiasId: string;
  houseWithType: string;
  geoLat: string;
  geoLon: string;
}


export interface Owner {
  id: number;
  code: string;
  name: string;
}

export class EquipmentType {
  id: number;
  code: string;
  name: string;
  model: string;
  comment: string;
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
  autoOpen?: boolean;
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
    source?: any[];
    theme: string;
    width: number;
    height: number;
    checkboxes: boolean;
    filterable: boolean;
    allowDrag: boolean;
  };
  grid: {
    source: any[];
    columns?: any[];
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
  setting: {
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
  geographFullName: string;
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
  geographFullName: string;
  n_coordinate: string;
  e_coordinate: string;
}

export interface FilterFixtureGroup {
  ownerId: any;
  fixtureGroupTypeId: any;
}

// export interface Substation {
//   id: number;
//   code: string;
//   name: string;
//   power: number;
// }

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

export class FixtureType {
  id: number;
  code: string;
  name: string;
  model: string;

  height: number;
  width: number;
  length: number;
  weight: number;

  countlamp: number;
  power: number;
  cos: number;
  ip: number;
  efficiency: number;

  comments: string;
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
  geographFullName: string;
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

export class NodeType {
  id: number;
  code: string;
  name: string;
  model: string;
  height: number;
  comments: string;
}

// export class NodeGateway {
//   nodeId: number;
//   gatewayId: number;
// }

// export class Contract {
//   id: number;
//   code: string;
//   name: string;
//   model: string;
//   comments: string;
//   height: number;
// }

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

export class GatewayType {
  id: number;
  code: string;
  name: string;
  model: string;
  comments: string;
  communicationStandard: string;
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

export class SensorType {
  id: number;
  code: string;
  name: string;
  model: string;
  comments: string;
  detectionRange: number;
}

// Contragent

export class CompanyDepartment {
  id: number;
  geographId: number;
  geographCode: string;
  geographName: string;
  geographFullName: string;
  code: string;
  name: string;
  inn: number;
  comments: string;
  orgFormId: number;
  orgFormCode: string;
}

export class Substation {
  id: number;
  geographId: number;
  geographCode: string;
  geographName: string;
  geographFullName: string;
  code: string;
  name: string;
  inn: number;
  comments: string;
  orgFormId: number;
  orgFormCode: string;
  power: number;
}

export class Person {
  id: number;
  geographId: number;
  geographCode: string;
  geographName: string;
  geographFullName: string;
  code: string;
  name: string;
  inn: number;
  comments: string;
  nameFirst: string;
  nameSecond: string;
  nameThird: string;
}

export interface OrgForm {
  id: number;
  code: string;
  name: string;
}

// Contract

export interface Contract {
  id: number;
  contractTypeId: number;
  senderId: number;
  recipientId: number;
  contractTypeCode: string;
  senderCode: string;
  recipientCode: string;
  code: string;
  name: string;
  comments: string;
}

export interface ContractType {
  id: number;
  code: string;
  name: string;
  comments: string;
}

// Reports

export interface ReportCountFixture {
  region: string;
  area: string;
  city: string;
  cityDistrict: string;
  settlement: string;
  street: string;
  house: string;
  codeContract: string;
  codeFixtureType: string;
  codeInstaller: string;
  codeSubstation: string;
  codeHeightType: string;
  codeOwner: string;
  fixtureId: number;
  countFixture: number;
}

export interface ReportPowerFixture {
  year: number;
  monthName: string;
  fixtureId: number;
  hours: number;
  kw: number;
  rub: number;
}
