import dayjs from "dayjs";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { APIResponder } from "../../../lib/api/helper";
import { ACTIVATED_DISTRICTS } from "../../../lib/common";
import { careSummary, FacilityData, FacilitySummary } from "../../../lib/types";
import {
  getDaysAfter,
  getDaysBefore,
  toDateString,
} from "../../../utils/parser";

const processPatientData = (summary: FacilitySummary[]) => {};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const districtId = req.query.districtID;

  if (!districtId) return APIResponder("ERROR", res);

  const districtExists = ACTIVATED_DISTRICTS.find(
    (district) => district.id === Number(districtId)
  );

  if (!districtExists)
    return APIResponder("ERROR", res, {
      message: "District with this ID does not exist",
    });

  const prevDate = toDateString(getDaysBefore(1));
  const nextDate = toDateString(getDaysAfter(1));

  const { results } = await careSummary(
    "patient",
    Number(districtId),
    2000,
    prevDate,
    nextDate
  );

  const recentFacilities = results.filter(
    ({ modified_date }) =>
      dayjs().date() === dayjs(modified_date).date() &&
      dayjs().month() === dayjs(modified_date).month()
  );

  const summary = processPatientData(recentFacilities);

  return APIResponder("SUCCESS", res, {
    summary,
    count: recentFacilities.length,
  });
};

export default handler;
