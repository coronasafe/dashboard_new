import React from "react";
import { columns, data } from "../../utils/mock/OxygenTableData";
import { GenericTable } from "../Table";

interface OxygenFacilityCardProps {
  className?: string;
}
export const OxygenFacilityCard: React.FC<OxygenFacilityCardProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      <div className="fle">
        <h1 className="dark:text-white text-3xl">SANGEETH HOSPITAL</h1>
        <h1 className="text-base text-gray-400">Updated An Hour Ago</h1>
      </div>
      <div className="my-4">
        <span className="text-sm dark:bg-indigo-900 bg-indigo-200 rounded-full py-1 px-2 text-black dark:text-white">
          Private Hospital
        </span>
        <span className="text-sm text-black dark:text-white">
          +91 90127897812
        </span>
      </div>
      <GenericTable columns={columns} data={data} scroll={{ x: "900px" }} />
    </div>
  );
};
