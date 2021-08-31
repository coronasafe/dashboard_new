import dayjs from "dayjs";
import _ from "lodash";
import {
  PatientCardDataForCapacity,
  PatientTypeKeys,
  PatientTypeTodayKeys,
  PatientTypeTotalKeys,
  ProcessFacilityDataReturnType,
} from ".";
import { INITIAL_PATIENT_FACILITY_TRIVIA, PATIENT_TYPES } from "..";
import { toDateString } from "../../../utils/parser";

export const processPatientFacilitiesTriviaData = (
  facility: ProcessFacilityDataReturnType
) => {
  const initial = {
    current: _.cloneDeep(INITIAL_PATIENT_FACILITY_TRIVIA),
    previous: _.cloneDeep(INITIAL_PATIENT_FACILITY_TRIVIA),
  };

  const getKey: (date: string) => keyof typeof initial = (date) =>
    date === toDateString(new Date()) ? "current" : "previous";

  return facility.reduce((a, c) => {
    const key = getKey(c.date);
    a[key].count += 1;

    Object.keys(PATIENT_TYPES).forEach((k) => {
      const curKey = k as PatientTypeKeys;
      const todayKey = `today_patients_${curKey}` as PatientTypeTodayKeys;
      const totalKey = `total_patients_${curKey}` as PatientTypeTotalKeys;
      a[key][curKey].today += c[todayKey] || 0;
      a[key][curKey].total += c[totalKey] || 0;
    });

    return a;
  }, initial);
};

export const processPatientCardData = (
  facility: ProcessFacilityDataReturnType
) => {
  return facility.reduce((acc, curr) => {
    const date = new Date();
    if (curr.date !== toDateString(date)) return acc;

    const newData: PatientCardDataForCapacity = {
      id: curr.id,
      facility_name: curr.name,
      facility_type: curr.facility_type,
      phone_number: curr.phone_number,
      last_updated: dayjs(curr.modified_date).fromNow(),
    };

    Object.keys(PATIENT_TYPES).forEach((k) => {
      const curKey = k as PatientTypeKeys;
      const todayKey = `today_patients_${curKey}` as PatientTypeTodayKeys;
      const totalKey = `total_patients_${curKey}` as PatientTypeTotalKeys;
      newData[curKey] = {
        total: curr[totalKey] || 0,
        today: curr[todayKey] || 0,
      };
    });

    return [...acc, newData];
  }, [] as PatientCardDataForCapacity[]);
};
