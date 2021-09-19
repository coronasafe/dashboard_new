import _ from "lodash";
import { processLSGReturnType } from ".";
import { INITIAL_LSG_TRIVIA, PATIENT_TYPES } from "..";
import { toDateString } from "../../../utils/parser";
import { CareSummaryResponse } from "../../types";

export const processLSG = (data: CareSummaryResponse) => {
  return data?.results
    .flatMap((summary) => {
      return {
        ...summary,
        created_date: toDateString(new Date(summary.created_date)),
        total: _.keys(PATIENT_TYPES)
          .map((type) => summary.data[`total_patients_${type}`] || 0)
          .reduce((a: number, b: number) => a + b, 0) as number,
        today: _.keys(PATIENT_TYPES)
          .map((type) => summary.data[`today_patients_${type}`] || 0)
          .reduce((a: number, b: number) => a + b, 0) as number,
      };
    })
    .sort((a, b) => b.total - a.total);
};

export const processLSGTrivia = (
  data: processLSGReturnType,
  filterDate?: string
) => {
  const initial = {
    current: _.cloneDeep(INITIAL_LSG_TRIVIA),
    previous: _.cloneDeep(INITIAL_LSG_TRIVIA),
  };

  const getKey: (date: string) => keyof typeof initial = (date) =>
    date === (filterDate || toDateString(new Date())) ? "current" : "previous";

  return data.reduce((acc, curr) => {
    const key = getKey(curr.created_date);
    const patientKeys = _.keys(PATIENT_TYPES) as (keyof typeof PATIENT_TYPES)[];
    console.log({ curr });
    acc[key].count += 1;
    patientKeys.forEach((type) => {
      acc[key][type].today += curr.data[`today_patients_${type}`] || 0;
      acc[key][type].total += curr.data[`total_patients_${type}`] || 0;
    });

    return acc;
  }, initial);
};

export const getTodaysPatients = (data: processLSGReturnType) => {
  return data.reduce((acc, curr) => {
    acc += curr.today;
    return acc;
  }, 0);
};
