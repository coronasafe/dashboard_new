import dayjs from "dayjs";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { APIResponder } from "../../../lib/api/helper";
import { ACTIVATED_DISTRICTS, PATIENT_TYPES } from "../../../lib/common";
import { careSummary, FacilitySummary } from "../../../lib/types";
import {
  getDaysAfter,
  getDaysBefore,
  toDateString,
} from "../../../utils/parser";

const processPatientData = (facilities: FacilitySummary[]) => {
  // Retrieve all Patient Types
  const patientTypes = Object.keys(PATIENT_TYPES);

  // Initialize all Patient Types with Zero Count
  const patientSummary: {
    [key: string]: { today: number; total: number };
  } = patientTypes.reduce(
    (acc, curr) => ({ ...acc, [curr]: { total: 0, today: 0 } }),
    {}
  );

  // Sum Up of All Today and Total Count of each facilities
  facilities.forEach(({ data }) => {
    patientTypes.forEach((type) => {
      patientSummary[type].total += data[`total_patients_${type}`] || 0;
      patientSummary[type].today += data[`today_patients_${type}`] || 0;
    });
  });

  return patientSummary;
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const districtId = parseInt(req.query.districtId);

  if (!districtId) return APIResponder("ERROR", res);

  const district = ACTIVATED_DISTRICTS.find(
    (district) => district.id === districtId
  );

  if (!district)
    return APIResponder("ERROR", res, {
      message: "District with this ID does not exist",
    });

  const prevDate = toDateString(getDaysBefore(1));
  const nextDate = toDateString(getDaysAfter(1));

  const { results } = await careSummary(
    "patient",
    districtId,
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

  return APIResponder("SUCCESS", res, summary);
};

export default handler;
