export interface User {
  login: string
  password: string
}

export interface Message {
  message: string
}

export interface Geograph {
  id_geograph: number
  code_geograph: string
}

export interface Contract {
  id_contract: number;
  code_contract: string;
  name_contract: string;
}



export interface Fixture {
  id_fixture: number;
  id_contract: number;
  id_fixture_type: number;
  id_geograph: number;
  id_installer: number;
  id_substation: number;
  id_height_type: number;
  id_owner: number;
  id_node: number;

  code_contract: string;
  code_fixture_type: string;
  model_fixture_type: string;
  road_category_type_code: string;
  code_geograph: string;
  code_installer: string;
  code_substation: string;
  code_height_type: string;
  code_owner: string;

  length: number;
  width: number;
  height: number;
  weight: number;
  n_coordinate: number;
  e_coordinate: number;

  numline: number;
  side: string;
  flg_chief: boolean;
  price: number;
  comments: string;

  work_level: number;
  standby_level: number;
  speed_zero_to_full: number;
  speed_full_to_zero: number;
  flg_light: string;

  dateedit: string;
  useredit: number;
}

export interface FilterFixture {
  id_geograph: number
  id_owner: number
  id_fixture_type: number
  id_substation: number
  id_mode: number

  id_contract: number
  id_node: number
}

export interface Owner_fixture{
  id_owner: number
  name_owner: string
}

export interface FixtureType {
  id_fixture_type: number
  code_fixture_type: string
  model_fixture_type: string
}

export interface Substation{
  id_substation: number
  code: string
  name: string
  power: number
}

export interface Installer {
  id_installer: number;
  code: string;
  name: string;
}

export interface HeightType{
  id_height_type: number;
  code: string;
  name: string;
}



export interface Node {
  id_node: number;
  id_contract: number;
  id_node_type: number;
  id_geograph: number;
  id_owner_node: number;

  num_node: string;
  code_contract: string;
  code_node_type: string;
  code_geograph: string;
  code_owner: string;

  n_coordinate: number;
  e_coordinate: number;
  price: number;
  comments: string;

  dateedit: string;
  useredit: number;
}

export interface FilterNode {
  id_geograph: number
  id_owner: number
  id_node_type: number
  id_contract: number

  id_gateway: number
}

export interface Owner_node{
  id_owner: number
  name_owner: string
}

export interface NodeType {
  id_node_type: number
  code_node_type: string
}



export interface Gateway {
  id_gateway: number;
  id_contract: number;
  id_gateway_type: number;
  id_owner: number;
  id_geograph: number;
  id_node: number;

  code_contract: string;
  code_owner: string;
  code_gateway_type: string;
  code_geograph: string;

  n_coordinate: number;
  e_coordinate: number;
  price: number;
  comments: string;

  dateedit: string;
  useredit: number;
}

export interface FilterGateway {
  id_geograph: number
  id_owner: number
  id_gateway_type: number
  id_contract: number
  id_node: number
}

export interface Owner_gateway{
  id_owner: number
  name_owner: string
}

export interface GatewayType {
  id_gateway_type: number
  code_gateway_type: string
}

export interface GatewayNode {
  gatewayNodeId: number;
  gatewayId: number;
  nodeId: number;
  numNode: number;
}

export interface NodeGateway {
  nodeId: number;
  gatewayId: number;
}

export interface GatewayGroup {
  id_gateway: number;
  id_node: number;
  n_coordinate: number;
  e_coordinate: number;
  name_group: string;
}

export interface NodeInGroup {
  id_node: number;
  id_gateway_node: number;
  id_gateway: number;
  num_node: string;
  n_coordinate: number;
  e_coordinate: number;
}


export interface CommandSwitch {
  commandId: number;
  fixtureId: number;
  startDateTime: string;
  workLevel: number;
  standbyLevel: number;
  statusId: number;
  statusName: string;
}

export interface FilterCommandSwitch {
  fixtureId: number
  statusId: number
  startDateTime: string
  endDateTime: string
}

export interface CommandSwitchDflt {
  statusId: number;
}

export interface CommandSpeedSwitch {
  commandId: number;
  fixtureId: number;
  statusId: number;
  speedDirectionId: number;
  speed: number;
  startDateTime: string;
  statusName: string;
  speedDirectionName: string;
}

export interface FilterCommandSpeedSwitch {
  fixtureId: number
  statusId: number
  speedDirectionId: number
  startDateTime: string
  endDateTime: string
}

export interface CommandSpeedSwitchDflt {
  statusId: number;
}

export interface SpeedDirection {
  id_speed_direction: number;
  code_speed_direction: string;
  name_speed_direction: string;
}

export interface CommandType {
  id_command_type: number
  code_command_type: string
  name_command_type: string
}

export interface CommandStatus {
  id_command_status: number
  code_command_status: string
  name_command_status: string
}
