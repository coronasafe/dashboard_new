import { Pagination } from "@windmill/react-ui";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import React, { useEffect, useState } from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS, TRIAGE_TYPES } from "../../../lib/common";
import {
  processFacilityDataUpdate,
  TriageFacilitiesTrivia,
} from "../../../lib/common/processor";
import {
  processTestFacilitiesTriviaData,
  getTestTableData,
} from "../../../lib/common/processor/testsProcessor";
import {
  getTriageTableData,
  getTriageTableRow,
  processTriageFacilitiesTriviaData,
  TriageTableData,
} from "../../../lib/common/processor/triageProcessor";
import { careSummary } from "../../../lib/types";
import { data } from "../../../utils/mock/GenericTableData";
import {
  getDistrictName,
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";

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
    title: "PATIENTS VISITED",
    key: "patientsVisited",
    dataIndex: "patientsVisited",
    width: "8rem",
    align: "right",
  },

  {
    title: "PATIENTS REFERRED",
    key: "patientsReferred",
    dataIndex: "patientsReferred",
    width: "7rem",
    align: "right",
  },
  {
    title: "PATIENTS ISOLATION",
    key: "patientsIsolation",
    dataIndex: "patientsIsolation",
    width: "7rem",
    align: "right",
  },
  {
    title: "PATIENTS HOME QUARANTINE",
    key: "patientsHomeQuarantine",
    dataIndex: "patientsHomeQuarantine",
    width: "10rem",
    align: "right",
  },
];

interface TriagesProps {
  facilityTrivia: TriageFacilitiesTrivia;
  tableData: TriageTableData[];
}

const Triage = ({
  facilityTrivia,
  tableData: initialTableData,
}: TriagesProps) => {
  const router = useRouter();

  const [tableData, setTableData] = useState<TriageTableData[]>([]);

  const tableRows = getTriageTableRow(tableData);

  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    setTableData(
      initialTableData.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    );
  }, [initialTableData, page]);

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Facility Count"
          value={facilityTrivia.current.count}
        />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(TRIAGE_TYPES).map(([k, val], i) => {
          const key = k as keyof typeof TRIAGE_TYPES;
          const title = val;
          const delta =
            facilityTrivia.current[key] - facilityTrivia.previous[key];

          return (
            <InfoCard
              key={i}
              title={title}
              value={facilityTrivia.current[key]}
              delta={delta}
            />
          );
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
            totalResults={initialTableData.length}
            label=""
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Triage;

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
    "triage",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results);

  const facilityTrivia = processTriageFacilitiesTriviaData(filtered);
  const tableData = getTriageTableData(filtered);

  return {
    props: {
      facilityTrivia,
      tableData,
    },
  };
};
