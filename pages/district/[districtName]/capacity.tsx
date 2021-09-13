import { ArrowRight } from "react-feather";
import { Button, Pagination } from "@windmill/react-ui";
import { RadialCard } from "../../../components/Charts";
import ContentNav from "../../../components/ContentNav";
import { Pill, ValuePill } from "../../../components/Pill";
import {
  ACTIVATED_DISTRICTS,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from "../../../lib/common";
import { careSummary, CareSummaryResponse } from "../../../lib/types";
import {
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import GMap from "../../../components/GMap/GMap";
import { useEffect, useState } from "react";
import { CapacityCard } from "../../../components/CapacityCard";
import {
  processCapacityCardDataForCapacityUpdate,
  processFacilityDataUpdate,
  FacilitiesTrivia,
  ProcessFacilityDataReturnType,
  processFacilityTriviaForCapacityUpdate,
  CapacityCardDataForCapacity,
} from "../../../lib/common/processor";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TableExportHeader } from "../../../components/TableExportHeader";
import _ from "lodash";
import { Filters } from "../../../components/Filters";

dayjs.extend(relativeTime);

interface CapacityProps {
  data: CareSummaryResponse;
  filterDistrict: typeof ACTIVATED_DISTRICTS[number];
  capacityCardData: CapacityCardDataForCapacity[];
  facilitiesTrivia: FacilitiesTrivia;
  filtered: ProcessFacilityDataReturnType;
  todayFiltered: ProcessFacilityDataReturnType;
}

const Capacity = ({
  data,
  filterDistrict,
  capacityCardData,
  facilitiesTrivia,
  filtered,
  todayFiltered,
}: CapacityProps) => {
  const [tableData, setTableData] = useState(capacityCardData);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const skip = (page - 1) * resultsPerPage;
    const end = skip + resultsPerPage;
    setTableData(capacityCardData.slice(skip, end));
  }, [page]);

  return (
    <div className="2xl:container mx-auto px-4">
      <section id="charts">
        <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
          <ValuePill
            title="Facility Count"
            value={facilitiesTrivia.current.count}
          />
          <ValuePill
            title="Oxygen Capacity"
            value={facilitiesTrivia.current.oxygen}
          />
          <ValuePill
            title="Live Patients"
            value={facilitiesTrivia.current.actualLivePatients}
          />
          <ValuePill
            title="Discharged Patients"
            value={facilitiesTrivia.current.actualDischargedPatients}
          />
          <Pill title="Forecast">
            <Button size="small" className="bg-transparent shadow-xs w-full">
              <ArrowRight className="h-4" />
            </Button>
          </Pill>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 my-5">
          {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => {
            return (
              <RadialCard
                label={k.name}
                reverseIndicator
                count={facilitiesTrivia.current.count}
                // @ts-ignore
                current={facilitiesTrivia.current[k.id]}
                // @ts-ignore
                previous={facilitiesTrivia.previous[k.id]}
                key={k.id}
              />
            );
          })}
          {AVAILABILITY_TYPES_ORDERED.map((k) => {
            const key = k as unknown as keyof typeof AVAILABILITY_TYPES;
            return (
              <RadialCard
                label={AVAILABILITY_TYPES[key]}
                count={facilitiesTrivia.current.count}
                current={facilitiesTrivia.current[key]}
                previous={facilitiesTrivia.previous[key]}
                reverseIndicator
                key={k}
              />
            );
          })}
        </div>
      </section>
      <section id="facility-capacity">
        <div id="facility-capacity-cards" className="mb-16 mt-16">
          <TableExportHeader
            label="Facilities"
            searchValue={searchTerm}
            setSearchValue={setSearchTerm}
          />
          {tableData.map((tData, index) => (
            <CapacityCard data={tData} key={index} />
          ))}
          <Pagination
            resultsPerPage={10}
            totalResults={capacityCardData.length}
            label=""
            onChange={(page) => setPage(page)}
          />
        </div>
      </section>
      <section id="capacity-map">
        <h1 className="dark:text-gray-100 text-3xl mb-4"> Map </h1>

        <GMap district={filterDistrict} facilities={todayFiltered} />
      </section>
    </div>
  );
};

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
    "facility",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results);
  const facilitiesTrivia = processFacilityTriviaForCapacityUpdate(filtered);
  const capacityCardData = processCapacityCardDataForCapacityUpdate(filtered);
  const todayFiltered = _.filter(filtered, (f) => f.date === start_date);

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
      filterDistrict: district,
      capacityCardData,
      facilitiesTrivia,
      filtered,
      todayFiltered,
      // exported,
    },
  };
};

export default Capacity;
