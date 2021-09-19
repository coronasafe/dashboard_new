import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  INITIAL_FACILITIES_TRIVIA,
  OXYGEN_INVENTORY,
} from "../constants";

import {
  getCapacityBedData,
  getFinalTotalData,
  InventoryTimeToEmpty,
  toDateString,
} from "../../../utils/parser";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import minMax from "dayjs/plugin/minMax";
import _ from "lodash";
import {
  FacilityData,
  Capacity,
  FacilitySummary,
  Inventory,
} from "../../types";
import { CapacityCardDataForCapacity } from "./types";
import {
  AVAILABILITY_TYPES_ORDERED,
  COVID_BEDS,
  FACILITY_TYPES,
  GOVT_FACILITY_TYPES,
  NON_COVID_BEDS,
} from "..";
import { ProcessFacilityDataReturnType } from ".";

dayjs.extend(relativeTime);
dayjs.extend(minMax);

const additionalData = (data: FacilityData) => {
  if (!data.availability) return data;

  const capacity: { [key: string]: Capacity } = _.keyBy(
    data.availability,
    (d) => d.room_type
  );

  return {
    ...data,
    capacity,
    oxygen_capacity: data.oxygen_capacity ?? null,
    type_b_cylinders: data.type_b_cylinders ?? null,
    type_c_cylinders: data.type_c_cylinders ?? null,
    type_d_cylinders: data.type_d_cylinders ?? null,
    expected_oxygen_requirement: data.expected_oxygen_requirement ?? null,
    expected_type_b_cylinders: data.expected_type_b_cylinders ?? null,
    expected_type_c_cylinders: data.expected_type_c_cylinders ?? null,
    expected_type_d_cylinders: data.expected_type_d_cylinders ?? null,
    actual_discharged_patients: data.actual_discharged_patients ?? null,
    actual_live_patients: data.actual_live_patients ?? null,
    tte_tank: InventoryTimeToEmpty(data?.inventory?.[OXYGEN_INVENTORY.liquid]),
    tte_d_cylinders: InventoryTimeToEmpty(
      data?.inventory?.[OXYGEN_INVENTORY.liquid]
    ),
    tte_c_cylinders: InventoryTimeToEmpty(
      data?.inventory?.[OXYGEN_INVENTORY.liquid]
    ),
    tte_b_cylinders: InventoryTimeToEmpty(
      data?.inventory?.[OXYGEN_INVENTORY.liquid]
    ),
  };
};

export const processFacilityDataUpdate = (
  facilities: FacilitySummary[],
  filterFacility?: string[]
) => {
  const facility = _.filter(facilities, (f) => !!f.facility);

  const facilityData = _.map(
    facility,
    ({ data, created_date, facility, modified_date }) => {
      const modified_date_format =
        toDateString(
          (data?.availability?.length
            ? dayjs.max(...data.availability.map((a) => dayjs(a.modified_date)))
            : dayjs(data.modified_date || modified_date)
          )?.toDate()
        ) || null;

      const inventory_modified_date =
        toDateString(
          (data.inventory && _.keys(data.inventory).length
            ? dayjs.max(
                ..._.values(data.inventory).map((a) => dayjs(a.modified_date))
              )
            : dayjs(data.modified_date || modified_date)
          )?.toDate()
        ) || null;

      const {
        id,
        name,
        address,
        district_id,
        facility_type,
        location,
        phone_number,
        inventory,
        modified_date: _temp,
        date,
        ...extraData
      } = additionalData(data);

      return {
        date: toDateString(new Date(created_date)),
        id: facility.id || null,
        name: facility.name || null,
        address: facility.address || null,
        district_id: facility.district || null,
        facility_type: facility.facility_type || "Unknown",
        location: facility.location || null,
        phone_number: facility.phone_number || null,
        inventory: data.inventory || null,
        modified_date: modified_date_format,
        inventory_modified_date,
        ...extraData,
      };
    }
  );

  const data = filterFacility?.length
    ? _.filter(facilityData, (f) => filterFacility.includes(f.facility_type))
    : facilityData;

  return data;
};

