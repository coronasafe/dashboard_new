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
  ward: number;
  state: number;
  address: string;
  pincode: number;
  district: number;
  location: Location;
  local_body: number;
  ward_object: WardObject;
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

export interface CareSummary {
  count: number;
  next: string;
  previous: string;
  results: FacilitySummary[];
}

const careSummary = async (
  type: string,
  start_date: string,
  end_date: string,
  district: string,
  limit = 2000
): Promise<CareSummary> => {
  return axios
    .get(`/api/v1/${type}_summary`, {
      params: {
        start_date,
        end_date,
        district,
        limit,
      },
    })
    .then((response) => response.data)
    .catch(console.log);
};

const individualCareSummary = async (
  type: string,
  start_date: string,
  end_date: string,
  facility: string
): Promise<CareSummary> => {
  return axios
    .get(`/api/v1/${type}_summary/`, {
      params: {
        start_date,
        end_date,
        facility,
      },
    })
    .then((response) => response.data)
    .catch(console.log);
};

export { careSummary, individualCareSummary };
