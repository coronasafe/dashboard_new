import _ from "lodash";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS, PATIENT_TYPES, TESTS_TYPES } from "../../../lib/common";
import { columns, data } from "../../../utils/mock/GenericTableData";
import { getDistrictName, getNDateAfter, getNDateBefore, parameterize, toDateString } from "../../../utils/parser";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { careSummary } from "../../../lib/types";

const INITIAL_LSG_TRIVIA = {
  count: 0,
  icu: { total: 0, today: 0 },
  oxygen_bed: { total: 0, today: 0 },
  not_admitted: { total: 0, today: 0 },
  home_isolation: { total: 0, today: 0 },
  isolation_room: { total: 0, today: 0 },
  home_quarantine: { total: 0, today: 0 },
  paediatric_ward: { total: 0, today: 0 },
  gynaecology_ward: { total: 0, today: 0 },
  icu_with_invasive_ventilator: { total: 0, today: 0 },
  icu_with_non_invasive_ventilator: { total: 0, today: 0 },
};

const LSG = () => {
  const router = useRouter();

  const districtName = getDistrictName(router.query.districtName?.toString());

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={1231} />
        <ValuePill title="Patient Count" value={432} />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(PATIENT_TYPES).map(([key, value], i) => {
          if (key !== "total_patients") {
            return (
              <InfoCard
                key={i}
                title={value}
                //@ts-ignore
                value={Math.random() * 500 + 200}
                delta={
                  //@ts-ignore
                  (Math.random() * 100 + 50) * (Math.random() > 0.5 ? -1 : 1)
                }
              />
            );
          }
        })}
      </div>
      <div className="py-12">
        <TableExportHeader
          label="LSG"
          searchValue={""}
          setSearchValue={() => { }}
          className="mb-2"
        />
        <GenericTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const district = _.find(
    ACTIVATED_DISTRICTS,
    (obj) =>
      parameterize(obj.name) === parameterize(context.params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }

  const today = new Date();
  const start_date = toDateString(getNDateBefore(today, 1));
  const end_date = toDateString(getNDateAfter(today, 1));
  const limit = 5000;

  const response = await careSummary(
    "patient",
    context.params?.districtID as string,
    limit,
    start_date,
    end_date
  );

  const filtered = response.results.flatMap((summary) => {
    return {
      ...summary,
      created_date: toDateString(new Date(summary.created_date)),
      total: _.keys(PATIENT_TYPES).map(type => summary.data[`total_patients_${type}`] || 0).reduce((a: number, b: number) => a + b, 0) as number,
      today: _.keys(PATIENT_TYPES).map(type => summary.data[`today_patients_${type}`] || 0).reduce((a: number, b: number) => a + b, 0) as number,
    };
  });

  return {
    props: {

    }
  }
}

export default LSG;