export const processFacilityTriviaForCapacityUpdate = (
  facility: ReturnType<typeof processFacilityDataUpdate>,
  filterDate?: string
) => {
  const initial = {
    current: _.cloneDeep(INITIAL_FACILITIES_TRIVIA),
    previous: _.cloneDeep(INITIAL_FACILITIES_TRIVIA),
  };

  const getKey: (date: string) => keyof typeof initial = (date) =>
    date === (filterDate || toDateString(new Date())) ? "current" : "previous";

  const data = facility.reduce((a, c) => {
    const key = getKey(c.date);

    a[key].count += 1;
    a[key].oxygen += c.oxygen_capacity || 0;
    a[key].actualLivePatients += c.actual_live_patients || 0;
    a[key].actualDischargedPatients += c.actual_discharged_patients || 0;

    const availability_type_keys = _.keys(
      AVAILABILITY_TYPES
    ) as (keyof typeof AVAILABILITY_TYPES)[];

    _.forEach(availability_type_keys, (val) => {
      a[key][val].used +=
        Number(c.capacity && c.capacity[val]?.current_capacity) || 0;
      a[key][val].total +=
        Number(c.capacity && c.capacity[val]?.total_capacity) || 0;
    });

    _.forEach(AVAILABILITY_TYPES_TOTAL_ORDERED, (k) => {
      const current_covid =
        Number(c.capacity?.[k.covid]?.current_capacity) || 0;
      const current_non_covid =
        Number(c.capacity?.[k.non_covid]?.current_capacity) || 0;

      const total_covid = Number(c.capacity?.[k.covid]?.total_capacity) || 0;
      const total_non_covid =
        Number(c.capacity?.[k.non_covid]?.total_capacity) || 0;

      const kid = k.id as unknown as keyof typeof INITIAL_FACILITIES_TRIVIA;

      const current = a[key][kid];
      if (typeof current === "object") {
        current.used += Number(current_covid) + Number(current_non_covid);
        current.total += Number(total_covid) + Number(total_non_covid);
      }
    });
    return a;
  }, initial);

  return data;
};

export const processCapacityCardDataForCapacityUpdate = (
  facilities: ReturnType<typeof processFacilityDataUpdate>,
  filterDate?: string
) => {
  return _.reduce(
    facilities,
    (acc, curr) => {
      const covidData = getCapacityBedData(COVID_BEDS, curr as FacilityData);
      const nonCovidData = getCapacityBedData(
        NON_COVID_BEDS,
        curr as FacilityData
      );

      const finalTotalData = getFinalTotalData(covidData, nonCovidData);
      const noCapacity = _.every(finalTotalData, (item) => item.total === 0);
      if (
        curr.date !== (filterDate || toDateString(new Date())) ||
        noCapacity
      ) {
        return acc;
      }
      return [
        ...acc,
        {
          facility_name: curr.name || null,
          facility_id: curr.id || null,
          facility_type: curr.facility_type || null,
          phone_number: curr.phone_number || null,
          last_updated: dayjs(curr.modified_date).fromNow() || null,
          patient_discharged:
            `${curr.actual_live_patients || 0} / ${
              curr.actual_discharged_patients || 0
            }` || null,
          covid: covidData || null,
          non_covid: nonCovidData || null,
          final_total: finalTotalData || null,
        },
      ];
    },
    [] as CapacityCardDataForCapacity[]
  );
};

export const processCapacityExportData = (
  facilityData: ProcessFacilityDataReturnType,
  date: Date
) => {
  const filename = "capacity_export.csv";

  const data = _.reduce(
    facilityData,
    (a, c) => {
      if (c.date !== toDateString(date)) {
        return a;
      }

      const additionalData = _.reduce(
        AVAILABILITY_TYPES_ORDERED,
        (acc, cur) => {
          const copy = _.cloneDeep(acc);
          const key = cur as unknown as keyof typeof AVAILABILITY_TYPES;
          copy[`Current ${AVAILABILITY_TYPES[key]}`] =
            c.capacity?.[cur]?.current_capacity || 0;
          copy[`Total ${AVAILABILITY_TYPES[key]}`] =
            c.capacity?.[cur]?.total_capacity || 0;

          return copy;
        },
        {} as any
      );

      const newData = [
        ...a,
        {
          "Govt/Pvt": GOVT_FACILITY_TYPES.includes(c.facility_type)
            ? "Govt"
            : "Pvt",
          "Hops/CFLTC":
            c.facility_type === "First Line Treatment Centre"
              ? "CFLTC"
              : "Hops" || null,
          "Hospital/CFLTC Address": c.address || null,
          "Hospital/CFLTC Name": c.name || null,
          Mobile: c.phone_number ? String(c.phone_number) : null,
          ...additionalData,
        },
      ];
      return newData;
    },
    [] as any[]
  );

  return { data, filename };
};

export const parseFacilityTypeFromQuery = (facility_type?: string) => {
  if (!facility_type) return undefined;

  const data = facility_type
    ?.split(",")
    .map((i) => {
      const key = parseInt(i.trim());
      return key >= 0 ? FACILITY_TYPES[key] : null;
    })
    .filter((i) => i != null) as string[];
  return data;
};
