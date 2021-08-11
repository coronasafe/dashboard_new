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

const patientSummary: {
  [key: string]: { today: number; total: number };
} = {
  icu: { total: 0, today: 0 },
  oxygen_bed: { total: 0, today: 0 },
  bed_with_oxygen_support: { total: 0, today: 0 },
  icu_with_oxygen_support: { total: 0, today: 0 },
  not_admitted: { total: 0, today: 0 },
  home_isolation: { total: 0, today: 0 },
  isolation_room: { total: 0, today: 0 },
  home_quarantine: { total: 0, today: 0 },
  paediatric_ward: { total: 0, today: 0 },
  gynaecology_ward: { total: 0, today: 0 },
  icu_with_invasive_ventilator: { total: 0, today: 0 },
  icu_with_non_invasive_ventilator: { total: 0, today: 0 },
};

const processPatientData = (summary: FacilitySummary[]) => {
  // Retrieve all Patient Types
  const patientTypes = Object.keys(patientSummary);

  summary.forEach(({ data }) => {
    patientTypes.forEach((type) => {
      patientSummary[type].total += data[`total_patients_${type}`] || 0;
      patientSummary[type].today += data[`today_patients_${type}`] || 0;
    });
  });

  return patientSummary;
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const districtId = req.query.districtID;

  if (!districtId) {
    return APIResponder("ERROR", res);
  }

  const districtExists = ACTIVATED_DISTRICTS.find(
    (district) => district.id === Number(districtId)
  );

  if (!districtExists) {
    return APIResponder("ERROR", res, {
      message: "District with this ID does not exist",
    });
  }

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
