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
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import _ from "lodash";
import { Pagination } from "@windmill/react-ui";

const Patient = ({ data }: { data: CareSummaryResponse }) => {
  const router = useRouter();
  const districtName = router.query.districtName;
  const district = getDistrict(districtName?.toString());
  const [facilityType, setFacilityType] = useState(FACILITY_TYPES);
  const [date, dateOnChange] = useState(new Date());
  const [filterDistrict, setFilterDistrict] = useState(ACTIVATED_DISTRICTS[0]);

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
          searchValue=""
          setSearchValue={() => {}}
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

  const today = new Date();
  const start_date = toDateString(getNDateBefore(today, 1));
  const end_date = toDateString(getNDateAfter(today, 1));
  const limit = 2000;

  const data = await careSummary(
    "patient",
    district.id,
    limit,
    start_date,
    end_date
  );

  // const exported = {
  //   data: filtered.reduce((a, c) => {
  //     if (c.date !== toDateString(date)) {
  //       return a;
  //     }
  //     return [
  //       ...a,
  //       {
  //         "Govt/Pvt": GOVT_FACILITY_TYPES.includes(c.facilityType)
  //           ? "Govt"
  //           : "Pvt",
  //         "Hops/CFLTC":
  //           c.facilityType === "First Line Treatment Centre"
  //             ? "CFLTC"
  //             : "Hops" || null,
  //         "Hospital/CFLTC Address": c.address || null,
  //         "Hospital/CFLTC Name": c.name || null,
  //         Mobile: c.phoneNumber || null,
  //         ...AVAILABILITY_TYPES_ORDERED.reduce((t, x) => {
  //           const y = { ...t };
  //           y[`Current ${AVAILABILITY_TYPES[x]}`] =
  //             c.capacity[x]?.current_capacity || 0;
  //           y[`Total ${AVAILABILITY_TYPES[x]}`] =
  //             c.capacity[x]?.total_capacity || 0;
  //           return y;
  //         }, {}),
  //       },
  //     ];
  //   }, []),
  //   filename: "capacity_export.csv",
  // };

  return {
    props: {
      data,
      // exported,
    },
  };
};
