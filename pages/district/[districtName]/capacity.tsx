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
} from "../../../lib/common";
import { careSummary, CareSummaryResponse } from "../../../lib/types";
import { parameterize } from "../../../utils/parser";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import GMap from "../../../components/GMap/GMap";
import { capacityMockData } from "../../../utils/mock/capacity";
import { useEffect, useState } from "react";
import { CapacityCard } from "../../../components/CapacityCard";

interface CapacityProps {
  districtName: string;
  data: CareSummaryResponse;
}

const Capacity: React.FC<CapacityProps> = ({ data, districtName }) => {
  const { capacityCardData, facilitiesTrivia, todayFiltered, filterDistrict } =
    capacityMockData;

  const [tableData, setTableData] = useState(capacityCardData);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  // TODO: Remove this once we have a better way of handling the data
  const exported = undefined;

  useEffect(() => {
    const skip = (page - 1) * resultsPerPage;
    const end = skip + resultsPerPage;
    setTableData(capacityCardData.slice(skip, end));
    console.log(page);
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
          <div className="items-center flex flex-col justify-between md:flex-row">
            <h1 className="dark:text-gray-100 text-3xl mb-4">Facilities</h1>
            <div className="flex max-w-full space-x-4">
              {true && (
                // <CSVLink data={exported.data} filename={exported.filename}>
                <Button block>Export</Button>
                // </CSVLink>
              )}
              <Input
                css={{}}
                className="sw-40 rounded-lg sm:w-auto"
                placeholder="Search Facility"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

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

  if (district) {
    const data = await careSummary("facility", district.id);

    return {
      props: {
        data,
        districtName: parameterize(district.name),
      },
    };
  }

  return {
    notFound: true,
  };
};

export default Capacity;
