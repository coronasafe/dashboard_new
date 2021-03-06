import _ from "lodash";
import { ProcessFacilityDataReturnType } from ".";
import { INITIAL_TRIAGE_FACILITIES_TRIVIA, TRIAGE_TYPES } from "..";
import { toDateString } from "../../../utils/parser";
import Link from "next/link";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const processTriageFacilitiesTriviaData = (
  facility: ProcessFacilityDataReturnType,
  filterDate?: string
) => {
  const initial = {
    current: _.cloneDeep(INITIAL_TRIAGE_FACILITIES_TRIVIA),
    previous: _.cloneDeep(INITIAL_TRIAGE_FACILITIES_TRIVIA),
  };

  const getKey: (date: string) => keyof typeof initial = (date) =>
    date === (filterDate || toDateString(new Date())) ? "current" : "previous";

  return facility.reduce((a, c) => {
    const key = getKey(c.date);
    a[key].count += 1;

    Object.keys(TRIAGE_TYPES).forEach((k) => {
      const curKey = k as keyof typeof TRIAGE_TYPES;
      a[key][curKey] += c[curKey];
      a[key][curKey] += c[curKey];
    });
    return a;
  }, initial);
};

export interface TriageTableData {
  id: string | null;
  facility_name: string | null;
  facility_type: string | null;
  phone_number: string | null;
  modified_date: string | null;
  tests_discarded: number | null;
  patients_visited: string | null;
  patients_referred: string | null;
  patients_isolation: string | null;
  patients_home_quarantine: string | null;
}

export const getTriageTableData = (
  facility: ProcessFacilityDataReturnType,
  filterDate?: string
) => {
  return facility.reduce((a, c) => {
    if (c.date !== (filterDate || toDateString(new Date()))) {
      return a;
    }

    return [
      ...a,
      {
        id: c.id ?? null,
        facility_name: c.name ?? null,
        facility_type: c.facility_type ?? null,
        phone_number: c.phone_number ?? null,
        modified_date: c.modified_date ?? null,
        tests_discarded: c.test_discarded ?? null,
        patients_visited:
          `${c.avg_patients_visited ?? 0}/${c.total_patients_visited ?? 0}` ??
          null,
        patients_referred:
          `${c.avg_patients_referred ?? 0}/${c.total_patients_referred ?? 0}` ??
          null,
        patients_isolation:
          `${c.avg_patients_isolation ?? 0}/${
            c.total_patients_isolation ?? 0
          }` ?? null,
        patients_home_quarantine:
          `${c.avg_patients_home_quarantine ?? 0}/${
            c.total_patients_home_quarantine ?? 0
          }` ?? null,
      },
    ];
  }, [] as TriageTableData[]);
};

interface TriageTableRowProps {
  id: string | null;
  name: string | null;
  facility_type: string | null;
  phone_number: string | null;
}
const TriageTableRow: React.FC<TriageTableRowProps> = ({
  id,
  name,
  facility_type,
  phone_number,
}) => (
  <div>
    <Link href={`/facility/${id}`}>
      <a>{name} </a>
    </Link>
    <p className="text-gray-400 mb-2">{facility_type || "---"}</p>
    <p>{phone_number || "---"}</p>
  </div>
);

export const getTriageTableRow = (data: TriageTableData[]) => {
  return data.map((d) => {
    return {
      name: (
        <TriageTableRow
          name={d.facility_name}
          facility_type={d.facility_type}
          id={d.id}
          phone_number={d.phone_number}
        />
      ),
      lastUpdated: dayjs(d.modified_date, "YYYY-DD-MM").fromNow(),
      patientsVisited: d.patients_visited,
      testsDiscarded: d.tests_discarded,
      patientsReferred: d.patients_referred,
      patientsIsolation: d.patients_isolation,
      patientsHomeQuarantine: d.patients_home_quarantine,
    };
  });
};

export const processTriageExportData = (
  facilityData: ProcessFacilityDataReturnType,
  date: Date
) => {
  const filename = "triage_export.csv";

  const data = _.reduce(
    facilityData,
    (a, c) => {
      if (c.date !== toDateString(date)) {
        return a;
      }

      const additionalData = _.reduce(
        Object.keys(TRIAGE_TYPES),
        (acc, cur) => {
          const copy = _.cloneDeep(acc);
          const key = cur as unknown as keyof typeof TRIAGE_TYPES;
          copy[TRIAGE_TYPES[key]] = c[key] || 0;

          return copy;
        },
        {} as any
      );

      const newData = [
        ...a,
        {
          "Hospital/CFLTC Name": c.name,
          "Hospital/CFLTC Address": c.address,
          "Govt/Pvt": c.facility_type.startsWith("Govt") ? "Govt" : "Pvt",
          "Hops/CFLTC":
            c.facility_type === "First Line Treatment Centre"
              ? "CFLTC"
              : "Hops",
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
