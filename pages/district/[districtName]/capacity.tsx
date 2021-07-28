import { ArrowRight } from "react-feather";
import { Button } from "@windmill/react-ui";
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
import { Parameterize } from "../../../utils/parser";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import GMap from "../../../components/GMap/GMap";
import { capacityMockData } from "../../../utils/mock/capacity";

interface CapacityProps {
  districtName: string;
  data: CareSummaryResponse;
}

const Capacity: React.FC<CapacityProps> = ({ data, districtName }) => {
  const { capacityCardData, facilitiesTrivia, todayFiltered, filterDistrict } =
    capacityMockData;

  console.log(districtName);
  console.log(data);

  return (
    <div className="2xl:container mx-auto px-4">
      <ContentNav />
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
      <div id="capacity-map">
        <h1 className="dark:text-gray-100 text-3xl mb-4"> Map </h1>
      </div>
      <GMap district={filterDistrict} facilities={todayFiltered} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const district = ACTIVATED_DISTRICTS.find(
    (obj) =>
      Parameterize(obj.name) === Parameterize(params?.districtName as string)
  );

  if (district) {
    const data = await careSummary("facility", district.id);

    return {
      props: {
        data,
        districtName: Parameterize(district.name),
      },
    };
  }

  return {
    notFound: true,
  };
};

export default Capacity;
