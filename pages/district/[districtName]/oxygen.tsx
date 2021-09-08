import { Pagination } from "@windmill/react-ui";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import ContentNav from "../../../components/ContentNav";
import { OxygenFacilityCard } from "../../../components/OxygenFacilityCard";
import { OxygenSummery } from "../../../components/OxygenSummery";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { ACTIVATED_DISTRICTS } from "../../../lib/common";
import { processFacilityDataUpdate } from "../../../lib/common/processor";
import {
  getOxygenCardData,
  getOxygenFlatData,
  OxygenCardData,
} from "../../../lib/common/processor/oxygenDataProcessor";
import { careSummary, Inventory } from "../../../lib/types";
import {
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";

interface OxygenProps {
  oxygenCardData: OxygenCardData[];
  oxygenFlatData: Inventory[];
}

const Oxygen = ({ oxygenCardData, oxygenFlatData }: OxygenProps) => {
  const [tableData, setTableData] = useState<OxygenCardData[]>([]);
  const [page, setPage] = useState(0);

  const resultsPerPage = 10;

  useEffect(() => {
    setTableData(
      oxygenCardData.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    );
  }, [oxygenCardData, page]);

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <h1 className="dark:text-gray-100 text-3xl my-4  round mt-12">
        District Summary
      </h1>

      <OxygenSummery data={oxygenFlatData} />

      <div className="mt-16 my-4">
        <TableExportHeader
          label="Facilities"
          searchValue={""}
          setSearchValue={() => { }}
          className="mb-2"
        />
      </div>
      <div className="py-12">
        <TableExportHeader
          label="Facilities"
          searchValue={""}
          setSearchValue={() => { }}
          className="mb-2"
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
    "facility",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results);
  const oxygenCardData = getOxygenCardData(filtered);
  const oxygenFlatData = getOxygenFlatData(filtered);

  return {
    props: {
      oxygenCardData,
      oxygenFlatData,
    },
  };
};
