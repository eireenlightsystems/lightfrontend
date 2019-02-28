export class Fixture{
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
