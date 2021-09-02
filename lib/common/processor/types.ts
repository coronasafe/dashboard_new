import {
  processFacilityDataUpdate,
  processFacilityTriviaForCapacityUpdate,
} from ".";
import { PATIENT_TYPES } from "..";
import { CapacityBedData } from "../../../utils/parser";
import { processTestFacilitiesTriviaData } from "./testsProcessor";
import { processTriageFacilitiesTriviaData } from "./triageProcessor";

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

interface PatientCardData {
  total: number;
  today: number;
}
export interface PatientCardDataForCapacity {
  facility_name: string | null;
  id: string | null;
  facility_type: string | null;
  phone_number: string | null;
  last_updated: string | null;
  icu?: PatientCardData;
  oxygen_bed?: PatientCardData;
  bed_with_oxygen_support?: PatientCardData;
  icu_with_oxygen_support?: PatientCardData;
  not_admitted?: PatientCardData;
  home_isolation?: PatientCardData;
  isolation_room?: PatientCardData;
  home_quarantine?: PatientCardData;
  paediatric_ward?: PatientCardData;
  gynaecology_ward?: PatientCardData;
  icu_with_invasive_ventilator?: PatientCardData;
  icu_with_non_invasive_ventilator?: PatientCardData;
}

export type FacilitiesTrivia = ReturnType<
  typeof processFacilityTriviaForCapacityUpdate
>;
export type ProcessFacilityDataReturnType = ReturnType<
  typeof processFacilityDataUpdate
>;

export type capacityCardData = CapacityCardDataForCapacity;

export type PatientTypeKeys = keyof typeof PATIENT_TYPES;
export type PatientTypeTodayKeys = `today_patients_${PatientTypeKeys}`;
export type PatientTypeTotalKeys = `total_patients_${PatientTypeKeys}`;

export type TestFacilitiesTrivia = ReturnType<
  typeof processTestFacilitiesTriviaData
>;
