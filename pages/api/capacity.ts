import type { VercelRequest, VercelResponse } from "@vercel/node";
import { APIResponder } from "../../lib/api/helper";
import { ACTIVATED_DISTRICTS, OXYGEN_INVENTORY } from "../../lib/common";
import {
  careSummary,
  FacilityData,
  FacilitySummary,
  Inventory,
} from "../../lib/types";
import {
  GetCapacityBedData,
  GetFinalTotalData,
  InventoryTimeToEmpty,
  toDateString,
} from "../../utils/parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const processFacilityData = (facilities: FacilitySummary[]) => {
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
        oxygenCapacity: data.oxygen_capacity,
        type_b_cylinders: data.type_b_cylinders,
        type_c_cylinders: data.type_c_cylinders,
        type_d_cylinders: data.type_d_cylinders,
        expected_oxygen_requirement: data.expected_oxygen_requirement,
        expected_type_b_cylinders: data.expected_type_b_cylinders,
        expected_type_c_cylinders: data.expected_type_c_cylinders,
        expected_type_d_cylinders: data.expected_type_d_cylinders,
        actualDischargedPatients: data.actual_discharged_patients,
        actualLivePatients: data.actual_live_patients,
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
      id: facility.id,
      name: facility.name,
      address: facility.address,
      districtId: facility.district,
      facilityType: facility.facility_type || "Unknown",
      location: facility.location,
      phoneNumber: facility.phone_number,
      inventory: data.inventory,
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

const processCapacityData = (facilities: FacilitySummary[]) => {
  // @ts-ignore I've got no idea what actually happens here.
  return facilities.reduce((acc, { facility }) => {
    const covidData = GetCapacityBedData([30, 120, 110, 100], facility);
    const nonCovidData = GetCapacityBedData([1, 150, 10, 20], facility);
    const finalTotalData = GetFinalTotalData(covidData, nonCovidData);
    const noCapacity = finalTotalData.every((item) => item.total === 0);

    if (noCapacity) {
      return acc;
    }

    return [
      ...acc,
      {
        facility_name: facility.name,
        facility_id: facility.id,
        facility_type: facility.facility_type,
        phone_number: facility.phone_number,
        last_updated: dayjs(facility.modified_date).fromNow(),
        patient_discharged: `${facility.actual_live_patients || 0}/${
          facility.actual_discharged_patients || 0
        }`,
        covid: covidData,
        non_covid: nonCovidData,
        final_total: finalTotalData,
      },
    ];
  }, []);
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (!req.query.districtID) {
    return APIResponder("ERROR", res);
  }

  const districtExists = ACTIVATED_DISTRICTS.find(
    (district) => district.id === Number(req.query.districtID)
  );

  if (!districtExists) {
    return APIResponder("ERROR", res, {
      message: "District with this ID does not exist",
    });
  }

  const rawData = await careSummary("facility", Number(req.query.districtID));
  const facilities = processFacilityData(rawData.results);

  // TODO: Need to actually figure out what's happening here.
  // const capacity = processCapacityData(rawData.results);

  return APIResponder("SUCCESS", res, {
    facilities,
  });
};

export default handler;
