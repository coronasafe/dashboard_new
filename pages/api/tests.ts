import type { VercelRequest, VercelResponse } from "@vercel/node";
import { APIResponder } from "../../lib/api/helper";
import { ACTIVATED_DISTRICTS } from "../../lib/common";
import { careSummary, FacilitySummary } from "../../lib/types";
import { getDaysAfter, getDaysBefore, toDateString } from "../../utils/parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { processFacilityDataUpdate } from "../../lib/common/processor";
import {
  getTestTableData,
  processTestFacilitiesTriviaData,
} from "../../lib/common/processor/testsProcessor";

dayjs.extend(relativeTime);

const processTestData = (facilities: FacilitySummary[]) => {};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const districtId = Number(req.query.districtId);

  if (!districtId) {
    return APIResponder("ERROR", res);
  }

  const districtExists = ACTIVATED_DISTRICTS.find(
    (district) => district.id === districtId
  );

  if (!districtExists) {
    return APIResponder("ERROR", res, {
      message: "District with this ID does not exist",
    });
  }

  const data = await careSummary(
    "tests",
    districtId,
    2000,
    toDateString(getDaysBefore(1)),
    toDateString(getDaysAfter(1))
  );

  const filtered = processFacilityDataUpdate(data.results);

  const facilityTrivia = processTestFacilitiesTriviaData(filtered);
  const tableData = getTestTableData(filtered);

  return APIResponder("SUCCESS", res, {
    facilityTrivia,
    tableData,
    districtId,
  });
};

export default handler;
