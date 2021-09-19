import clsx from "clsx";
import dayjs from "dayjs";
import _ from "lodash";
import React from "react";
import { Database, Activity, Clock, AlertTriangle } from "react-feather";
import { ProcessFacilityDataReturnType } from ".";
import {
  OXYGEN_INVENTORY,
  OXYGEN_INVENTORY_ENUM,
  OXYGEN_INVENTORY_MAP,
  OXYGEN_INVENTORY_NAME,
} from "..";
import { toDateString } from "../../../utils/parser";
import { Inventory } from "../../types";

type TNull<T> = T | null;
type StringNullMap = {
  oxygen_capacity: TNull<string>;
  type_d_cylinders: TNull<string>;
  type_c_cylinders: TNull<string>;
  type_b_cylinders: TNull<string>;
};
type BoolNullMap = {
  oxygen_capacity: TNull<boolean>;
  type_d_cylinders: TNull<boolean>;
  type_c_cylinders: TNull<boolean>;
  type_b_cylinders: TNull<boolean>;
};

export interface OxygenCardData {
  facility_id: TNull<string>;
  facility_name: TNull<string>;
  facility_type: TNull<string>;
  phone_number: TNull<string>;
  facility_last_updated: TNull<string>;
  last_updated: StringNullMap;
  quantity: StringNullMap;
  burn_rate: StringNullMap;
  time_to_empty: StringNullMap;
  quantity_unit: StringNullMap;
  is_low: BoolNullMap;
}

const initialValue = {
  oxygen_capacity: null,
  type_d_cylinders: null,
  type_c_cylinders: null,
  type_b_cylinders: null,
};
const getCardData = (facility: ProcessFacilityDataReturnType[number]) => {
  const last_updated: StringNullMap = { ...initialValue };
  const quantity: StringNullMap = { ...initialValue };
  const burn_rate: StringNullMap = { ...initialValue };
  const time_to_empty: StringNullMap = { ...initialValue };
  const quantity_unit: StringNullMap = { ...initialValue };
  const is_low: BoolNullMap = { ...initialValue };

  Object.entries(OXYGEN_INVENTORY_MAP).forEach(([k, id], i) => {
    if (facility?.inventory?.[id]) {
      const last_updated_date = dayjs(
        facility.inventory?.[id].modified_date
      ).fromNow();

      const curType = OXYGEN_INVENTORY_ENUM[
        id
      ] as unknown as keyof typeof OXYGEN_INVENTORY_ENUM;

      const quantity_info = `${facility.inventory?.[id]?.stock?.toFixed(2)} / ${
        curType === "oxygen_capacity"
          ? (facility[curType] * 0.8778).toFixed(2)
          : facility[curType]
      }`;

      const cur_quantity_unit = facility.inventory[id]?.unit;
      const cur_burn_rate =
        facility.inventory[id]?.burn_rate > 0
          ? facility.inventory[id]?.burn_rate?.toFixed(2)
          : "";
      const time_info =
        facility.inventory[id]?.burn_rate > 0
          ? (
              facility.inventory[id]?.stock / facility.inventory[id]?.burn_rate
            ).toFixed(2)
          : "";

      const key = k as keyof typeof OXYGEN_INVENTORY_MAP;

      last_updated[key] = last_updated_date;
      quantity[key] = quantity_info;
      quantity_unit[key] = cur_quantity_unit;
      burn_rate[key] = cur_burn_rate;
      time_to_empty[key] = time_info;
      is_low[key] = facility.inventory[id]?.is_low;
    }
  });

  const data = {
    last_updated,
    quantity,
    burn_rate,
    time_to_empty,
    quantity_unit,
    is_low,
  };

  // console.log(data);

  return data;
};

