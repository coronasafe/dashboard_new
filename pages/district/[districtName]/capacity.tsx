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
  FACILITY_TYPES,
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
import { useEffect, useRef, useState } from "react";
import { CapacityCard } from "../../../components/CapacityCard";
import {
  processCapacityCardDataForCapacityUpdate,
  processFacilityDataUpdate,
  FacilitiesTrivia,
  ProcessFacilityDataReturnType,
  processFacilityTriviaForCapacityUpdate,
  CapacityCardDataForCapacity,
  processCapacityExportData,
} from "../../../lib/common/processor";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TableExportHeader } from "../../../components/TableExportHeader";
import _ from "lodash";
import { FilterProps, Filters } from "../../../components/Filters";
import Fuse from "fuse.js";

dayjs.extend(relativeTime);

interface CapacityProps extends FilterProps {
  data: CareSummaryResponse;
  filterDistrict: typeof ACTIVATED_DISTRICTS[number];
  capacityCardData: CapacityCardDataForCapacity[];
  facilitiesTrivia: FacilitiesTrivia;
  filtered: ProcessFacilityDataReturnType;
  todayFiltered: ProcessFacilityDataReturnType;
  exportData: ReturnType<typeof processCapacityExportData>;
}

const Capacity = ({
  data,
  filterDistrict,
  capacityCardData,
  facilitiesTrivia,
  filtered,
  todayFiltered,
  exportData,
  ...other
}: CapacityProps) => {
  const tableDataFuse = useRef(
    new Fuse(capacityCardData, { keys: ["facility_name"], threshold: 0.4 })
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState(capacityCardData);
  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const skip = (page - 1) * resultsPerPage;
    const end = skip + resultsPerPage;
    if (searchTerm.length) {
      const newData = tableDataFuse.current
        .search(searchTerm)
        .map((i) => i.item);
      setTableData(newData.slice(skip, end));
    } else {
      setTableData(capacityCardData.slice(skip, end));
    }
  }, [searchTerm, page]);

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
            exportData={exportData}
          />
          {tableData.map((tData, index) => (
            <CapacityCard data={tData} key={index} />
          ))}
          <Pagination
            resultsPerPage={10}
            totalResults={tableData.length}
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
    "facility",
    district.id,
    limit,
    start_date,
    end_date
  );

  const filtered = processFacilityDataUpdate(data.results, facilityType);
  const facilitiesTrivia = processFacilityTriviaForCapacityUpdate(
    filtered,
    _start_date_str
  );
  const capacityCardData = processCapacityCardDataForCapacityUpdate(
    filtered,
    _start_date_str
  );
  const todayFiltered = _.filter(filtered, (f) => f.date === _start_date_str);

  const exportData = processCapacityExportData(filtered, _start_date);

  return {
    props: {
      data,
      filterDistrict: district,
      capacityCardData,
      facilitiesTrivia,
      filtered,
      todayFiltered,
      exportData,
    },
  };
};

export default Capacity;
