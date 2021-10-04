import clsx from "clsx";
import _, { isNumber } from "lodash";
import { ArrowDown, ArrowUp } from "react-feather";
import { PatientTypeKeys, PatientTypeTotalKeys, processLSGReturnType } from ".";
import { INITIAL_LSG_TRIVIA, PATIENT_TYPES } from "..";
import { toDateString } from "../../../utils/parser";
import { CareSummaryResponse, DistrictSummaryResponse } from "../../types";

export const processLSG = (summery: DistrictSummaryResponse) => {
  const filtered = summery.results
    .flatMap(({ data, created_date }) =>
      Object.keys(data).map((key, _index) => {
        if (!_.isFinite(+key)) {
          return null;
        }
        const typeKey = key as unknown as number;
        return {
          created_date: toDateString(new Date(created_date)),
          total: _.keys(PATIENT_TYPES)
            .map(
              (k) =>
                data[typeKey][`total_patients_${k as PatientTypeKeys}`] || 0
            )
            .reduce((a, b) => a + b, 0),
          total_today: Object.keys(PATIENT_TYPES)
            .map(
              (k) =>
                data[typeKey][`today_patients_${k as PatientTypeKeys}`] || 0
            )
            .reduce((a, b) => a + b, 0),
          ...data[typeKey],
        };
      })
    )
    .filter((i) => !!i)
    .sort((a, b) => (a && b ? b.total - a.total : -1));

  return filtered;
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
    if (!curr) return acc;
    const key = getKey(curr.created_date);
    const patientKeys = _.keys(PATIENT_TYPES) as (keyof typeof PATIENT_TYPES)[];
    acc[key].count += 1;
    patientKeys.forEach((type) => {
      acc[key][type].today += curr[`today_patients_${type}`] || 0;
      acc[key][type].total += curr[`total_patients_${type}`] || 0;
    });

    return acc;
  }, initial);
};

export const getTodaysPatients = (data: processLSGReturnType) => {
  return data.reduce((acc, curr) => {
    acc += curr?.total_today || 0;
    return acc;
  }, 0);
};

export const processLSGExportData = (
  facilityData: processLSGReturnType,
  date: Date
) => {
  return {
    filename: "patient_export.csv",
    data: facilityData.reduce((a, c) => {
      if (c?.created_date !== toDateString(date)) {
        return a;
      }
      return [
        ...a,
        {
          Name: c.name,
          ...Object.keys(PATIENT_TYPES).reduce((t, x) => {
            const key = `total_patients_${x}` as PatientTypeTotalKeys;
            const xKey = x as PatientTypeKeys;
            return {
              ...t,
              [`Total Patient in ${PATIENT_TYPES[xKey]}`]: c[key],
            };
          }, {}),
        },
      ];
    }, [] as any[]),
  };
};

const LSGValueWithDelta = ({ value = 0, delta = 0 }) => {
  const isDeltaPositive = delta > 0;
  return (
    <div>
      <p>{value} </p>
      {delta !== 0 && (
        <span
          className={clsx(
            "flex items-center justify-end",
            isDeltaPositive ? "text-green-500" : "text-red-500"
          )}
        >
          {isDeltaPositive ? (
            <ArrowUp className="inline-block" size={20} />
          ) : (
            <ArrowDown className="inline-block" size={20} />
          )}
          {delta}
        </span>
      )}
    </div>
  );
};

export const getLsgTableRows = (data: processLSGReturnType) => {
  const date = new Date();
  return data.reduce((a, c) => {
    if (c?.created_date !== toDateString(date)) {
      return a;
    }

    return [
      ...a,
      {
        name: c.name,
        live: <LSGValueWithDelta value={c.total} delta={c.total_today} />,
        discharged: c.total_inactive,
        ...Object.keys(PATIENT_TYPES).reduce((acc, curr) => {
          const key = curr as PatientTypeKeys;
          const delta = c[`today_patients_${key}`] || 0;
          const value = c[`total_patients_${key}`];

          return {
            ...acc,
            [key]: <LSGValueWithDelta key={key} value={value} delta={delta} />,
          };
        }, {}),
      },
    ];
  }, [] as any[]);
};
