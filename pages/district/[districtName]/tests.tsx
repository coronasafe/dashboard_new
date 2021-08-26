// @ts-nocheck
import React from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS, TESTS_TYPES } from "../../../lib/common";
import { data } from "../../../utils/mock/GenericTableData";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import { GetServerSideProps } from "next";
import { parameterize, toDateString } from "../../../utils/parser";
import { careSummary } from "../../../lib/types";
import { processFacilityData } from "../../../lib/common/processor";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const initialFacilitiesTrivia = {
  count: 0,
  result_awaited: 0,
  test_discarded: 0,
  total_patients: 0,
  result_negative: 0,
  result_positive: 0,
};

const columns: ColumnType<DefaultRecordType>[] = [
  {
    title: "NAME",
    key: "name",
    dataIndex: "name",
    width: "16rem",
    align: "left",
  },
  {
    title: "LAST UPDATED",
    key: "lastUpdated",
    dataIndex: "lastUpdated",
    width: "8rem",
    align: "right",
  },
  {
    title: "RESULT AWAITED",
    key: "resultAwaited",
    dataIndex: "resultAwaited",
    width: "8rem",
    align: "right",
  },
  {
    title: "TESTS DISCARDED",
    key: "testsDiscarded",
    dataIndex: "testsDiscarded",
    width: "8rem",
    align: "right",
  },
  {
    title: "TOTAL PATIENTS",
    key: "totalPatients",
    dataIndex: "totalPatients",
    width: "8rem",
    align: "right",
  },
  {
    title: "NEGATIVE RESULTS",
    key: "negativeResults",
    dataIndex: "negativeResults",
    width: "8rem",
    align: "right",
  },
  {
    title: "POSITIVE RESULTS",
    key: "positiveResults",
    dataIndex: "positiveResults",
    width: "8rem",
    align: "right",
  },
];

const Tests = () => {
  const TableRow = (name: string, type: string, phone: string) => {
    return (
      <div>
        <a href="#">{name}</a>
        <p className="text-gray-400 mb-2">{type}</p>
        <p>{phone}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <ContentNav />

      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={1231} />
        <ValuePill title="Patient Count" value={432} />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(TESTS_TYPES).map(([key, value], i) => {
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
          label="Facilities"
          searchValue={""}
          setSearchValue={() => {}}
          className="mb-2"
        />
        <GenericTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const district = ACTIVATED_DISTRICTS.find(
    (obj) =>
      parameterize(obj.name) === parameterize(params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }

  const date = new Date();
  const data = await careSummary("tests", district.id);

  console.log(data);

  const filtered = processFacilityData(data.results);
  const facilityTrivia = filtered.reduce(
    (a, c) => {
      const key = c.date === toDateString(date) ? "current" : "previous";
      a[key].count += 1;
      Object.keys(TESTS_TYPES).forEach((k) => {
        a[key][k] += c[k];
        a[key][k] += c[k];
      });
      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );
  const tableData = filtered.reduce((a, c) => {
    if (c.date !== toDateString(date)) {
      return a;
    }
    return [
      ...a,
      [
        [c.name, c.facilityType, c.phoneNumber],
        dayjs(c.modifiedDate, "DD-MM-YYYY HH:mm").fromNow(),
        ...Object.keys(TESTS_TYPES).map((i) => c[i]),
      ],
    ];
  }, []);

  return {
    props: {
      facilityTrivia,
      tableData,
    },
  };
};

export default Tests;
