import dayjs from "dayjs";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import React from "react";
import relativeTime from "dayjs/plugin//relativeTime";
import { OXYGEN_INVENTORY_STRING_ENUM } from "../../lib/common";

dayjs.extend(relativeTime);

export const columns: ColumnType<DefaultRecordType>[] = [
  {
    title: "",
    key: "name",
    dataIndex: "name",
    width: "1rem",
    align: "left",
  },
  {
    title: "LIQUID OXYGEN",
    key: OXYGEN_INVENTORY_STRING_ENUM.oxygen_capacity,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.oxygen_capacity,
    width: "1rem",
    align: "right",
  },
  {
    title: "CYLINDER D",
    key: OXYGEN_INVENTORY_STRING_ENUM.type_d_cylinders,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.type_d_cylinders,
    width: "1rem",
    align: "right",
  },
  {
    title: "CYLINDER C",
    key: OXYGEN_INVENTORY_STRING_ENUM.type_c_cylinders,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.type_c_cylinders,
    width: "1rem",
    align: "right",
  },
  {
    title: "CYLINDER B",
    key: OXYGEN_INVENTORY_STRING_ENUM.type_b_cylinders,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.type_b_cylinders,
    width: "1rem",
    align: "right",
  },
];
