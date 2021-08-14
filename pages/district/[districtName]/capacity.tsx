// @ts-nocheck
import { ArrowRight } from "react-feather";
import { Button, Input, Pagination } from "@windmill/react-ui";
import { RadialCard } from "../../../components/Charts";
import ContentNav from "../../../components/ContentNav";
import { Pill, ValuePill } from "../../../components/Pill";
import {
  ACTIVATED_DISTRICTS,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  GOVT_FACILITY_TYPES,
} from "../../../lib/common";
import { careSummary, CareSummaryResponse } from "../../../lib/types";
import {
  getCapacityBedData,
  getFinalTotalData,
  parameterize,
  toDateString,
} from "../../../utils/parser";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import GMap from "../../../components/GMap/GMap";
import { useEffect, useState } from "react";
import { CapacityCard } from "../../../components/CapacityCard";
import { processFacilityData } from "../../../lib/common/processor";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TableExportHeader } from "../../../components/TableExportHeader";

dayjs.extend(relativeTime);

interface CapacityProps {
  districtName: string;
  data: CareSummaryResponse;
}

const initialFacilitiesTrivia = {
  20: { total: 0, used: 0 },
  10: { total: 0, used: 0 },
  150: { total: 0, used: 0 },
  1: { total: 0, used: 0 },
  70: { total: 0, used: 0 },
  50: { total: 0, used: 0 },
  60: { total: 0, used: 0 },
  40: { total: 0, used: 0 },
  100: { total: 0, used: 0 },
  110: { total: 0, used: 0 },
  120: { total: 0, used: 0 },
  30: { total: 0, used: 0 },
  1111: { total: 0, used: 0 },
  2222: { total: 0, used: 0 },
  3333: { total: 0, used: 0 },
  4444: { total: 0, used: 0 },
  actualDischargedPatients: 0,
  actualLivePatients: 0,
  count: 0,
  oxygen: 0,
};

const Capacity: React.FC<CapacityProps> = ({
  capacityCardData,
  facilitiesTrivia,
  filterDistrict,
  todayFiltered,
}) => {
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
      <ContentNav />
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 my-5">
          {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => (
            <RadialCard
              label={k.name}
              count={facilitiesTrivia.current.count}
              //@ts-ignore
              current={facilitiesTrivia.current[k.id]}
              //@ts-ignore
              previous={facilitiesTrivia.previous[k.id]}
              key={k.id}
            />
          ))}
          {AVAILABILITY_TYPES_ORDERED.map((k) => (
            <RadialCard
              label={AVAILABILITY_TYPES[k]}
              count={facilitiesTrivia.current.count}
              //@ts-ignore
              current={facilitiesTrivia.current[k]}
              //@ts-ignore
              previous={facilitiesTrivia.previous[k]}
              key={k}
            />
          ))}
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
  const district = ACTIVATED_DISTRICTS.find(
    (obj) =>
      parameterize(obj.name) === parameterize(params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }

  const date = new Date();
  const data = await careSummary("facility", district.id);
  const filtered = processFacilityData(data.results);
  const facilitiesTrivia = filtered.reduce(
    (a, c) => {
      const key = c.date === toDateString(date) ? "current" : "previous";
      a[key].count += 1;
      a[key].oxygen += c.oxygenCapacity || 0;
      a[key].actualLivePatients += c.actualLivePatients || 0;
      a[key].actualDischargedPatients += c.actualDischargedPatients || 0;
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        a[key][k].used += c.capacity[k]?.current_capacity || 0;
        a[key][k].total += c.capacity[k]?.total_capacity || 0;
      });

      AVAILABILITY_TYPES_TOTAL_ORDERED.forEach((k) => {
        const current_covid = c.capacity[k.covid]?.current_capacity || 0;
        const current_non_covid =
          c.capacity[k.non_covid]?.current_capacity || 0;
        const total_covid = c.capacity[k.covid]?.total_capacity || 0;
        const total_non_covid = c.capacity[k.non_covid]?.total_capacity || 0;
        a[key][k.id].used += current_covid + current_non_covid;
        a[key][k.id].total += total_covid + total_non_covid;
      });

      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );
  const exported = {
    data: filtered.reduce((a, c) => {
      if (c.date !== toDateString(date)) {
        return a;
      }
      return [
        ...a,
        {
          "Govt/Pvt": GOVT_FACILITY_TYPES.includes(c.facilityType)
            ? "Govt"
            : "Pvt",
          "Hops/CFLTC":
            c.facilityType === "First Line Treatment Centre" ? "CFLTC" : "Hops",
          "Hospital/CFLTC Address": c.address,
          "Hospital/CFLTC Name": c.name,
          Mobile: c.phoneNumber,
          ...AVAILABILITY_TYPES_ORDERED.reduce((t, x) => {
            const y = { ...t };
            y[`Current ${AVAILABILITY_TYPES[x]}`] =
              c.capacity[x]?.current_capacity || 0;
            y[`Total ${AVAILABILITY_TYPES[x]}`] =
              c.capacity[x]?.total_capacity || 0;
            return y;
          }, {}),
        },
      ];
    }, []),
    filename: "capacity_export.csv",
  };

  const capacityCardData = filtered.reduce((acc, facility) => {
    const covidData = getCapacityBedData([30, 120, 110, 100], facility);
    const nonCovidData = getCapacityBedData([1, 150, 10, 20], facility);
    const finalTotalData = getFinalTotalData(covidData, nonCovidData);
    const noCapacity = finalTotalData.every((item) => item.total === 0);
    if (facility.date !== toDateString(date) || noCapacity) {
      return acc;
    }
    return [
      ...acc,
      {
        facility_name: facility.name,
        facility_id: facility.id,
        facility_type: facility.facilityType,
        phone_number: facility.phoneNumber,
        last_updated: dayjs(facility.modifiedDate).fromNow(),
        patient_discharged: `${facility.actualLivePatients || 0}/${
          facility.actualDischargedPatients || 0
        }`,
        covid: covidData,
        non_covid: nonCovidData,
        final_total: finalTotalData,
      },
    ];
  }, []);
  const todayFiltered = filtered.filter((f) => f.date === toDateString(date));

  return {
    props: {
      data,
      filterDistrict: district,
      capacityCardData,
      facilitiesTrivia,
      filtered,
      todayFiltered,
    },
  };
};

export default Capacity;
