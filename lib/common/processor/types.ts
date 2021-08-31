import {
  processFacilityDataUpdate,
  processFacilityTriviaForCapacityUpdate,
} from ".";
import { CapacityBedData } from "../../../utils/parser";

export interface CapacityCardDataForCapacity {
  facility_name: string | null;
  facility_id: string | null;
  facility_type: string | null;
  phone_number: string | null;
  last_updated: string | null;
  patient_discharged: string | null;
  covid: CapacityBedData[] | null;
  non_covid: CapacityBedData[] | null;
  final_total: CapacityBedData[] | null;
}

export type FacilitiesTrivia = ReturnType<
  typeof processFacilityTriviaForCapacityUpdate
>;
export type FacilityData = ReturnType<typeof processFacilityDataUpdate>;

export type capacityCardData = CapacityCardDataForCapacity;
