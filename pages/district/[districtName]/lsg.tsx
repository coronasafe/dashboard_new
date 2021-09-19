import _ from "lodash";
import { GetServerSideProps } from "next";
import React from "react";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import {
  ACTIVATED_DISTRICTS,
  INITIAL_LSG_TRIVIA,
  PATIENT_TYPES,
  TESTS_TYPES,
} from "../../../lib/common";
import { columns, data } from "../../../utils/mock/GenericTableData";
import {
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";
import { careSummary, FacilityData } from "../../../lib/types";
import dayjs from "dayjs";
import { parseFacilityTypeFromQuery } from "../../../lib/common/processor";
import {
  getTodaysPatients,
  processLSG,
  processLSGTrivia,
} from "../../../lib/common/processor/lsgProcessor";

interface LSGTrivia {
  current: typeof INITIAL_LSG_TRIVIA;
  previous: typeof INITIAL_LSG_TRIVIA;
}

interface FilteredFacilites {
  created_date: string;
  total: number;
  today: number;
  facility: FacilityData;
  modified_date: string;
  data: FacilityData;
}

interface LSGProps {
  patientsToday: number;
  lsgTrivia: LSGTrivia;
  filtered: FilteredFacilites[];
}

const LSG = ({ filtered, patientsToday, lsgTrivia }: LSGProps) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={lsgTrivia.current.count} />
        <ValuePill title="Patient Count" value={patientsToday} />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(PATIENT_TYPES).map(([key, value], i) => {
          const theKey = key as keyof typeof PATIENT_TYPES;
          return (
            <InfoCard
              key={i}
              title={value}
              value={lsgTrivia.current[theKey].today}
              delta={lsgTrivia.current[theKey].total}
            />
          );
        })}
      </div>
      <div className="py-12">
        <TableExportHeader
          label="LSG"
          searchValue={""}
          setSearchValue={() => {}}
          className="mb-2"
        />
        <GenericTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const district = _.find(
    ACTIVATED_DISTRICTS,
    (obj) =>
      parameterize(obj.name) === parameterize(params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }

  const queryDate = String(query.date);

  const today = new Date();

  const _start_date = dayjs(queryDate || null, "YYYY-MM-DD").isValid()
    ? new Date(queryDate)
    : today;

  const _start_date_str = toDateString(_start_date);
  const start_date = toDateString(getNDateBefore(_start_date, 1));
  const end_date = toDateString(getNDateAfter(start_date, 2));
  const limit = 2000;

  const data = await careSummary(
    "district_patient",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processLSG(data);

  console.log(filtered);
  const lsgTrivia = processLSGTrivia(filtered, _start_date_str);

  const patientsToday = getTodaysPatients(filtered);

  return {
    props: {
      filtered,
      patientsToday,
      lsgTrivia,
    },
  };
};

export default LSG;
