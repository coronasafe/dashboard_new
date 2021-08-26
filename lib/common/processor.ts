import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  OXYGEN_INVENTORY,
} from ".";
import { FacilityData, FacilitySummary, Inventory } from "../types";
import {
  getCapacityBedData,
  getFinalTotalData,
  InventoryTimeToEmpty,
  toDateString,
} from "../../utils/parser";
import { INITIAL_FACILITIES_TRIVIA } from "./constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const processFacilityData = (facilities: FacilitySummary[]) => {
  const facility = facilities.filter((obj) => obj.facility);

  const additionalData = (data: FacilityData) => {
    if (data.availability) {
      const capacity = data.availability.reduce(
        (accumulator, obj) => ({
          ...accumulator,
          [obj.room_type]: obj,
        }),
        {}
      );

      return {
        capacity,
        oxygenCapacity: data.oxygen_capacity || null,
        type_b_cylinders: data.type_b_cylinders || null,
        type_c_cylinders: data.type_c_cylinders || null,
        type_d_cylinders: data.type_d_cylinders || null,
        expected_oxygen_requirement: data.expected_oxygen_requirement || null,
        expected_type_b_cylinders: data.expected_type_b_cylinders || null,
        expected_type_c_cylinders: data.expected_type_c_cylinders || null,
        expected_type_d_cylinders: data.expected_type_d_cylinders || null,
        actualDischargedPatients: data.actual_discharged_patients || null,
        actualLivePatients: data.actual_live_patients || null,
        tte_tank: Number(
          InventoryTimeToEmpty(
            (data.inventory &&
              data.inventory[OXYGEN_INVENTORY.liquid]) as Inventory
          ) || -1
        ),
        tte_d_cylinders: Number(
          InventoryTimeToEmpty(
            (data.inventory &&
              data.inventory[OXYGEN_INVENTORY.type_d]) as Inventory
          ) || -1
        ),
        tte_c_cylinders: Number(
          InventoryTimeToEmpty(
            (data.inventory &&
              data.inventory[OXYGEN_INVENTORY.type_c]) as Inventory
          ) || -1
        ),
        tte_b_cylinders: Number(
          InventoryTimeToEmpty(
            (data.inventory &&
              data.inventory[OXYGEN_INVENTORY.type_b]) as Inventory
          ) || -1
        ),
      };
    }

    return { ...data };
  };

  return facility.map(({ data, created_date, facility, modified_date }) => {
    return {
      date: toDateString(new Date(created_date)),
      id: facility.id || null,
      name: facility.name || null,
      address: facility.address || null,
      districtId: facility.district || null,
      facilityType: facility.facility_type || "Unknown",
      location: facility.location || null,
      phoneNumber: facility.phone_number || null,
      inventory: data.inventory || null,
      modifiedDate:
        data.availability && data.availability.length !== 0
          ? // @ts-ignore
            Math.max(...data.availability.map((a) => new Date(a.modified_date)))
          : data.modified_date || modified_date,
      inventoryModifiedDate:
        data.inventory && Object.keys(data.inventory).length !== 0
          ? Math.max(
              // @ts-ignore
              ...Object.values(data.inventory).map(
                (a) => new Date(a.modified_date)
              )
            )
          : data.modified_date || modified_date,
      ...additionalData(data),
    };
  });
};

export const processFacilityTriviaForCapacity = (
  facility: typeof processFacilityData
) => {
  const date = new Date();
  // @ts-ignore
  return facility.reduce(
    // @ts-ignore
    (a, c) => {
      const key = c.date === toDateString(date) ? "current" : "previous";
      a[key].count += 1;
      a[key].oxygen += c.oxygenCapacity || 0;
      a[key].actualLivePatients += c.actualLivePatients || 0;
      a[key].actualDischargedPatients += c.actualDischargedPatients || 0;
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        a[key][k].used += c.capacity[k]?.current_capacity || 0;
        a[key][k].total += c.capacity[k]?.total_capacity || 0;
      });

      AVAILABILITY_TYPES_TOTAL_ORDERED.forEach((k) => {
        const current_covid = c.capacity[k.covid]?.current_capacity || 0;
        const current_non_covid =
          c.capacity[k.non_covid]?.current_capacity || 0;
        const total_covid = c.capacity[k.covid]?.total_capacity || 0;
        const total_non_covid = c.capacity[k.non_covid]?.total_capacity || 0;
        a[key][k.id].used += current_covid + current_non_covid;
        a[key][k.id].total += total_covid + total_non_covid;
      });

      return a;
    },
    {
      current: JSON.parse(JSON.stringify(INITIAL_FACILITIES_TRIVIA)),
      previous: JSON.parse(JSON.stringify(INITIAL_FACILITIES_TRIVIA)),
    }
  );
};

export const processCapacityCardDataForCapacity = (
  facilities: typeof processFacilityData
) => {
  const date = new Date();
  // @ts-ignore
  return facilities.reduce((acc, facility) => {
    const covidData = getCapacityBedData([30, 120, 110, 100], facility);
    const nonCovidData = getCapacityBedData([1, 150, 10, 20], facility);
    const finalTotalData = getFinalTotalData(covidData, nonCovidData);
    const noCapacity = finalTotalData.every((item) => item.total === 0);
    if (facility.date !== toDateString(date) || noCapacity) {
      return acc;
    }
    return [
      ...acc,
      {
        facility_name: facility.name,
        facility_id: facility.id,
        facility_type: facility.facilityType,
        phone_number: facility.phoneNumber,
        last_updated: dayjs(facility.modifiedDate).fromNow(),
        patient_discharged: `${facility.actualLivePatients || 0}/${
          facility.actualDischargedPatients || 0
        }`,
        covid: covidData,
        non_covid: nonCovidData,
        final_total: finalTotalData,
      },
    ];
  }, []);
};
