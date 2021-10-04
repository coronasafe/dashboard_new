import React, { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS, TESTS_TYPES } from "../../../lib/common";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import { GetServerSideProps, GetStaticProps } from "next";
import {
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";
import { careSummary } from "../../../lib/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  parseFacilityTypeFromQuery,
  processFacilityDataUpdate,
  TestFacilitiesTrivia,
} from "../../../lib/common/processor";
import {
  getTestTableData,
  getTestTableRow,
  processTestExportData,
  processTestFacilitiesTriviaData,
  TestTableData,
} from "../../../lib/common/processor/testsProcessor";
import { Pagination } from "@windmill/react-ui";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

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

interface TestsProps {
  facilityTrivia: TestFacilitiesTrivia;
  tableData: TestTableData[];
  districtId: number | string;
  exportData: ReturnType<typeof processTestExportData>;
}

const Tests = ({
  districtId,
  exportData,
  facilityTrivia,
  tableData: initialTableData,
}: TestsProps) => {
  const tableDataFuse = useRef(
    new Fuse(initialTableData || [], {
      keys: ["name"],
      threshold: 0.4,
    })
  );

  const [tableData, setTableData] = useState<TestTableData[]>(
    initialTableData || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const tableRows = getTestTableRow(tableData);

  const [page, setPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const skip = (page - 1) * resultsPerPage;
    const end = skip + resultsPerPage;
    if (searchTerm.length) {
      const newData = tableDataFuse.current
        .search(searchTerm)
        .map((i) => i.item);
      setTableData(newData.slice(0, 10));
    } else {
      setTableData(initialTableData.slice(skip, end));
    }
  }, [searchTerm, page]);

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Facility Count"
          value={facilityTrivia?.current.count}
        />
        <ValuePill
          title="Patient Count"
          value={facilityTrivia?.current.total_patients}
        />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {facilityTrivia &&
          Object.entries(TESTS_TYPES).map(([k, val], i) => {
            const key = k as keyof typeof TESTS_TYPES;
            const title = val;
            const delta =
              facilityTrivia.current[key] - facilityTrivia.previous[key];
            if (key !== "total_patients") {
              return (
                <InfoCard
                  key={i}
                  title={title}
                  value={facilityTrivia.current[key]}
                  delta={delta}
                />
              );
            }
          })}
      </div>
      <div className="py-12">
        <TableExportHeader
          label="Facilities"
          searchValue={searchTerm}
          setSearchValue={(val) => setSearchTerm(val)}
          className="mb-2"
          exportData={exportData}
        />
        <GenericTable columns={columns} data={tableRows} />
        <div className="mt-4">
          <Pagination
            resultsPerPage={resultsPerPage}
            totalResults={
              searchTerm ? tableData.length : initialTableData.length
            }
            label="Test Summary"
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const district = ACTIVATED_DISTRICTS.find(
    (obj) =>
      parameterize(obj.name) === parameterize(params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }
  const queryDate = String(query.date);
  const facilityType = parseFacilityTypeFromQuery(
    query?.facility_type as string
  );

  const today = new Date();
  const _start_date = dayjs(queryDate || null, "YYYY-MM-DD").isValid()
    ? new Date(queryDate)
    : today;
  const _start_date_str = toDateString(_start_date);
  const start_date = toDateString(getNDateBefore(_start_date, 1));
  const end_date = toDateString(getNDateAfter(start_date, 2));
  const limit = 2000;

  const data = await careSummary(
    "tests",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results, facilityType);

  const facilityTrivia = processTestFacilitiesTriviaData(
    filtered,
    _start_date_str
  );
  const tableData = getTestTableData(filtered, _start_date_str);
  const exportData = processTestExportData(filtered, _start_date);
  return {
    props: {
      facilityTrivia,
      tableData,
      districtId: district.id,
      exportData,
    },
  };
};

export default Tests;
