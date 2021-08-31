import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";

import { ValuePill } from "../../../components/Pill";
import {
  getDistrict,
  getNDateAfter,
  getNDateBefore,
  toDateString,
} from "../../../utils/parser";
import Loader from "../../../lib/assets/icons/LoaderIcon";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { BedsSummery } from "../../../components/Patient/BedsSummery";
import useSWR from "swr";
import { careSummary } from "../../../lib/types";
import {
  ACTIVATED_DISTRICTS,
  FACILITY_TYPES,
  PATIENT_TYPES,
} from "../../../lib/common";
import { useEffect, useState } from "react";
import {
  PatientCardDataForCapacity,
  PatientTypeKeys,
  processFacilityDataUpdate,
} from "../../../lib/common/processor";
import {
  processPatientCardData,
  processPatientFacilitiesTriviaData,
} from "../../../lib/common/processor/patientProcessor";
import { InfoCard } from "../../../components/InfoCard";
import { Box } from "react-feather";

const Patient = () => {
  const router = useRouter();
  const districtName = router.query.districtName;
  const district = getDistrict(districtName?.toString());
  const [facilityType, setFacilityType] = useState(FACILITY_TYPES);
  const [date, dateOnChange] = useState(new Date());
  const [filterDistrict, setFilterDistrict] = useState(ACTIVATED_DISTRICTS[0]);

  const startDate = toDateString(getNDateBefore(date, 1));
  const endDate = toDateString(getNDateAfter(date, 1));
  const limit = 2000;

  const { data } = useSWR(
    ["Patient", date, filterDistrict.id],
    (url, date: Date, districtId: string) =>
      careSummary("patient", districtId, limit, startDate, endDate)
  );

  if (!data || !district) return <Loader />;
  const [tableData, setTableData] = useState<PatientCardDataForCapacity[]>([]);

  const filtered = processFacilityDataUpdate(data.results);
  const facilityTrivia = processPatientFacilitiesTriviaData(filtered);
  const patientCardData = processPatientCardData(filtered);
  const [filteredData, setFilteredData] = useState(patientCardData);
  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    setTableData(
      filteredData.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    );
  }, [filteredData, page]);

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        <ValuePill
          title="Facility Count"
          value={facilityTrivia.current.count}
        />
      </div>
      {/* {district && <PatientSummaryPage district={district} />} */}
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(PATIENT_TYPES).map(([k, title], i) => {
          const key = k as PatientTypeKeys;
          const value = facilityTrivia.current[key]?.total || 0;
          const delta = facilityTrivia.current[key].today || 0;
          return <InfoCard key={i} title={title} value={value} delta={delta} />;
        })}
      </div>
      <Box>
        <TableExportHeader
          label="Facilities"
          searchValue=""
          setSearchValue={() => {}}
        />
        {tableData.map((data, i) => (
          <BedsSummery key={i} data={data} />
        ))}
      </Box>
    </div>
  );
};

export default Patient;
