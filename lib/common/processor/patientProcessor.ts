import dayjs from "dayjs";
import _ from "lodash";
import {
  PatientCardDataForCapacity,
  PatientTypeKeys,
  PatientTypeTodayKeys,
  PatientTypeTotalKeys,
  ProcessFacilityDataReturnType,
} from ".";
import {
  GOVT_FACILITY_TYPES,
  INITIAL_PATIENT_FACILITY_TRIVIA,
  PATIENT_TYPES,
} from "..";
import { toDateString } from "../../../utils/parser";

export const processPatientFacilitiesTriviaData = (
  facility: ProcessFacilityDataReturnType,
  filterDate?: string
) => {
  const initial = {
    current: _.cloneDeep(INITIAL_PATIENT_FACILITY_TRIVIA),
    previous: _.cloneDeep(INITIAL_PATIENT_FACILITY_TRIVIA),
  };

  const getKey: (date: string) => keyof typeof initial = (date) =>
    date === (filterDate || toDateString(new Date())) ? "current" : "previous";

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
  facility: ProcessFacilityDataReturnType,
  filterDate?: string
) => {
  return facility.reduce((acc, curr) => {
    if (curr.date !== (filterDate || toDateString(new Date()))) {
      return acc;
    }

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

export const processPatientExportData = (
  facilityData: ProcessFacilityDataReturnType,
  date: Date
) => {
  const filename = "patient_export.csv";

  const data = _.reduce(
    facilityData,
    (a, c) => {
      if (c.date !== toDateString(date)) {
        return a;
      }

      const additionalData = _.reduce(
        Object.keys(PATIENT_TYPES),
        (acc, cur) => {
          const copy = _.cloneDeep(acc);
          const key = cur as unknown as keyof typeof PATIENT_TYPES;
          copy[`Total Patient in ${PATIENT_TYPES[key]}`] =
            //@ts-ignore
            c[`total_patients_${key}`];

          return copy;
        },
        {} as any
      );

      const newData = [
        ...a,
        {
          "Hospital/CFLTC Name": c.name || null,
          "Hospital/CFLTC Address": c.address || null,
          "Govt/Pvt": c.facility_type.startsWith("Govt") ? "Govt" : "Pvt",
          "Hops/CFLTC":
            c.facility_type === "First Line Treatment Centre"
              ? "CFLTC"
              : "Hops" || null,
          Mobile: c.phone_number ? String(c.phone_number) : null,
          ...additionalData,
        },
      ];
      return newData;
    },
    [] as any[]
  );

  return { data, filename };
};
