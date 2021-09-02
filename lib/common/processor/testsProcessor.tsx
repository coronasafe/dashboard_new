import dayjs from "dayjs";
import _ from "lodash";
import React from "react";
import Link from "next/link";
import { ProcessFacilityDataReturnType } from ".";
import { INITIAL_TEST_FACILITIES_TRIVIA, TESTS_TYPES } from "..";
import { toDateString } from "../../../utils/parser";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const processTestFacilitiesTriviaData = (
  facility: ProcessFacilityDataReturnType
) => {
  const initial = {
    current: _.cloneDeep(INITIAL_TEST_FACILITIES_TRIVIA),
    previous: _.cloneDeep(INITIAL_TEST_FACILITIES_TRIVIA),
  };

  const getKey: (date: string) => keyof typeof initial = (date) =>
    date === toDateString(new Date()) ? "current" : "previous";

  return facility.reduce((a, c) => {
    const key = getKey(c.date);
    a[key].count += 1;

    Object.keys(TESTS_TYPES).forEach((k) => {
      const curKey = k as keyof typeof TESTS_TYPES;
      a[key][curKey] += c[curKey];
      a[key][curKey] += c[curKey];
    });
    return a;
  }, initial);
};

export interface TestTableData {
  id: string | null;
  name: string | null;
  facility_type: string | null;
  phone_number: string | null;
  modified_date: string | null;
  result_awaited: number | null;
  test_discarded: number | null;
  total_patients: number | null;
  result_negative: number | null;
  result_positive: number | null;
}

export const getTestTableData = (facility: ProcessFacilityDataReturnType) => {
  const date = new Date();
  return facility.reduce((a, c) => {
    if (c.date !== toDateString(date)) {
      return a;
    }

    return [
      ...a,
      {
        id: c.id,
        name: c.name,
        facility_type: c.facility_type,
        phone_number: c.phone_number,
        modified_date: c.modified_date,
        result_awaited: c.result_awaited,
        test_discarded: c.test_discarded,
        total_patients: c.total_patients,
        result_negative: c.result_negative,
        result_positive: c.result_positive,
      },
    ];
  }, [] as TestTableData[]);
};

interface TestTableRowProps {
  id: string | null;
  name: string | null;
  facility_type: string | null;
  phone_number: string | null;
}
const TestTableRow: React.FC<TestTableRowProps> = ({
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

export const getTestTableRow = (data: TestTableData[]) => {
  return data.map((d) => {
    return {
      name: (
        <TestTableRow
          name={d.name}
          facility_type={d.facility_type}
          id={d.id}
          phone_number={d.phone_number}
        />
      ),
      lastUpdated: dayjs(d.modified_date, "YYYY-DD-MM").fromNow(),
      resultAwaited: d.result_awaited,
      testsDiscarded: d.test_discarded,
      totalPatients: d.total_patients,
      negativeResults: d.result_negative,
      positiveResults: d.result_positive,
    };
  });
};
