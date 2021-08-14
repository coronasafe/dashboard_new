import { Button, Input } from "@windmill/react-ui";
import clsx from "clsx";
import React from "react";

interface TableExportHeaderProps {
  label: string;
  data?: any;
  searchValue: string;
  setSearchValue: (value: string) => void;
  className?: string;
}

export const TableExportHeader: React.FC<TableExportHeaderProps> = ({
  data,
  label,
  searchValue,
  setSearchValue,
  className,
}) => {
  return (
    <div
      className={clsx(
        "items-center flex flex-col justify-between md:flex-row",
        className
      )}
    >
      <h1 className="dark:text-gray-100 text-3xl mb-4">{label}</h1>
      <div className="flex max-w-full space-x-4">
        {true && (
          // <CSVLink data={exported.data} filename={exported.filename}>
          <Button block>Export</Button>
          // </CSVLink>
        )}
        <Input
          css={{}}
          className="sw-40 rounded-lg sm:w-auto"
          placeholder="Search Facility"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
    </div>
  );
};