export const getOxygenCardData = (
  data: ProcessFacilityDataReturnType,
  filterDate?: string
): OxygenCardData[] => {
  return data.reduce((acc, cur) => {
    if (cur.date === (filterDate || toDateString(new Date()))) {
      if (
        cur.inventory &&
        Object.keys(cur.inventory).length !== 0 &&
        Object.keys(cur.inventory).some((key) =>
          Object.values(OXYGEN_INVENTORY_ENUM).includes(Number(key))
        )
      ) {
        return [
          ...acc,
          {
            facility_id: cur.id,
            facility_name: cur.name,
            facility_type: cur.facility_type,
            phone_number: cur.phone_number,
            facility_last_updated: dayjs(cur.inventory_modified_date).fromNow(),
            ...getCardData(cur),
          },
        ];
      }
      return acc;
    }
    return acc;
  }, [] as OxygenCardData[]);
};

export const getOxygenFlatData = (
  data: ProcessFacilityDataReturnType,
  filterDate?: string
): Inventory[] => {
  return _.chain(data)
    .filter((c) => {
      return !!(
        c.date === (filterDate || toDateString(new Date())) &&
        c.inventory &&
        Object.keys(c.inventory).length !== 0 &&
        Object.keys(c.inventory).some((key) =>
          Object.values(OXYGEN_INVENTORY_ENUM).includes(Number(key))
        )
      );
    })
    .map((c) => _.values(c.inventory))
    .flatMap()
    .value();
};

export const getOxygenSummeryConfig = (data: Inventory[]) => {
  return Object.values(OXYGEN_INVENTORY_NAME).map((name) => {
    const entries = _.filter(data, (f) => f.item_name === name);
    const stock = _.sumBy(entries, (f) => f.stock);
    const valid_entries = _.filter(entries, (a) => !!a?.burn_rate);
    const valid_nonzero_entries = _.filter(valid_entries, (a) => a.stock !== 0);
    const burn_rate = _.sumBy(valid_nonzero_entries, "burn_rate");
    const facilities_with_less_than_5_hrs_of_oxygen = _.filter(
      valid_nonzero_entries,
      (p) => p.stock / p.burn_rate < 5
    );

    const config = [
      {
        icon: <Database className="text-blue-500 mr-4" size="40px" />,
        label: name,
        value: stock - Math.floor(stock) !== 0 ? +stock.toFixed(2) : stock,
        unit: entries[0]?.unit,
      },
      {
        icon: <Activity className="text-yellow-400 mr-4" size="40px" />,
        label: "Burn Rate",
        value: +(burn_rate?.toFixed(2) || 0),
        unit: `${entries[0]?.unit} / hour`,
      },
      {
        icon: <Clock className="text-green-500 mr-4" size="40px" />,
        label: "Time to Empty",
        value: burn_rate > 0 ? +(stock / burn_rate).toFixed(2) : 0,
        unit: "Hours",
      },
      {
        icon: <AlertTriangle className="text-red-500 mr-4" size="40px" />,
        label: "High Alerts",
        value: facilities_with_less_than_5_hrs_of_oxygen.length,
        unit: "Facilities",
      },
    ];
    return config;
  });
};

