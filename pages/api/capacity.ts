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
import { processFacilityData } from "../../lib/common/processor";

dayjs.extend(relativeTime);

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
