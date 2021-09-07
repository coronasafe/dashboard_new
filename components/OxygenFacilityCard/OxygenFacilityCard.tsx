import React from "react";
import {
  getOxygenTableRows,
  OxygenCardData,
} from "../../lib/common/processor/oxygenDataProcessor";
import { columns } from "../../utils/mock/OxygenTableData";
import { GenericTable } from "../Table";

interface OxygenFacilityCardProps {
  className?: string;
  data: OxygenCardData;
}
export const OxygenFacilityCard: React.FC<OxygenFacilityCardProps> = ({
  className,
  data,
}) => {
  const { facility_name, facility_last_updated, facility_type, phone_number } =
    data;
  const tableData = getOxygenTableRows(data);
  return (
    <div className={className}>
      <div className="fle">
        <h1 className="dark:text-white text-3xl">{facility_name}</h1>
        <h1 className="text-base text-gray-400">{facility_last_updated}</h1>
      </div>
      <div className="my-4">
        <span className="text-sm dark:bg-indigo-900 bg-indigo-200 rounded-full py-1 px-2 text-black dark:text-white">
          {facility_type}
        </span>
        <span className="text-sm text-black dark:text-white">
          {phone_number}
        </span>
      </div>
      <GenericTable
        columns={columns}
        data={tableData}
        scroll={{ x: "900px" }}
      />
    </div>
  );
};
