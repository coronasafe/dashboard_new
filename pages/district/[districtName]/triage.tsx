import { Pagination } from "@windmill/react-ui";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import React, { useEffect, useRef, useState } from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import {
  ACTIVATED_DISTRICTS,
  FACILITY_TYPES,
  TRIAGE_TYPES,
} from "../../../lib/common";
import {
  processFacilityDataUpdate,
  TriageFacilitiesTrivia,
} from "../../../lib/common/processor";
import {
  getTriageTableData,
  getTriageTableRow,
  processTriageExportData,
  processTriageFacilitiesTriviaData,
  TriageTableData,
} from "../../../lib/common/processor/triageProcessor";
import { careSummary } from "../../../lib/types";
import { ExportData } from "../../../lib/types/common";
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
  exportData: ExportData;
}

const Triage = ({
  facilityTrivia,
  tableData: initialTableData,
  exportData,
}: TriagesProps) => {
  const tableDataFuse = useRef(
    new Fuse(initialTableData, { keys: ["facility_name"], threshold: 0.4 })
  );
  const [tableData, setTableData] = useState<TriageTableData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRows = getTriageTableRow(tableData);

  const [page, setPage] = useState(0);
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
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          className="mb-2"
          exportData={exportData}
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
  const facilityType = (query?.facility_type as string)
    ?.split(",")
    .map((i) => {
      const key = parseInt(i.trim());
      return key >= 0 ? FACILITY_TYPES[key] : null;
    })
    .filter((i) => i != null) as string[];

  const today = new Date();

  const _start_date = dayjs(queryDate || null, "YYYY-MM-DD").isValid()
    ? new Date(queryDate)
    : today;
  const _start_date_str = toDateString(_start_date);
  const start_date = toDateString(getNDateBefore(_start_date, 1));
  const end_date = toDateString(getNDateAfter(start_date, 2));
  const limit = 2000;

  const data = await careSummary(
    "triage",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results, facilityType);

  const facilityTrivia = processTriageFacilitiesTriviaData(
    filtered,
    _start_date_str
  );
  const tableData = getTriageTableData(filtered, _start_date_str);

  const exportData = processTriageExportData(filtered, _start_date);

  return {
    props: {
      facilityTrivia,
      tableData,
      exportData,
    },
  };
};
