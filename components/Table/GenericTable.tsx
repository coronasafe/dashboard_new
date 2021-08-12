import React from "react";
import Table from "rc-table";
import {
  ColumnsType,
  DefaultRecordType,
  TableComponents,
} from "rc-table/lib/interface";

interface GenericTableProps {
  data: DefaultRecordType[];
  columns: ColumnsType<DefaultRecordType>;
}

export const GenericTable: React.FC<GenericTableProps> = ({
  data,
  columns,
}) => {
  return (
    <Table
      data={data}
      columns={columns}
      scroll={{ x: 1500, y: window?.innerHeight }}
      sticky={true}
    />
  );
};
