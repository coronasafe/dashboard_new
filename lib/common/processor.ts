import { OXYGEN_INVENTORY } from ".";
import { FacilityData, FacilitySummary, Inventory } from "../types";
import { InventoryTimeToEmpty, toDateString } from "../../utils/parser";

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
