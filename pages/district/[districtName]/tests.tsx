import React, { useEffect, useState } from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS, TESTS_TYPES } from "../../../lib/common";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import { GetServerSideProps } from "next";
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
  processFacilityDataUpdate,
  TestFacilitiesTrivia,
} from "../../../lib/common/processor";
import {
  getTestTableData,
  getTestTableRow,
  processTestFacilitiesTriviaData,
  TestTableData,
} from "../../../lib/common/processor/testsProcessor";
import { Pagination } from "@windmill/react-ui";
import axios from "axios";
import useSWR from "swr";
import Loader from "../../../lib/assets/icons/LoaderIcon";

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
}

const Tests = ({
  facilityTrivia: initialFacilityTrivia,
  tableData: initialTableData,
  districtId,
}: TestsProps) => {
  const { data } = useSWR<TestsProps>("/api/patient/summary", () =>
    axios
      .get("/api/tests", { params: { districtId: districtId } })
      .then((res) => res.data?.data)
  );

  const facilityTrivia = data?.facilityTrivia || initialFacilityTrivia;

  const [tableData, setTableData] = useState<TestTableData[]>(
    data?.tableData || initialTableData || []
  );

  const [results, setResults] = useState<TestTableData[]>([]);
  const tableRows = getTestTableRow(results);

  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    setResults(
      tableData.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    );
  }, [page]);

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Facility Count"
          value={facilityTrivia.current.count}
        />
        <ValuePill
          title="Patient Count"
          value={facilityTrivia.current.total_patients}
        />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(TESTS_TYPES).map(([k, val], i) => {
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
          searchValue={""}
          setSearchValue={() => {}}
          className="mb-2"
        />
        <GenericTable columns={columns} data={tableRows} />
        <div className="mt-4">
          <Pagination
            resultsPerPage={10}
            totalResults={tableData.length}
            label="Test Summary"
            onChange={(page) => setPage(page)}
          />
        </div>
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

  const today = new Date();
  const start_date = toDateString(getNDateBefore(today, 1));
  const end_date = toDateString(getNDateAfter(today, 1));
  const limit = 2000;

  const data = await careSummary(
    "tests",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results);

  const facilityTrivia = processTestFacilitiesTriviaData(filtered);
  const tableData = getTestTableData(filtered);

  return {
    props: {
      facilityTrivia,
      tableData,
      districtId: district.id,
    },
  };
};

export default Tests;
