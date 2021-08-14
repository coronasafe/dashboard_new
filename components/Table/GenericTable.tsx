import React from "react";
import Table from "rc-table";
import { ColumnsType, DefaultRecordType } from "rc-table/lib/interface";

interface GenericTableProps {
  data: DefaultRecordType[];
  columns: ColumnsType<DefaultRecordType>;
  scroll?: {
    x?: string | number | true;
    y?: string | number;
  };
}

export const GenericTable: React.FC<GenericTableProps> = ({
  data,
  columns,

  scroll = {
    x: 1500,
    y: process.browser ? window?.innerHeight : undefined,
  },
}) => {
  return <Table data={data} columns={columns} scroll={scroll} sticky={true} />;
};
