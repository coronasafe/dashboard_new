import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";

import { ValuePill } from "../../../components/Pill";
import {
  getDistrict,
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";
import Loader from "../../../lib/assets/icons/LoaderIcon";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { BedsSummery } from "../../../components/Patient/BedsSummery";
import { careSummary, CareSummaryResponse } from "../../../lib/types";
import {
  ACTIVATED_DISTRICTS,
  FACILITY_TYPES,
  PATIENT_TYPES,
} from "../../../lib/common";
import { useEffect, useRef, useState } from "react";
import {
  PatientCardDataForCapacity,
  PatientFacilitiesTrivia,
  PatientTypeKeys,
  ProcessFacilityDataReturnType,
  processFacilityDataUpdate,
} from "../../../lib/common/processor";
import {
  processPatientCardData,
  processPatientExportData,
  processPatientFacilitiesTriviaData,
} from "../../../lib/common/processor/patientProcessor";
import { InfoCard } from "../../../components/InfoCard";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import _ from "lodash";
import { Pagination } from "@windmill/react-ui";
import dayjs from "dayjs";
import Fuse from "fuse.js";

interface PatientProps {
  filtered: ProcessFacilityDataReturnType;
  facilityTrivia: PatientFacilitiesTrivia;
  patientCardData: PatientCardDataForCapacity[];

  exportData: {
    data: any[];
    filename: string;
  };
}

const Patient: React.FC<PatientProps> = ({
  exportData,
  facilityTrivia,
  filtered,
  patientCardData,
}) => {
  const [tableData, setTableData] = useState<PatientCardDataForCapacity[]>([]);
  const tableDataFuse = useRef(
    new Fuse(patientCardData, { keys: ["facility_name"], threshold: 0.4 })
  );
  const [filteredData, setFilteredData] = useState(patientCardData);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const skip = (page - 1) * resultsPerPage;
    const end = skip + resultsPerPage;
    if (searchTerm.length) {
      const newData = tableDataFuse.current
        .search(searchTerm)
        .map((i) => i.item);
      setTableData(newData.slice(0, 10));
    } else {
      setTableData(patientCardData.slice(skip, end));
    }
  }, [searchTerm, page]);

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        <ValuePill
          title="Facility Count"
          value={facilityTrivia.current.count}
        />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(PATIENT_TYPES).map(([k, title], i) => {
          const key = k as PatientTypeKeys;
          const value = facilityTrivia.current[key]?.total || 0;
          const delta = facilityTrivia.current[key].today || 0;
          return <InfoCard key={i} title={title} value={value} delta={delta} />;
        })}
      </div>
      <div className="my-16">
        <TableExportHeader
          label="Facilities"
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          exportData={exportData}
        />
        {tableData.map((data, i) => (
          <BedsSummery key={i} data={data} />
        ))}
        <div className="my-4 py-4">
          <Pagination
            label="Bed Summery"
            resultsPerPage={10}
            totalResults={filteredData.length}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Patient;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}: GetServerSidePropsContext) => {
  const district = _.find(
    ACTIVATED_DISTRICTS,
    (obj) =>
      parameterize(obj.name) === parameterize(params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }

  const queryDate = String(query.date);
  const facilityType = (query?.facility_type as string)
    ?.split(",")
    .map((i) => {
      const key = parseInt(i.trim());
      return key >= 0 ? FACILITY_TYPES[key] : null;
    })
    .filter((i) => i != null) as string[];

  const today = new Date();

  const _start_date = dayjs(queryDate || null, "YYYY-MM-DD").isValid()
    ? new Date(queryDate)
    : today;
  const _start_date_str = toDateString(_start_date);
  const start_date = toDateString(getNDateBefore(_start_date, 1));
  const end_date = toDateString(getNDateAfter(start_date, 2));
  const limit = 2000;

  const data = await careSummary(
    "patient",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results, facilityType);
  const facilityTrivia = processPatientFacilitiesTriviaData(
    filtered,
    _start_date_str
  );
  const patientCardData = processPatientCardData(filtered, _start_date_str);
  const exportData = processPatientExportData(filtered, _start_date);

  return {
    props: {
      data,
      filtered,
      facilityTrivia,
      patientCardData,
      exportData,
    },
  };
};