export const getOxygenTableRows = (data: OxygenCardData) => {
  return [
    {
      name: "Last Updated",
      ..._.mapValues(data.last_updated, (val, key, obj) => {
        return val || "---";
      }),
    },
    {
      name: (
        <div className="flex">
          <Database className="text-blue-500 mr-4" />
          <h1 className="dark:text-white text-lg">Quantity</h1>
        </div>
      ),

      ..._.mapValues(data.quantity, (val, key, obj) => {
        const isLow = data.is_low[key as keyof StringNullMap];
        return (
          <div key={`q-${key}`}>
            <h1 className={clsx("text-xl", isLow && "text-red-500")}>
              {val || "---"}{" "}
              <span className="text-base text-gray-400">
                {data.quantity_unit[key as keyof StringNullMap] || ""}
              </span>
            </h1>
          </div>
        );
      }),
    },
    {
      name: (
        <div className="flex">
          <Activity className="text-yellow-400 mr-4" />
          <h1 className="dark:text-white text-lg">Burn Rate</h1>
        </div>
      ),
      ..._.mapValues(data.burn_rate, (val, key, obj) => {
        const unit = data.quantity_unit[key as keyof StringNullMap];
        const isLow = data.is_low[key as keyof StringNullMap];
        return (
          <div key={`burn-${key}`}>
            <h1 className={clsx("text-xl", isLow && "text-red-500")}>
              {val || "---"}{" "}
              <span className="text-base text-gray-400">
                {unit && val ? `${unit} / Hr` : ""}
              </span>{" "}
            </h1>
          </div>
        );
      }),
    },
    {
      name: (
        <div className="flex">
          <Clock className="text-green-500 mr-4" />
          <h1 className="dark:text-white text-lg">Time To Empty</h1>
        </div>
      ),
      ..._.mapValues(data.time_to_empty, (val, key, obj) => {
        const isLow = data.is_low[key as keyof StringNullMap];
        return (
          <div key={`time-${key}`} className={clsx(val && isLow && "pulse")}>
            <h1 className={clsx("text-xl", isLow && "text-red-500")}>
              {val || "---"}{" "}
              {val && <span className="text-base text-gray-400">Hr</span>}
            </h1>
          </div>
        );
      }),
    },
  ];
};

export const processOxygenExportData = (
  facilityData: ProcessFacilityDataReturnType,
  date: Date
) => {
  const filename = "oxygen_export.csv";

  const data = _.reduce(
    facilityData,
    (a, c) => {
      if (c.date !== toDateString(date)) {
        return a;
      }

      if (
        !(
          c.inventory &&
          Object.keys(c.inventory).length !== 0 &&
          Object.keys(c.inventory).some((e) =>
            Object.values(OXYGEN_INVENTORY).includes(Number(e))
          )
        )
      ) {
        return a;
      }

      const additionalData = Object.values(OXYGEN_INVENTORY).reduce(
        (acc, cur) => {
          const copy = _.cloneDeep(acc);

          if (c.inventory?.[cur]?.item_name) {
            copy[`Opening Stock ${c.inventory?.[cur]?.item_name}`] =
              c.inventory[cur]?.start_stock || 0;
            copy[`Stock Added Today ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.total_added || 0;
            copy[`Closing Stock ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.end_stock || 0;
            copy[`Total Consumed ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.total_consumed || 0;
            copy[`Current Stock ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.stock || 0;
            copy[`Unit ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.unit || 0;
            copy[`Is Low ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.is_low || 0;
            copy[`Burn Rate ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.burn_rate || 0;
            copy[`Updated at ${c.inventory[cur]?.item_name}`] =
              c.inventory[cur]?.modified_date || 0;
          }
          return copy;
        },
        {} as any
      );

      const newData = {
        "Govt/Pvt": c.facility_type,
        "Hops/CFLTC":
          c.facility_type === "First Line Treatment Centre" ? "CFLTC" : "Hops",
        "Hospital/CFLTC Address": c.address,
        "Hospital/CFLTC Name": c.name,
        Mobile: c.phone_number,
        "Expected Liquid Oxygen": c.expected_oxygen_requirement,
        "Expected Type B Cylinders": c.expected_type_b_cylinders,
        "Expected Type C Cylinders": c.expected_type_c_cylinders,
        "Expected Type D Cylinders": c.expected_type_d_cylinders,
        "Capacity Liquid Oxygen": c.oxygen_capacity,
        "Capacity Type B Cylinders": c.type_b_cylinders,
        "Capacity Type C Cylinders": c.type_c_cylinders,
        "Capacity Type D Cylinders": c.type_d_cylinders,
        ...additionalData,
      };

      return [...a, newData];
    },
    [] as any[]
  );

  return { data, filename };
};
