import { Button } from "@windmill/react-ui";
import axios from "axios";
import { useRouter } from "next/router";
import { ArrowRight } from "react-feather";
import { useTransition } from "react-spring";
import { RadialCard } from "../../../components/Charts";
import ContentNav from "../../../components/ContentNav";
import { Pill, ValuePill } from "../../../components/Pill";
import {
  ACTIVATED_DISTRICTS,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from "../../../lib/common";
import { CareSummary } from "../../../lib/types";
import { Parameterize } from "../../../utils/parser";

interface CapacityProps {
  districtName: string;
  data: CareSummary;
}

const Capacity: React.FC<CapacityProps> = ({ data }) => {
  const router = useRouter();
  const districtName = router.query.districtName;
  console.log(districtName);
  console.log(data);

  return (
    <div className="2xl:container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={11231} />
        <ValuePill title="Oxygen Capacity" value={121} />
        <ValuePill title="Live Patients" value={87467} />
        <ValuePill title="Discharged Patients" value={9875} />
        <Pill title="Forecast">
          <Button size="small" className="bg-transparent shadow-xs w-full">
            <ArrowRight className="h-4" />
          </Button>
        </Pill>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 my-5">
        {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => (
          <RadialCard
            count={20}
            current={{ total: 100, used: 50 }}
            previous={{ total: 100, used: 49 }}
            label={k.name}
            key={k.id}
          />
        ))}
        {AVAILABILITY_TYPES_ORDERED.map((k) => (
          <RadialCard
            label={AVAILABILITY_TYPES[k]}
            count={20}
            current={{ total: 100, used: 50 }}
            previous={{ total: 100, used: 49 }}
            key={k}
          />
        ))}
      </div>
    </div>
  );
};

type Params = {
  params: {
    districtName: string;
  };
};

export const getServerSideProps = async ({ params }: Params) => {
  const districtId = ACTIVATED_DISTRICTS.find(
    (e) => Parameterize(e.name) === Parameterize(params?.districtName)
  )?.id;

  if (districtId) {
    const res = await axios.get<CareSummary>(
      "https://careapi.coronasafe.in/api/v1/facility_summary?district=" +
        districtId
    );
    return {
      props: {
        data: res.data,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default Capacity;
