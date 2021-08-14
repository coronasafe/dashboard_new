import { useRouter } from "next/router";
import React from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { GenericTable } from "../../../components/Table";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { TRIAGE_TYPES } from "../../../lib/common";
import { columns, data } from "../../../utils/mock/GenericTableData";
import { getDistrictName } from "../../../utils/parser";

const Triage = () => {
  const router = useRouter();

  const districtName = getDistrictName(router.query.districtName?.toString());

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={123} />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(TRIAGE_TYPES).map(([key, value], i) => {
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

export default Triage;
