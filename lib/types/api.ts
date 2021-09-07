import axios from "axios";

export interface FacilitySummary {
  facility: FacilityData;
  created_date: string;
  modified_date: string;
  data: FacilityData;
}

export interface FacilityData {
  id: string;
  name: string;
  date: string;
  ward: number;
  state: number;
  address: string;
  pincode: number;
  district: number;
  location: Location;
  local_body: number;
  ward_object: WardObject;
  capacity?: { [key: string]: Capacity };
  inventory?: [Inventory, Inventory, Inventory, Inventory];
  availability?: Availability[];
  created_date: string;
  phone_number: string;
  state_object: StateObject;
  facility_type: string;
  modified_date: string;
  district_object: DistrictObject;
  kasp_empanelled: boolean;
  oxygen_capacity: number;
  type_b_cylinders: number;
  type_c_cylinders: number;
  type_d_cylinders: number;
  local_body_object: LocalBodyObject;
  expected_type_b_cylinders: number;
  expected_type_c_cylinders: number;
  expected_type_d_cylinders: number;
  expected_oxygen_requirement: number;
  actual_discharged_patients: number;
  actual_live_patients: number;
  // patient
  today_patients_not_admitted: number;
  total_patients_not_admitted: number;
  today_patients_home_isolation: number;
  today_patients_isolation_room: number;
  total_patients_home_isolation: number;
  total_patients_isolation_room: number;
  today_patients_home_quarantine: number;
  today_patients_paediatric_ward: number;
  total_patients_home_quarantine: number;
  total_patients_paediatric_ward: number;
  today_patients_gynaecology_ward: number;
  total_patients_gynaecology_ward: number;
  today_patients_bed_with_oxygen_support: number;
  today_patients_icu_with_oxygen_support: number;
  total_patients_bed_with_oxygen_support: number;
  today_patients_icu: number;
  total_patients_icu: number;
  total_patients_icu_with_oxygen_support: number;
  today_patients_icu_with_invasive_ventilator: number;
  total_patients_icu_with_invasive_ventilator: number;
  today_patients_icu_with_non_invasive_ventilator: number;
  total_patients_icu_with_non_invasive_ventilator: number;
  // test
  result_awaited: number;
  result_negative: number;
  result_positive: number;
  test_discarded: number;
  total_patients: number;
  total_tests: number;
  [key: string]: any;
  // triage
  avg_patients_visited: number;
  avg_patients_referred: number;
  avg_patients_isolation: number;
  avg_patients_home_quarantine: number;
  total_patients_visited: number;
  total_patients_referred: number;
  total_patients_isolation: number;
  // total_patients_home_quarantine: number
}

export interface SummaryCount {
  total: number;
  today: number;
}

export interface PatientSummary {
  icu: SummaryCount;
  oxygen_bed: SummaryCount;
  bed_with_oxygen_support: SummaryCount;
  icu_with_oxygen_support: SummaryCount;
  not_admitted: SummaryCount;
  home_isolation: SummaryCount;
  isolation_room: SummaryCount;
  home_quarantine: SummaryCount;
  paediatric_ward: SummaryCount;
  gynaecology_ward: SummaryCount;
  icu_with_invasive_ventilator: SummaryCount;
  icu_with_non_invasive_ventilator: SummaryCount;
  [key: string]: SummaryCount;
}

export interface Inventory {
  unit: string;
  stock: number;
  is_low: boolean;
  burn_rate: number;
  end_stock: number;
  item_name: "PPE";
  start_stock: number;
  total_added: number;
  modified_date: string;
  total_consumed: number;
}

export interface Capacity {
  total_capacity: number | string;
  current_capacity: number | string;
}

export interface Availability {
  id: string;
  room_type: number;
  modified_date: string;
  room_type_text: string;
  total_capacity: number;
  current_capacity: number;
}

export interface DistrictObject {
  id: number;
  name: string;
  state: number;
}

export interface LocalBodyObject {
  id: number;
  name: string;
  district: number;
  body_type: number;
  localbody_code: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface StateObject {
  id: number;
  name: string;
}

export interface WardObject {
  id: number;
  name: string;
  number: number;
  local_body: number;
}

export interface CareSummaryResponse {
  count: number;
  next: string;
  previous: string;
  results: FacilitySummary[];
}

interface CareSummary {
  (
    type: "facility" | "triage" | "patient" | "tests" | "district_patient",
    district: string | number,
    limit?: number,
    start_date?: string,
    end_date?: string
  ): Promise<CareSummaryResponse>;
}

interface IndividualCareSummary {
  (
    type: "facility" | "triage" | "patient" | "tests" | "district_patient",
    facility: string | number,
    start_date?: string,
    end_date?: string
  ): Promise<CareSummaryResponse>;
}

const careSummary: CareSummary = async (
  type,
  district,
  limit = 2000,
  start_date?,
  end_date?
) => {
  return axios
    .get(`https://dashboard.coronasafe.network/api/v1/${type}_summary`, {
      params: {
        start_date,
        end_date,
        district,
        limit,
      },
      headers: {
        Accept: "application/json",
      },
    })
    .then((response) => response.data)
    .catch((_) =>
      console.log(
        "Something unknown happened when trying to make a network request"
      )
    );
};

const individualCareSummary: IndividualCareSummary = async (
  type,
  facility,
  start_date?,
  end_date?
) => {
  return axios
    .get(`/api/v1/${type}_summary/`, {
      params: {
        start_date,
        end_date,
        facility,
      },
      headers: {
        Accept: "application/json",
      },
    })
    .then((response) => response.data)
    .catch((_) =>
      console.log(
        "Something unknown happened when trying to make a network request"
      )
    );
};

export { careSummary, individualCareSummary };
