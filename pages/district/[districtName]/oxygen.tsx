import { Pagination } from "@windmill/react-ui";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import ContentNav from "../../../components/ContentNav";
import { OxygenFacilityCard } from "../../../components/OxygenFacilityCard";
import { OxygenSummery } from "../../../components/OxygenSummery";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS, FACILITY_TYPES } from "../../../lib/common";
import {
  parseFacilityTypeFromQuery,
  processFacilityDataUpdate,
} from "../../../lib/common/processor";
import {
  getOxygenCardData,
  getOxygenFlatData,
  OxygenCardData,
  processOxygenExportData,
} from "../../../lib/common/processor/oxygenDataProcessor";
import { careSummary, Inventory } from "../../../lib/types";
import { ExportData } from "../../../lib/types/common";
import {
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";

interface OxygenProps {
  oxygenCardData: OxygenCardData[];
  oxygenFlatData: Inventory[];
  exportData: ExportData;
}

const Oxygen = ({
  oxygenCardData,
  oxygenFlatData,
  exportData,
}: OxygenProps) => {
  const [tableData, setTableData] = useState<OxygenCardData[]>([]);
  const tableDataFuse = useRef(
    new Fuse(oxygenCardData, { keys: ["facility_name"], threshold: 0.4 })
  );
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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
      setTableData(oxygenCardData.slice(skip, end));
    }
  }, [searchTerm, page]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="dark:text-gray-100 text-3xl my-4  round mt-12">
        District Summary
      </h1>

      <OxygenSummery data={oxygenFlatData} />
      <div className="py-12">
        <TableExportHeader
          label="Facilities"
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          className="mb-8"
          exportData={exportData}
        />
        {tableData.map((data, index) => (
          <OxygenFacilityCard className="mb-16" data={data} key={index} />
        ))}

        <div className="mt-4">
          <Pagination
            resultsPerPage={10}
            totalResults={oxygenCardData.length}
            label="Oxygen Summery"
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Oxygen;

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
  const facilityType = parseFacilityTypeFromQuery(query.facilityType as string);

  const today = new Date();

  const _start_date = dayjs(queryDate || null, "YYYY-MM-DD").isValid()
    ? new Date(queryDate)
    : today;
  const _start_date_str = toDateString(_start_date);
  const start_date = toDateString(getNDateBefore(_start_date, 1));
  const end_date = toDateString(getNDateAfter(start_date, 2));
  const limit = 2000;

  const data = await careSummary(
    "facility",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results, facilityType);
  const oxygenCardData = getOxygenCardData(filtered, _start_date_str);
  const oxygenFlatData = getOxygenFlatData(filtered, _start_date_str);
  const exportData = processOxygenExportData(filtered, _start_date);
  return {
    props: {
      oxygenCardData,
      oxygenFlatData,
      exportData,
    },
  };
};
