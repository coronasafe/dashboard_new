import dayjs from "dayjs";
import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";
import React from "react";
import { Activity, Clock, Database } from "react-feather";
import relativeTime from "dayjs/plugin//relativeTime";

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
    key: "liquidOxygen",
    dataIndex: "liquidOxygen",
    width: "1rem",
    align: "right",
  },
  {
    title: "CYLINDER D",
    key: "cylinderD",
    dataIndex: "cylinderD",
    width: "1rem",
    align: "right",
  },
  {
    title: "CYLINDER C",
    key: "cylinderC",
    dataIndex: "cylinderC",
    width: "1rem",
    align: "right",
  },
  {
    title: "CYLINDER B",
    key: "cylinderB",
    dataIndex: "cylinderB",
    width: "1rem",
    align: "right",
  },
];

export const data = [
  {
    name: "Last Updated",
    liquidOxygen: dayjs(new Date("2021-8-12")).fromNow(),
    cylinderD: dayjs(new Date("2021-8-13")).fromNow(),
    cylinderC: dayjs(new Date("2021-8-14")).fromNow(),
    cylinderB: dayjs(new Date("2021-8-11")).fromNow(),
  },
  {
    name: (
      <div className="flex">
        <Database className="text-blue-500 mr-4" />
        <h1 className="dark:text-white text-lg">Quantity</h1>
      </div>
    ),
    liquidOxygen: "---",
    cylinderD: (
      <div>
        <h1 className="text-red-500 text-xl">
          19/19 <span className="text-base text-gray-400">Cylinders</span>{" "}
        </h1>
      </div>
    ),
    cylinderC: (
      <div>
        <h1 className="text-red-500 text-xl">
          2/1 <span className="text-base text-gray-400">Cylinders</span>{" "}
        </h1>
      </div>
    ),
    cylinderB: (
      <div>
        <h1 className="text-red-500 text-xl">
          3/1 <span className="text-base text-gray-400">Cylinders</span>{" "}
        </h1>
      </div>
    ),
  },
  {
    name: (
      <div className="flex">
        <Activity className="text-yellow-400 mr-4" />
        <h1 className="dark:text-white text-lg">Burn Rate</h1>
      </div>
    ),
    liquidOxygen: "---",
    cylinderD: (
      <div>
        <h1 className="text-red-500 text-xl">
          0.14 <span className="text-base text-gray-400">Cylinders/Hr</span>{" "}
        </h1>
      </div>
    ),
    cylinderC: "---",
    cylinderB: (
      <div>
        <h1 className="text-red-500 text-xl">
          0.04 <span className="text-base text-gray-400">Cylinders/Hr</span>{" "}
        </h1>
      </div>
    ),
  },
  {
    name: (
      <div className="flex">
        <Clock className="text-green-500 mr-4" />
        <h1 className="dark:text-white text-lg">Time To Empty</h1>
      </div>
    ),
    liquidOxygen: "---",
    cylinderD: (
      <div>
        <h1 className="text-red-500 text-xl">
          48.00 <span className="text-base text-gray-400">Hr</span>
        </h1>
      </div>
    ),
    cylinderC: (
      <div>
        <h1 className="text-red-500 text-xl">
          112.00 <span className="text-base text-gray-400">Hr</span>
        </h1>
      </div>
    ),
    cylinderB: (
      <div>
        <h1 className="text-red-500 text-xl">
          5 <span className="text-base text-gray-400">Hr</span>
        </h1>
      </div>
    ),
  },
];
